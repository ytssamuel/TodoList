import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "@/utils/prisma";
import { successResponse, errorResponse } from "@/utils/response";
import { AuthRequest } from "@/middlewares/auth.middleware";

const createColumnSchema = z.object({
  name: z.string().min(1, "列名稱不能為空").max(50, "列名稱最多 50 個字元"),
  isLocked: z.boolean().default(false),
});

const updateColumnSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  isLocked: z.boolean().optional(),
});

const reorderColumnsSchema = z.object({
  columns: z.array(z.object({
    id: z.string().uuid(),
    orderIndex: z.number().int().min(0),
  })),
});

export const getColumns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const { projectId } = req.params;

    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: req.user.userId },
    });

    if (!membership) {
      res.status(403).json(errorResponse("PERMISSION_ERROR", "無權限"));
      return;
    }

    const columns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { orderIndex: "asc" },
    });

    res.json(successResponse(columns));
  } catch (error) {
    next(error);
  }
};

export const createColumn = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const { projectId } = req.params;
    const data = createColumnSchema.parse(req.body);

    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: req.user.userId, role: { in: ["OWNER", "ADMIN"] } },
    });

    if (!membership) {
      res.status(403).json(errorResponse("PERMISSION_ERROR", "無權限新增列"));
      return;
    }

    const lastColumn = await prisma.column.findFirst({
      where: { projectId },
      orderBy: { orderIndex: "desc" },
    });

    const orderIndex = (lastColumn?.orderIndex ?? -1) + 1;

    const column = await prisma.column.create({
      data: { ...data, projectId, orderIndex },
    });

    res.status(201).json(successResponse(column));
  } catch (error) {
    next(error);
  }
};

export const updateColumn = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const { id } = req.params;
    const data = updateColumnSchema.parse(req.body);

    const column = await prisma.column.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!column) {
      res.status(404).json(errorResponse("NOT_FOUND", "列不存在"));
      return;
    }

    const membership = await prisma.projectMember.findFirst({
      where: { projectId: column.projectId, userId: req.user.userId, role: { in: ["OWNER", "ADMIN"] } },
    });

    if (!membership) {
      res.status(403).json(errorResponse("PERMISSION_ERROR", "無權限"));
      return;
    }

    const updated = await prisma.column.update({
      where: { id },
      data,
    });

    res.json(successResponse(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const { id } = req.params;

    const column = await prisma.column.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!column) {
      res.status(404).json(errorResponse("NOT_FOUND", "列不存在"));
      return;
    }

    const membership = await prisma.projectMember.findFirst({
      where: { projectId: column.projectId, userId: req.user.userId, role: { in: ["OWNER", "ADMIN"] } },
    });

    if (!membership) {
      res.status(403).json(errorResponse("PERMISSION_ERROR", "無權限"));
      return;
    }

    await prisma.column.delete({ where: { id } });

    res.json(successResponse({ message: "列已刪除" }));
  } catch (error) {
    next(error);
  }
};

export const reorderColumns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(errorResponse("AUTH_ERROR", "未登入"));
      return;
    }

    const { projectId } = req.params;
    const data = reorderColumnsSchema.parse(req.body);

    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: req.user.userId, role: { in: ["OWNER", "ADMIN"] } },
    });

    if (!membership) {
      res.status(403).json(errorResponse("PERMISSION_ERROR", "無權限"));
      return;
    }

    await prisma.$transaction(
      data.columns.map((col) =>
        prisma.column.update({
          where: { id: col.id },
          data: { orderIndex: col.orderIndex },
        })
      )
    );

    const columns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { orderIndex: "asc" },
    });

    res.json(successResponse(columns));
  } catch (error) {
    next(error);
  }
};

export default {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
};
