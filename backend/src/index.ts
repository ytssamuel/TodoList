import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "@/routes/auth.routes";
import projectRoutes from "@/routes/project.routes";
import taskRoutes from "@/routes/task.routes";
import columnRoutes from "@/routes/column.routes";
import testRoutes from "@/routes/test.routes";
import { errorHandler } from "@/middlewares/error.middleware";
import { notFoundHandler } from "@/middlewares/not-found.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "待辦事項管理系統 API",
    version: "1.0.0",
    documentation: "/api/test",
    health: "/api/test/health",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/test", testRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 伺服器運行中：http://localhost:${PORT}`);
  console.log(`📦 環境：${process.env.NODE_ENV || "development"}`);
  console.log(`📖 API 文件：http://localhost:${PORT}/api/test`);
});

export default app;
