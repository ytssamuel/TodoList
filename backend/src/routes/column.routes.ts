import { Router } from "express";
import * as columnController from "@/controllers/column.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/:projectId", columnController.getColumns);
router.post("/:projectId", columnController.createColumn);
router.put("/reorder", columnController.reorderColumns);
router.put("/:id", columnController.updateColumn);
router.delete("/:id", columnController.deleteColumn);

export default router;
