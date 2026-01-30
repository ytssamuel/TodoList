import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorResponse } from "@/utils/response";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("錯誤:", err);

  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    err.errors.forEach((e) => {
      const path = e.path.join(".");
      details[path] = e.message;
    });

    res.status(400).json(
      errorResponse("VALIDATION_ERROR", "請求參數驗證失敗", details)
    );
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json(errorResponse("AUTH_ERROR", "認證失敗"));
    return;
  }

  res.status(500).json(
    errorResponse("INTERNAL_ERROR", "伺服器內部錯誤")
  );
}
