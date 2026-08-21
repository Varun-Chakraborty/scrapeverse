"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Filters } from "@/lib/types";
import { defaultFilters } from "@/lib/mock-data";

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const difficultyLevels = [
  { value: "any", label: "Any" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const languages = [
  "any",
  "Rust",
  "C",
  "C++",
  "Go",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Kotlin",
  "Zig",
];

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="mb-3 text-[11px] font-bold tracking-[0.14em] text-foreground uppercase">
          Difficulty
        </h3>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter by difficulty"
        >
          {difficultyLevels.map((d) => {
            const isActive = filters.maxDifficulty === d.value;
            return (
              <button
                key={d.value}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  update("maxDifficulty", d.value as Filters["maxDifficulty"])
                }
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary text-white shadow-[0_4px_12px_-4px_rgb(201_54_99/0.5)]"
                    : "border-border bg-card text-muted-foreground hover:border-primary/35 hover:text-secondary-foreground"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border/70" />

      <div>
        <h3 className="mb-3 text-[11px] font-bold tracking-[0.14em] text-foreground uppercase">
          Language
        </h3>
        <select
          value={filters.language}
          onChange={(e) => update("language", e.target.value)}
          aria-label="Filter by language"
          className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23857079%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 pr-9 text-sm text-foreground outline-none transition-all duration-200 hover:border-primary/35 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          {languages.map((l) => (
            <option key={l} value={l}>
              {l === "any" ? "Any language" : l}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px bg-border/70" />

      <label className="flex cursor-pointer items-center gap-3">
        <span className="relative inline-flex">
          <input
            type="checkbox"
            checked={filters.beginnerFriendlyOnly}
            onChange={(e) => update("beginnerFriendlyOnly", e.target.checked)}
            className="peer size-4.5 cursor-pointer appearance-none rounded-md border border-input bg-card transition-all duration-200 checked:border-primary checked:bg-primary focus-visible:ring-4 focus-visible:ring-ring/25"
          />
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 text-white opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          Beginner friendly only
        </span>
      </label>

      <button
        type="button"
        onClick={() => onChange(defaultFilters)}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary-softer hover:text-primary"
      >
        <HugeiconsIcon icon={RefreshIcon} size={13} />
        Reset all filters
      </button>
    </div>
  );
}
