import { useEffect } from "react";
import { useThemeStore, initTheme } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return <>{children}</>;
}
