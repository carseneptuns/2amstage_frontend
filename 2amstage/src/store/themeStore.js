import { create } from "zustand";
import { persist } from "zustand/middleware";

function applyTheme(mode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: "light", // "light" (Apple) | "dark" (Linear)

      setMode: (mode) => {
        applyTheme(mode);
        set({ mode });
      },

      toggle: () => {
        const next = get().mode === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ mode: next });
      },

      // Called once on app boot to sync the <html> class with whatever
      // was persisted (or the system preference, on first-ever visit).
      init: () => {
        const stored = get().mode;
        const hasPersisted = typeof window !== "undefined" && window.localStorage.getItem("2amstage-theme");
        const initial = hasPersisted
          ? stored
          : window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        applyTheme(initial);
        set({ mode: initial });
      },
    }),
    {
      name: "2amstage-theme",
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
