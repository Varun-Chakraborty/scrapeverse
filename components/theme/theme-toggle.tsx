"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-primary-soft hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <HugeiconsIcon
        icon={isDark ? Moon02Icon : Sun03Icon}
        size={18}
        className="transition-transform duration-500 group-hover:rotate-45"
      />
    </button>
  );
}
