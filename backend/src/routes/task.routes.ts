import { Router } from "express";
import * as taskController from "@/controllers/task.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/project/:projectId", taskController.getProjectTasks);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.put("/:id/status", taskController.updateTaskStatus);
router.put("/:id/order", taskController.reorderTask);
router.post("/:id/dependencies", taskController.addDependency);
router.delete("/:id/dependencies/:depId", taskController.removeDependency);

export default router;
