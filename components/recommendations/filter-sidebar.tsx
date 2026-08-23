"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Filters } from "@/lib/types";
import { defaultFilters, languageOptions } from "@/lib/mock-data";

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

const languages = ["any", ...languageOptions.map((l) => l.value)];

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
                  "cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200",
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
        <Select
          value={filters.language}
          onValueChange={(value) => update("language", value ?? "any")}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-input bg-card text-sm hover:border-primary/35">
            <SelectValue placeholder="Any language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l} value={l} className="text-xs">
                {l === "any" ? "Any language" : l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-border/70" />

      <button
        type="button"
        onClick={() => onChange(defaultFilters)}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary-softer hover:text-primary"
      >
        <HugeiconsIcon icon={RefreshIcon} size={13} />
        Reset all filters
      </button>
    </div>
  );
}
