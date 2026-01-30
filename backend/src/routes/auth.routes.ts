import { Router } from "express";
import * as authController from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put("/profile", authMiddleware, authController.updateProfile);
router.put("/password", authMiddleware, authController.changePassword);
router.post("/avatar", authMiddleware, authController.uploadAvatar);
router.delete("/account", authMiddleware, authController.deleteAccount);
router.post("/logout", authController.logout);

export default router;
