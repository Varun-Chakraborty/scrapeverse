"use client";

import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/lib/types";

interface ProgressBarProps {
  currentStep: OnboardingStep;
  totalSteps: number;
}

const stepLabels = [
  "Interests",
  "Experience",
  "Goals",
  "Languages",
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mx-auto mb-10 w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const step = (i + 1) as OnboardingStep;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-colors duration-300",
                isActive && "text-primary",
                isComplete && "text-secondary-foreground",
                !isActive && !isComplete && "text-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-300",
                  isActive &&
                    "scale-110 border-primary bg-primary text-white shadow-[0_4px_12px_-2px_rgb(201_54_99/0.5)]",
                  isComplete &&
                    "border-primary/30 bg-primary-soft text-primary",
                  !isActive &&
                    !isComplete &&
                    "border-border bg-card text-muted-foreground/50"
                )}
              >
                {isComplete ? (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="hidden text-[10px] font-medium sm:block">{label}</span>
            </div>
          );
        })}
      </div>

      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Onboarding progress: step ${currentStep} of ${totalSteps}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-primary-soft"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-[#9b8cf0] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
