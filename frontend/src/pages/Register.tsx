import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.accessToken);
      toast({ title: "註冊成功", description: "歡迎加入！" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "註冊失敗", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-muted">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">TaskManager</CardTitle>
          </div>
          <CardDescription className="text-center font-mono text-xs">建立新帳號</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono text-xs">USERNAME *</Label>
              <Input id="username" className="font-mono" {...register("username")} placeholder="3-50 字元" />
              {errors.username && <p className="text-sm text-red-500 font-mono text-xs">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono text-xs">DISPLAY NAME</Label>
              <Input id="name" className="font-mono" {...register("name")} placeholder="顯示名稱" />
              {errors.name && <p className="text-sm text-red-500 font-mono text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs">EMAIL</Label>
              <Input id="email" type="email" className="font-mono" {...register("email")} placeholder="you@example.com" />
              {errors.email && <p className="text-sm text-red-500 font-mono text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs">PASSWORD *</Label>
              <Input id="password" type="password" className="font-mono" {...register("password")} placeholder="至少 8 個字元" />
              {errors.password && <p className="text-sm text-red-500 font-mono text-xs">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-mono text-xs">CONFIRM PASSWORD *</Label>
              <Input id="confirmPassword" type="password" className="font-mono" {...register("confirmPassword")} placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-sm text-red-500 font-mono text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full font-mono text-xs" disabled={isSubmitting}>
              {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              已有帳號？<Link to="/login" className="text-primary hover:underline font-mono text-xs">LOGIN</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
