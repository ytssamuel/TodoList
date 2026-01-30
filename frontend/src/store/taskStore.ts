import { create } from "zustand";
import type { Task, Column } from "@/lib/types";

interface TaskState {
  tasks: Task[];
  columns: Column[];
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: string, newIndex: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  columns: [],
  setTasks: (tasks) => set({ tasks }),
  setColumns: (columns) => set({ columns }),
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  moveTask: (taskId, newStatus, newIndex) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus as Task["status"], orderIndex: newIndex }
          : t
      ),
    })),
}));
