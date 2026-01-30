import { Request, Response } from "express";
import { z } from "zod";
import prisma from "@/utils/prisma";
import { hashPassword, comparePassword, generateToken } from "@/utils/auth";
import { successResponse, errorResponse } from "@/utils/response";
import { AuthRequest, authMiddleware } from "@/middlewares/auth.middleware";

const registerSchema = z.object({
  email: z.string().email("無效的 email 格式"),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  name: z.string().min(2, "名稱至少需要 2 個字元").optional(),
});

const loginSchema = z.object({
  email: z.string().email("無效的 email 格式"),
  password: z.string().min(1, "請輸入密碼"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "名稱至少需要 2 個字元").optional(),
  avatarUrl: z.string().url("無效的 URL 格式").optional(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      res.status(409).json(errorResponse("CONFLICT", "此 email 已被註冊"));
      return;
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || data.email.split("@")[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const accessToken = generateToken({ userId: user.id, email: user.email });

    res.status(201).json(
      successResponse({
        user,
        accessToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "帳號或密碼錯誤"));
      return;
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      res.status(401).json(errorResponse("AUTH_ERROR", "帳號或密碼錯誤"));
      return;
    }

    const accessToken = generateToken({ userId: user.id, email: user.email });

    res.json(
      successResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json(errorResponse("NOT_FOUND", "用戶不存在"));
      return;
    }

    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json(successResponse({ message: "已成功登出" }));
};

export default {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};
