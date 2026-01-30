export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  members?: ProjectMember[];
  membersCount?: number;
  tasksCount?: {
    total: number;
    done: number;
  };
  columns?: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  orderIndex: number;
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
  dependencies: TaskDependency[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskDependency {
  id: string;
  dependsOn: {
    id: string;
    title: string;
    status: TaskStatus;
  };
}

export interface Column {
  id: string;
  name: string;
  orderIndex: number;
  isLocked: boolean;
  projectId?: string;
}

export type TaskStatus = "BACKLOG" | "READY" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}
