import { useEffect } from "react";
import { initTheme } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();
  }, []);

  return <>{children}</>;
}
