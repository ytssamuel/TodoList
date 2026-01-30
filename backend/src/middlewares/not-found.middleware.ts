import { Request, Response } from "express";
import { errorResponse } from "@/utils/response";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    errorResponse("NOT_FOUND", `路由 ${req.method} ${req.path} 不存在`)
  );
}
