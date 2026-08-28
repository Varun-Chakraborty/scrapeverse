"use client";

import { cn } from "@/lib/utils";
import { SelectionPill } from "@/components/ui/selection-pill";
import { StepHeader } from "./step-header";
import type { Interest } from "@/lib/types";
import { interestOptions } from "@/lib/mock-data";

interface StepInterestsProps {
  selected: Interest[];
  onToggle: (interest: Interest) => void;
}

export function StepInterests({ selected, onToggle }: StepInterestsProps) {
  return (
    <div className="mx-auto w-full">
      <StepHeader
        step={1}
        title="What interests you?"
        description="Select as many as you like — we'll find projects that match."
      />

      <div
        className="flex flex-wrap justify-center gap-2.5"
        role="group"
        aria-label="Your interests"
      >
        {interestOptions.map((interest, i) => {
          const isSelected = selected.includes(interest.value);
          return (
            <SelectionPill
              key={interest.value}
              selected={isSelected}
              showCheck
              onClick={() => onToggle(interest.value)}
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "text-base transition-transform duration-200",
                  isSelected && "scale-110",
                )}
              >
                {interest.icon}
              </span>
              {interest.label}
            </SelectionPill>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="animate-fade-in mt-6 text-center text-xs font-medium text-muted-foreground">
          {selected.length} {selected.length === 1 ? "interest" : "interests"}{" "}
          selected
        </p>
      )}
    </div>
  );
}
