"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepHeader } from "./step-header";
import { type ExperienceLevel, EXPERIENCE_LEVELS } from "@/lib/user-profile";

interface StepExperienceProps {
  selected: ExperienceLevel | null;
  onSelect: (level: ExperienceLevel) => void;
}

export function StepExperience({ selected, onSelect }: StepExperienceProps) {
  return (
    <div className="mx-auto w-full">
      <StepHeader
        step={2}
        title="What's your experience level?"
        description="This helps us recommend the right difficulty of issues."
      />

      <RadioGroup
        value={selected ?? ""}
        onValueChange={(value) => onSelect(value as ExperienceLevel)}
        className="grid gap-3.5"
      >
        {EXPERIENCE_LEVELS.map((option, i) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              style={{ animationDelay: `${i * 80}ms` }}
              className={cn(
                "animate-fade-up flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-soft",
                isSelected
                  ? "border-primary/50 bg-primary-softer shadow-[0_0_0_1px_rgb(201_54_99/0.25),0_8px_24px_-12px_rgb(201_54_99/0.2)]"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <RadioGroupItem value={option.value} className="mt-0.5" />
              <div className="flex flex-1 items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl text-lg transition-colors duration-200",
                    isSelected ? "bg-primary-soft" : "bg-muted",
                  )}
                >
                  {option.icon}
                </span>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {option.value}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
