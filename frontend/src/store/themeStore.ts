import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme();
      },
      applyTheme: () => {
        const { theme } = get();
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          root.classList.add(systemTheme);
          set({ resolvedTheme: systemTheme });
        } else {
          root.classList.add(theme);
          set({ resolvedTheme: theme });
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.applyTheme();
      },
    }
  )
);

export function initTheme() {
  const { applyTheme } = useThemeStore.getState();
  applyTheme();

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const { theme } = useThemeStore.getState();
    if (theme === "system") {
      applyTheme();
    }
  });
}
