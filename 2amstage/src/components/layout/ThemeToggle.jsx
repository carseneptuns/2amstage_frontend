import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

export function ThemeToggleRow() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Mode Terang" : "Mode Gelap"}
    </button>
  );
}

export default function ThemeToggle({ className = "" }) {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline/15 bg-hairline/[0.02] text-mid transition hover:border-hairline/25 hover:text-hi dark:rounded-md ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
