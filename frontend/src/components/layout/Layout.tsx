import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings, LogOut, Sun, Moon, Monitor, Terminal } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

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
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Terminal className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">TaskManager</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t bg-muted/30 p-4">
          <div className="mb-3">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 font-mono text-xs" onClick={cycleTheme}>
              {getThemeIcon()}
              <span>{theme.toUpperCase()}</span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-xs">{user?.name ? getInitials(user.name) : "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "用戶"}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">@{user?.username || "user"}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout} title="登出">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
      <main className="pl-64">
        <div className="container py-6">{<Outlet />}</div>
      </main>
    </div>
  );
}
