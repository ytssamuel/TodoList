import { Router } from "express";
import * as projectController from "@/controllers/project.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.get("/:id", projectController.getProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.get("/:id/members", projectController.getMembers);
router.post("/:id/members", projectController.addMember);
router.delete("/:id/members/:userId", projectController.removeMember);

export default router;
