import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/auth";
import { projectService } from "@/services/project";
import { toast } from "@/hooks/use-toast";

export function ApiTest() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setResponse("");
    try {
      const result = await authService.login({ username, password });
      setToken(result.accessToken);
      localStorage.setItem("token", result.accessToken);
      setResponse(JSON.stringify(result, null, 2));
      toast({ title: "登入成功" });
    } catch (error: any) {
      setResponse(`錯誤: ${error.message}`);
      toast({ title: "登入失敗", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGetProjects = async () => {
    setLoading(true);
    setResponse("");
    try {
      const result = await projectService.getProjects();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse(`錯誤: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem("token");
    setToken("");
    toast({ title: "Token 已清除" });
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API 測試介面</h1>
      
      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="auth">認證</TabsTrigger>
          <TabsTrigger value="projects">專案 API</TabsTrigger>
          <TabsTrigger value="info">系統資訊</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>登入測試</CardTitle>
              <CardDescription>測試使用者登入功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>使用者名稱</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label>密碼</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密碼" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleLogin} disabled={loading}>登入</Button>
                <Button variant="outline" onClick={handleClearToken}>清除 Token</Button>
              </div>
              <div className="space-y-2">
                <Label>目前 Token</Label>
                <Input value={token} readOnly className="font-mono text-xs" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>專案 API 測試</CardTitle>
              <CardDescription>測試專案相關 API</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button onClick={handleGetProjects} disabled={loading || !token}>
                取得專案列表
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>系統資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>前端版本:</strong> 1.0.0</p>
              <p><strong>React 版本:</strong> {React.version}</p>
              <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || "http://localhost:3000"}</p>
              <p><strong>登入狀態:</strong> {token ? "已登入" : "未登入"}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {response && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>API 回應</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">{response}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
