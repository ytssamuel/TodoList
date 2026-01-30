import api from "@/lib/api";
import type { ApiResponse, User } from "@/lib/types";
import type { LoginInput, RegisterInput, UpdateProfileInput, ChangePasswordInput } from "@/lib/validations";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "登入失敗");
    }
    return response.data.data!;
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "註冊失敗");
    }
    return response.data.data!;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "取得用戶資料失敗");
    }
    return response.data.data!;
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    const response = await api.put<ApiResponse<User>>("/auth/profile", data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "更新失敗");
    }
    return response.data.data!;
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    const response = await api.put<ApiResponse<{ message: string }>>("/auth/password", data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "密碼更新失敗");
    }
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post<ApiResponse<User>>("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "上傳失敗");
    }
    return response.data.data!;
  },

  async deleteAccount(password: string): Promise<void> {
    const response = await api.delete<ApiResponse<{ message: string }>>("/auth/account", {
      data: { confirmPassword: password },
    });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "刪除失敗");
    }
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
