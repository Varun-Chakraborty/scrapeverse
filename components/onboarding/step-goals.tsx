"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/check-icon";
import { StepHeader } from "./step-header";
import { type Goal, GOALS } from "@/lib/user-profile";

interface StepGoalsProps {
  selected: Goal[];
  onToggle: (goal: Goal) => void;
}

export function StepGoals({ selected, onToggle }: StepGoalsProps) {
  return (
    <div className="mx-auto w-full">
      <StepHeader
        step={3}
        title="What are your goals?"
        description="Select what you want to achieve — pick as many as apply."
      />

      <div className="grid gap-3" role="group" aria-label="Your goals">
        {GOALS.map((goal, i) => {
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
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                  isSelected
                    ? "scale-100 border-primary bg-primary text-white"
                    : "border-input bg-card group-hover:border-primary/40",
                )}
              >
                <CheckIcon
                  size={11}
                  strokeWidth={1.8}
                  className={cn(
                    "transition-all duration-200",
                    isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                />
              </span>
              <span>
                <span className="text-sm font-semibold text-foreground">
                  {goal.value}
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
