import api from "@/lib/api";
import type { ApiResponse, Task, Column } from "@/lib/types";
import type { TaskInput } from "@/lib/validations";

export const taskService = {
  async getProjectTasks(projectId: string): Promise<{ tasks: Task[]; columns: Column[] }> {
    const response = await api.get<ApiResponse<{ tasks: Task[]; columns: Column[] }>>(`/tasks/project/${projectId}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "取得任務失敗");
    }
    return response.data.data!;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "取得任務失敗");
    }
    return response.data.data!;
  },

  async createTask(data: TaskInput & { projectId: string }): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "建立任務失敗");
    }
    return response.data.data!;
  },

  async updateTask(id: string, data: Partial<TaskInput>): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "更新任務失敗");
    }
    return response.data.data!;
  },

  async deleteTask(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/tasks/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "刪除任務失敗");
    }
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "更新狀態失敗");
    }
    return response.data.data!;
  },

  async reorderTask(id: string, orderIndex: number, columnId: string): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}/order`, { orderIndex, columnId });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "更新排序失敗");
    }
    return response.data.data!;
  },

  async addDependency(taskId: string, dependsOnId: string): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/tasks/${taskId}/dependencies`, { dependsOnId });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "新增依賴失敗");
    }
    return response.data.data!;
  },

  async removeDependency(taskId: string, depId: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/tasks/${taskId}/dependencies/${depId}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "移除依賴失敗");
    }
  },
};
