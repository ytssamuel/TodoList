import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { useProjectStore } from "@/store/projectStore";
import { taskService } from "@/services/task";
import { projectService } from "@/services/project";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { ArrowLeft, Plus, Lock } from "lucide-react";

export function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, setTasks, columns, setColumns, updateTask } = useTaskStore();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updated = await taskService.updateStatus(taskId, newStatus);
      updateTask(taskId, updated);
    } catch (error: any) {
      toast({ title: "更新失敗", description: error.message, variant: "destructive" });
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新建任務
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`bg-muted rounded-lg p-4 ${column.isLocked ? "border-l-4 border-orange-500" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{column.name}</h3>
                  {column.isLocked && <Lock className="h-4 w-4 text-orange-500" />}
                </div>
                <Badge variant="secondary">{getTasksByStatus(column.name.toUpperCase().replace(" ", "_")).length}</Badge>
              </div>
              <div className="space-y-2">
                {getTasksByStatus(column.name.toUpperCase().replace(" ", "_")).map((task) => (
                  <div key={task.id} className="bg-card p-3 rounded shadow-sm cursor-pointer hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium line-clamp-2">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                      {task.assignee && (
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
