import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "淺色";
      case "dark":
        return "深色";
      default:
        return "系統";
    }
  };

  return (
    <Button
      variant="ghost"
      size={showLabel ? "sm" : "icon"}
      onClick={cycleTheme}
      className={className}
      title={`目前：${getThemeLabel()}，點擊切換`}
    >
      {getThemeIcon()}
      {showLabel && <span className="ml-2 font-mono text-xs">{theme.toUpperCase()}</span>}
    </Button>
  );
}
