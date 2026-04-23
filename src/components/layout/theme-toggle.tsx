"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

const cycle = { light: "dark", dark: "system", system: "light" } as const;

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const labels = {
  light: "Switch to dark mode",
  dark: "Switch to system theme",
  system: "Switch to light mode",
} as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = icons[theme];

  return (
    <button
      onClick={() => setTheme(cycle[theme])}
      aria-label={labels[theme]}
      title={labels[theme]}
      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
