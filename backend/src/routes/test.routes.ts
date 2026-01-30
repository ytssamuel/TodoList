import { Router } from "express";
import { z } from "zod";

const router = Router();

const testSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

router.get("/", (req, res) => {
  res.json({
    name: "待辦事項管理系統 API",
    version: "1.0.0",
    status: "運行中",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        "POST /api/auth/register": "用戶註冊",
        "POST /api/auth/login": "用戶登入",
        "GET /api/auth/me": "取得當前用戶",
        "PUT /api/auth/profile": "更新個人資料",
        "POST /api/auth/logout": "登出",
      },
      projects: {
        "GET /api/projects": "取得所有專案",
        "POST /api/projects": "建立專案",
        "GET /api/projects/:id": "取得專案詳情",
        "PUT /api/projects/:id": "更新專案",
        "DELETE /api/projects/:id": "刪除專案",
        "GET /api/projects/:id/members": "取得成員列表",
        "POST /api/projects/:id/members": "新增成員",
        "DELETE /api/projects/:id/members/:userId": "移除成員",
      },
      tasks: {
        "GET /api/tasks/project/:projectId": "取得專案所有任務",
        "POST /api/tasks": "建立任務",
        "GET /api/tasks/:id": "取得任務詳情",
        "PUT /api/tasks/:id": "更新任務",
        "DELETE /api/tasks/:id": "刪除任務",
        "PUT /api/tasks/:id/status": "更新任務狀態",
        "PUT /api/tasks/:id/order": "更新任務排序",
        "POST /api/tasks/:id/dependencies": "新增依賴",
        "DELETE /api/tasks/:id/dependencies/:depId": "移除依賴",
      },
      columns: {
        "GET /api/columns/:projectId": "取得所有列",
        "POST /api/columns/:projectId": "建立列",
        "PUT /api/columns/:id": "更新列",
        "DELETE /api/columns/:id": "刪除列",
        "PUT /api/columns/reorder": "重新排序",
      },
    },
  });
});

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

router.post("/test", (req, res) => {
  try {
    const data = testSchema.parse(req.body);
    res.json({
      success: true,
      received: data,
      echo: {
        message: data.message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : "Invalid request",
    });
  }
});

export default router;
