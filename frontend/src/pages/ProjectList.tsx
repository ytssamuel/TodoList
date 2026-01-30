import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProjectStore } from "@/store/projectStore";
import { projectService } from "@/services/project";
import { toast } from "@/hooks/use-toast";
import { Plus, FolderKanban, Users, CheckCircle2, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectList() {
  const navigate = useNavigate();
  const { projects, setProjects, addProject, removeProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("載入專案失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProjectInput) => {
    try {
      const newProject = await projectService.createProject(data);
      addProject(newProject);
      toast({ title: "專案建立成功", description: `「${data.name}」已建立` });
      setDialogOpen(false);
      reset();
    } catch (error: any) {
      toast({ title: "建立失敗", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("確定要刪除此專案嗎？此操作無法復原。")) {
      try {
        await projectService.deleteProject(id);
        removeProject(id);
        toast({ title: "專案已刪除" });
      } catch (error: any) {
        toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">專案</h1>
          <p className="text-muted-foreground">管理您的所有專案</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建專案
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>建立新專案</DialogTitle>
                <DialogDescription>輸入專案名稱和描述</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">專案名稱</Label>
                  <Input id="name" {...register("name")} placeholder="我的專案" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述（可選）</Label>
                  <Textarea id="description" {...register("description")} placeholder="專案描述..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "建立中..." : "建立"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse h-40" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">尚未有專案</h3>
          <p className="text-muted-foreground mb-4">建立您的第一個專案來開始管理任務</p>
          <Button onClick={() => setDialogOpen(true)}>建立專案</Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(project.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <CardHeader>
                  <CardTitle className="line-clamp-1 pr-8">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description || "無描述"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.members?.length || project.membersCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {project.tasksCount?.done || 0}/{project.tasksCount?.total || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
