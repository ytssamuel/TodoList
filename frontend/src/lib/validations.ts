import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "請輸入使用者名稱"),
  password: z.string().min(1, "請輸入密碼"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "使用者名稱至少需要 3 個字元").max(50, "使用者名稱最多 50 個字元"),
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  confirmPassword: z.string(),
  name: z.string().min(2, "名稱至少需要 2 個字元").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼不相符",
  path: ["confirmPassword"],
});

export const projectSchema = z.object({
  name: z.string().min(1, "專案名稱不能為空").max(100, "專案名稱最多 100 個字元"),
  description: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "任務標題不能為空").max(200, "任務標題最多 200 個字元"),
  description: z.string().optional(),
  status: z.enum(["BACKLOG", "READY", "IN_PROGRESS", "REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3, "使用者名稱至少需要 3 個字元").max(50).optional(),
  name: z.string().min(2, "名稱至少需要 2 個字元").optional(),
  avatarUrl: z.string().url("請輸入有效的 URL").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "請輸入目前密碼"),
  newPassword: z.string().min(8, "新密碼至少需要 8 個字元"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "新密碼不相符",
  path: ["confirmPassword"],
});

export const deleteAccountSchema = z.object({
  confirmPassword: z.string().min(1, "請輸入密碼以確認"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
