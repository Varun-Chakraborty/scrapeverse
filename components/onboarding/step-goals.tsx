"use client";

import { cn } from "@/lib/utils";
import type { Goal } from "@/lib/types";
import { goalOptions } from "@/lib/mock-data";

interface StepGoalsProps {
  selected: Goal[];
  onToggle: (goal: Goal) => void;
}

export function StepGoals({ selected, onToggle }: StepGoalsProps) {
  return (
    <div className="mx-auto w-full">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
          Step 3 of 5
        </p>
        <h2 className="font-heading mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          What are your goals?
        </h2>
        <p className="mt-2.5 text-sm text-muted-foreground">
          Select what you want to achieve — pick as many as apply.
        </p>
      </div>

      <div className="grid gap-3" role="group" aria-label="Your goals">
        {goalOptions.map((goal, i) => {
          const isSelected = selected.includes(goal.value);
          return (
            <button
              key={goal.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(goal.value)}
              style={{ animationDelay: `${i * 50}ms` }}
              className={cn(
                "animate-fade-up group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-soft",
                isSelected
                  ? "border-primary/50 bg-primary-softer shadow-[0_0_0_1px_rgb(201_54_99/0.25)]"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                  isSelected
                    ? "scale-100 border-primary bg-primary text-white"
                    : "border-input bg-card group-hover:border-primary/40"
                )}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={cn(
                    "transition-all duration-200",
                    isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  )}
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="text-sm font-semibold text-foreground">
                  {goal.label}
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {goal.description}
                </p>
              </span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="animate-fade-in mt-6 text-center text-xs font-medium text-muted-foreground">
          {selected.length} {selected.length === 1 ? "goal" : "goals"} selected
        </p>
      )}
    </div>
  );
}
