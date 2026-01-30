import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };
  return colors[priority] || colors.MEDIUM;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BACKLOG: "bg-gray-100 text-gray-800",
    READY: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    REVIEW: "bg-purple-100 text-purple-800",
    DONE: "bg-green-100 text-green-800",
  };
  return colors[status] || colors.BACKLOG;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    BACKLOG: "待整理",
    READY: "準備開始",
    IN_PROGRESS: "進行中",
    REVIEW: "待審核",
    DONE: "已完成",
  };
  return labels[status] || status;
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: "低",
    MEDIUM: "中",
    HIGH: "高",
    URGENT: "緊急",
  };
  return labels[priority] || priority;
}
