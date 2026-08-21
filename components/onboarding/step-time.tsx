"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TimeQuarterIcon, TimeHalfPassIcon, Timer01Icon, TimeManagementIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TimeCommitment } from "@/lib/types";
import { timeOptions } from "@/lib/mock-data";

interface StepTimeProps {
  selected: TimeCommitment | null;
  onSelect: (time: TimeCommitment) => void;
}

const timeIcons = [TimeQuarterIcon, TimeHalfPassIcon, Timer01Icon, TimeManagementIcon];

export function StepTime({ selected, onSelect }: StepTimeProps) {
  return (
    <div className="mx-auto w-full">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
          Step 5 of 5
        </p>
        <h2 className="font-heading mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          How much time can you commit?
        </h2>
        <p className="mt-2.5 text-sm text-muted-foreground">
          We&apos;ll suggest projects that fit your schedule.
        </p>
      </div>

      <RadioGroup
        value={selected ?? undefined}
        onValueChange={(value) => onSelect(value as TimeCommitment)}
        className="grid grid-cols-1 gap-3.5 sm:grid-cols-2"
      >
        {timeOptions.map((option, i) => {
          const isSelected = selected === option.value;
          const Icon = timeIcons[i % timeIcons.length];
          return (
            <label
              key={option.value}
              style={{ animationDelay: `${i * 70}ms` }}
              className={cn(
                "animate-fade-up flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-soft",
                isSelected
                  ? "border-primary/50 bg-primary-softer shadow-[0_0_0_1px_rgb(201_54_99/0.25)]"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <RadioGroupItem value={option.value} className="mt-0.5" />
              <div>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mb-2 flex size-9 items-center justify-center rounded-xl transition-colors duration-200",
                    isSelected ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon icon={Icon} size={18} />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <p className="mt-0.5 text-xs font-medium text-secondary-foreground">
                  {option.value}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
