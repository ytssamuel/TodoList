import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Terminal } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.accessToken);
      toast({ title: "登入成功", description: "歡迎回來！" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "登入失敗", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <ThemeToggle className="absolute top-4 right-4" />
      <Card className="w-full max-w-md border-muted">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">TaskManager</CardTitle>
          </div>
          <CardDescription className="text-center font-mono text-xs">v1.0.0</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono text-xs">USERNAME</Label>
              <Input id="username" className="font-mono" {...register("username")} placeholder="your_username" />
              {errors.username && <p className="text-sm text-red-500 font-mono text-xs">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs">PASSWORD</Label>
              <Input id="password" type="password" className="font-mono" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="text-sm text-red-500 font-mono text-xs">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full font-mono text-xs" disabled={isSubmitting}>
              {isSubmitting ? "AUTHENTICATING..." : "LOGIN"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              還沒有帳號？<Link to="/register" className="text-primary hover:underline font-mono text-xs">REGISTER</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
