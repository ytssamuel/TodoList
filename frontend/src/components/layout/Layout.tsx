import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings, LogOut, Sun, Moon, Monitor, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-4 w-4" />;
      case "dark": return <Moon className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light": return "淺色";
      case "dark": return "深色";
      default: return "跟隨系統";
    }
  };

  const navItems = [
    { path: "/", label: "儀表板", icon: LayoutDashboard },
    { path: "/projects", label: "專案", icon: FolderKanban },
    { path: "/settings", label: "設定", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 ${collapsed ? "w-16" : "w-64"} border-r bg-card transition-all duration-300`}>
        <div className="flex h-16 items-center gap-2 border-b px-4 justify-between">
          {!collapsed && (
            <>
              <Terminal className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold tracking-tight">TaskManager</h1>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "展開" : "收合"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className={`p-4 ${collapsed ? "space-y-1" : "space-y-1"}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`${collapsed ? "justify-center px-0" : "justify-start gap-2"} w-full`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className={`absolute bottom-0 left-0 right-0 border-t bg-muted/30 p-4 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <div className={collapsed ? "mb-3" : "mb-3"}>
            <Button
              variant="outline"
              size="sm"
              className={`${collapsed ? "justify-center px-0 w-8" : "justify-start gap-2"} w-full font-mono text-xs`}
              onClick={cycleTheme}
              title={collapsed ? getThemeLabel() : undefined}
            >
              {getThemeIcon()}
              {!collapsed && <span>{theme.toUpperCase()}</span>}
            </Button>
          </div>
          <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl?.startsWith("/") ? `${API_URL}${user.avatarUrl}` : user?.avatarUrl} />
              <AvatarFallback className="text-xs">{user?.name ? getInitials(user.name) : "?"}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "用戶"}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">@{user?.username || "user"}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleLogout}
              title="登出"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
      <main className={collapsed ? "pl-16" : "pl-64"}>
        <div className="container py-6 transition-all duration-300"><Outlet /></div>
      </main>
    </div>
  );
}
