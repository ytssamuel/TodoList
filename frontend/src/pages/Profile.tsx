import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth";
import { changePasswordSchema, deleteAccountSchema, type ChangePasswordInput, type DeleteAccountInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getInitials } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Trash2, Upload, Save, Terminal } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editForm = useForm({
    defaultValues: {
      username: user?.username || "",
      name: user?.name || "",
    },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const deleteForm = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  });

  useEffect(() => {
    if (user) {
      console.log("User updated:", user.avatarUrl);
      editForm.reset({
        username: user.username,
        name: user.name,
      });
      if (!avatarFile) {
        setAvatarPreview(user.avatarUrl || null);
      }
    }
  }, [user, editForm, avatarFile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "檔案過大", description: "圖片大小不能超過 2MB", variant: "destructive" });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      const updatedUser = await authService.uploadAvatar(avatarFile);
      updateUser(updatedUser);
      setAvatarPreview(`${API_URL}${updatedUser.avatarUrl}`);
      setAvatarFile(null);
      toast({ title: "頭像已更新" });
    } catch (error: any) {
      toast({ title: "上傳失敗", description: error.message, variant: "destructive" });
    }
  };

  const onEditSubmit = async (data: any) => {
    try {
      const updateData: any = {};
      if (data.username) updateData.username = data.username;
      if (data.name) updateData.name = data.name;
      
      const updatedUser = await authService.updateProfile(updateData);
      updateUser(updatedUser);
      toast({ title: "資料已更新" });
    } catch (error: any) {
      toast({ title: "更新失敗", description: error.message, variant: "destructive" });
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    try {
      await authService.changePassword(data);
      toast({ title: "密碼已更新" });
      passwordForm.reset();
    } catch (error: any) {
      toast({ title: "更新失敗", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await authService.deleteAccount(deletePassword);
      logout();
      toast({ title: "帳號已刪除" });
      navigate("/login");
    } catch (error: any) {
      toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const getAvatarUrl = () => {
    // 如果有 avatarPreview
    if (avatarPreview) {
      // 如果是相對路徑，加上 API_URL
      if (avatarPreview.startsWith("/")) {
        return `${API_URL}${avatarPreview}`;
      }
      // 如果已是完整 URL（blob: 或 http），直接返回
      return avatarPreview;
    }
    // 否則使用 user.avatarUrl
    if (user?.avatarUrl) {
      if (user.avatarUrl.startsWith("/")) {
        return `${API_URL}${user.avatarUrl}`;
      }
      return user.avatarUrl;
    }
    return undefined;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Terminal className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">用戶設定</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">個人資料</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">安全性</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">危險區域</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>個人資料</CardTitle>
              <CardDescription>管理您的帳戶資訊</CardDescription>
            </CardHeader>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={getAvatarUrl()} />
                    <AvatarFallback className="text-2xl">{user?.name ? getInitials(user.name) : "?"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        選擇圖片
                      </Button>
                      {avatarFile && (
                        <Button type="button" size="sm" onClick={handleUploadAvatar} className="gap-2">
                          <Save className="h-4 w-4" />
                          上傳
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">支援 JPG, PNG, GIF, WebP，最大 2MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs">USERNAME</Label>
                  <Input {...editForm.register("username")} className="font-mono" placeholder="使用者名稱" />
                  {editForm.formState.errors.username && (
                    <p className="text-sm text-red-500 font-mono text-xs">{editForm.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs">EMAIL</Label>
                  <Input value={user?.email || ""} disabled className="font-mono bg-muted" />
                  <p className="text-xs text-muted-foreground">Email 無法修改</p>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs">DISPLAY NAME</Label>
                  <Input {...editForm.register("name")} className="font-mono" placeholder="顯示名稱" />
                  {editForm.formState.errors.name && (
                    <p className="text-sm text-red-500 font-mono text-xs">{editForm.formState.errors.name.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting ? "儲存中..." : "儲存變更"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>密碼管理</CardTitle>
              <CardDescription>更新您的密碼</CardDescription>
            </CardHeader>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">CURRENT PASSWORD</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    className="font-mono"
                    placeholder="輸入目前密碼"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500 font-mono text-xs">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs">NEW PASSWORD</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className="font-mono"
                    placeholder="至少 8 個字元"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500 font-mono text-xs">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs">CONFIRM NEW PASSWORD</Label>
                  <Input
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className="font-mono"
                    placeholder="再次輸入新密碼"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 font-mono text-xs">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={passwordForm.formState.isSubmitting} variant="outline">
                  {passwordForm.formState.isSubmitting ? "更新中..." : "更新密碼"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">刪除帳號</CardTitle>
              <CardDescription>
                刪除帳號後，所有資料將無法恢復。此操作無法撤銷。
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除帳號
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">確定要刪除帳號嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作將永久刪除您的帳號、所有專案和任務，且無法恢復。
              請輸入您的密碼以確認。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="輸入密碼確認"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="font-mono"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={!deletePassword || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "刪除中..." : "刪除帳號"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
