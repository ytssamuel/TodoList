import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "@/store/taskStore";
import { useProjectStore } from "@/store/projectStore";
import { taskService } from "@/services/task";
import { projectService } from "@/services/project";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { taskSchema, type TaskInput } from "@/lib/validations";
import { ArrowLeft, Plus, Lock, ChevronRight, ChevronLeft, Edit2, Trash2, AlertCircle } from "lucide-react";
import type { Task, Column } from "@/lib/types";

interface ColumnWithStatus extends Column {
  status: string;
}

const STATUS_OPTIONS = [
  { value: "BACKLOG", label: "待整理" },
  { value: "READY", label: "準備開始" },
  { value: "IN_PROGRESS", label: "進行中" },
  { value: "REVIEW", label: "待審核" },
  { value: "DONE", label: "已完成" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "低" },
  { value: "MEDIUM", label: "中" },
  { value: "HIGH", label: "高" },
  { value: "URGENT", label: "緊急" },
];

const getNextStatus = (currentStatus: string): string | null => {
  const currentIndex = STATUS_OPTIONS.findIndex((s) => s.value === currentStatus);
  if (currentIndex < STATUS_OPTIONS.length - 1) {
    return STATUS_OPTIONS[currentIndex + 1].value;
  }
  return null;
};

const getPrevStatus = (currentStatus: string): string | null => {
  const currentIndex = STATUS_OPTIONS.findIndex((s) => s.value === currentStatus);
  if (currentIndex > 0) {
    return STATUS_OPTIONS[currentIndex - 1].value;
  }
  return null;
};

export function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, setTasks, columns, setColumns, addTask, updateTask, removeTask } = useTaskStore();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const createForm = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { status: "BACKLOG", priority: "MEDIUM" },
  });

  const editForm = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (id) loadData();
    return () => {
      setCurrentProject(null);
      setTasks([]);
      setColumns([]);
    };
  }, [id]);

  const loadData = async () => {
    try {
      const [project, taskData] = await Promise.all([
        projectService.getProject(id!),
        taskService.getProjectTasks(id!),
      ]);
      setCurrentProject(project);
      setColumns(taskData.columns);
      setTasks(taskData.tasks);
    } catch (error: any) {
      toast({ title: "載入失敗", description: error.message, variant: "destructive" });
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const onCreateSubmit = async (data: TaskInput) => {
    if (!id) return;
    try {
      const newTask = await taskService.createTask({ ...data, projectId: id });
      addTask(newTask);
      toast({ title: "任務建立成功" });
      setCreateDialogOpen(false);
      createForm.reset({ status: "BACKLOG", priority: "MEDIUM" });
    } catch (error: any) {
      toast({ title: "建立失敗", description: error.message, variant: "destructive" });
    }
  };

  const onEditSubmit = async (data: TaskInput) => {
    if (!selectedTask) return;
    try {
      const updated = await taskService.updateTask(selectedTask.id, data);
      updateTask(selectedTask.id, updated);
      toast({ title: "任務更新成功" });
      setEditDialogOpen(false);
      setSelectedTask(null);
    } catch (error: any) {
      toast({ title: "更新失敗", description: error.message, variant: "destructive" });
    }
  };

  const handleMoveTask = async (task: Task, direction: "next" | "prev") => {
    const newStatus = direction === "next" ? getNextStatus(task.status) : getPrevStatus(task.status);
    if (!newStatus) {
      toast({ title: "無法移動", description: direction === "next" ? "任務已完成最後狀態" : "任務已在最初狀態" });
      return;
    }

    try {
      const updated = await taskService.updateStatus(task.id, newStatus);
      updateTask(task.id, updated);
      toast({ title: "任務已移動", description: `移動至：${getStatusLabel(newStatus)}` });
    } catch (error: any) {
      toast({ title: "移動失敗", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("確定要刪除此任務嗎？")) return;
    try {
      await taskService.deleteTask(taskId);
      removeTask(taskId);
      toast({ title: "任務已刪除" });
    } catch (error: any) {
      toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    editForm.reset({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });
    setEditDialogOpen(true);
  };

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  const getColumnInfo = (columnName: string): ColumnWithStatus | undefined => {
    const status = STATUS_OPTIONS.find((s) => s.label === columnName)?.value || columnName.toUpperCase().replace(" ", "_");
    return columns.find((c) => c.name === columnName);
  };

  if (loading) return <div className="p-8 text-center">載入中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentProject?.name}</h1>
            <p className="text-muted-foreground">{currentProject?.description || "無描述"}</p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建任務
        </Button>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
            <DialogHeader>
              <DialogTitle>建立新任務</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>任務標題</Label>
                <Input {...createForm.register("title")} placeholder="輸入任務標題" />
                {createForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{createForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>描述（可選）</Label>
                <Textarea {...createForm.register("description")} placeholder="任務描述..." />
              </div>
              <div className="space-y-2">
                <Label>優先級</Label>
                <Select
                  value={createForm.watch("priority")}
                  onValueChange={(v) => createForm.setValue("priority", v as any)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
              <Button type="submit" disabled={createForm.formState.isSubmitting}>
                {createForm.formState.isSubmitting ? "建立中..." : "建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
            <DialogHeader>
              <DialogTitle>編輯任務</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>任務標題</Label>
                <Input {...editForm.register("title")} />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>描述（可選）</Label>
                <Textarea {...editForm.register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>狀態</Label>
                  <Select
                    value={editForm.watch("status")}
                    onValueChange={(v) => editForm.setValue("status", v as any)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>優先級</Label>
                  <Select
                    value={editForm.watch("priority")}
                    onValueChange={(v) => editForm.setValue("priority", v as any)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="justify-between">
              <Button type="button" variant="destructive" onClick={() => selectedTask && handleDeleteTask(selectedTask.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting ? "儲存中..." : "儲存"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_OPTIONS.map((statusOpt, index) => {
          const column = getColumnInfo(statusOpt.label);
          const tasksInColumn = getTasksByStatus(statusOpt.value);
          const isLocked = column?.isLocked;
          const prevStatus = getPrevStatus(statusOpt.value);
          const nextStatus = getNextStatus(statusOpt.value);

          return (
            <div key={statusOpt.value} className="flex-shrink-0 w-80">
              <div className={`bg-muted rounded-lg p-4 ${isLocked ? "border-l-4 border-orange-500" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{statusOpt.label}</h3>
                    {isLocked && <Lock className="h-4 w-4 text-orange-500" title="此列需要按順序完成" />}
                  </div>
                  <Badge variant="secondary">{tasksInColumn.length}</Badge>
                </div>
                <div className="space-y-2">
                  {tasksInColumn.map((task) => {
                    const canMoveNext = nextStatus !== null;
                    const canMovePrev = prevStatus !== null;

                    return (
                      <div key={task.id} className="bg-card p-3 rounded shadow-sm group">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium line-clamp-2">{task.title}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openEditDialog(task)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              disabled={!canMovePrev}
                              onClick={() => handleMoveTask(task, "prev")}
                              title="移到上一階段"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              disabled={!canMoveNext}
                              onClick={() => handleMoveTask(task, "next")}
                              title="移到下一階段"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
