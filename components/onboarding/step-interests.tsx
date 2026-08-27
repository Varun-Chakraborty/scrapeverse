"use client";

import { cn } from "@/lib/utils";
import type { Interest } from "@/lib/types";
import { interestOptions } from "@/lib/mock-data";

interface StepInterestsProps {
  selected: Interest[];
  onToggle: (interest: Interest) => void;
}

export function StepInterests({ selected, onToggle }: StepInterestsProps) {
  return (
    <div className="mx-auto w-full">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
          Step 1 of 4
        </p>
        <h2 className="font-heading mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          What interests you?
        </h2>
        <p className="mt-2.5 text-sm text-muted-foreground">
          Select as many as you like — we&apos;ll find projects that match.
        </p>
      </div>

      <div
        className="flex flex-wrap justify-center gap-2.5"
        role="group"
        aria-label="Your interests"
      >
        {interestOptions.map((interest, i) => {
          const isSelected = selected.includes(interest.value);
          return (
            <button
              key={interest.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(interest.value)}
              style={{ animationDelay: `${i * 35}ms` }}
              className={cn(
                "animate-fade-up flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                "hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.97]",
                isSelected
                  ? "border-primary bg-primary text-white shadow-[0_6px_16px_-6px_rgb(201_54_99/0.55)]"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-secondary-foreground",
              )}
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
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-4 items-center justify-center rounded-full transition-all duration-200",
                  isSelected ? "scale-100 bg-white/25" : "scale-0",
                )}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
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
