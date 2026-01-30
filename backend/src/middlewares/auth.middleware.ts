import { Request, Response, NextFunction } from "express";
import { verifyToken, extractToken, JWTPayload } from "@/utils/auth";
import { errorResponse } from "@/utils/response";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json(errorResponse("AUTH_ERROR", "未提供認證 token"));
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json(errorResponse("AUTH_ERROR", "無效或已過期的 token"));
    return;
  }

  req.user = payload;
  next();
}

export function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}
