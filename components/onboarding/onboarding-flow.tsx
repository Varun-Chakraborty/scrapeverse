"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { ProgressBar } from "./progress-bar";
import { StepInterests } from "./step-interests";
import { StepExperience } from "./step-experience";
import { StepGoals } from "./step-goals";
import { StepLanguages } from "./step-languages";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/ui/glow-orbs";
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
} from "@/lib/types";
import type { ProgrammingLanguage } from "@/lib/languages";

interface OnboardingFlowProps {
  currentStep: OnboardingStep;
  interests: Interest[];
  experienceLevel: ExperienceLevel | null;
  goals: Goal[];
  languages: ProgrammingLanguage[];
  customLanguages: string[];
  onToggleInterest: (interest: Interest) => void;
  onSelectExperience: (level: ExperienceLevel) => void;
  onToggleGoal: (goal: Goal) => void;
  onToggleLanguage: (lang: ProgrammingLanguage) => void;
  onAddCustomLanguage: (lang: string) => void;
  onRemoveCustomLanguage: (lang: string) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

function canProceed(
  step: OnboardingStep,
  interests: Interest[],
  experienceLevel: ExperienceLevel | null,
  goals: Goal[],
  languages: ProgrammingLanguage[],
  customLanguages: string[],
): boolean {
  switch (step) {
    case 1:
      return interests.length > 0;
    case 2:
      return experienceLevel !== null;
    case 3:
      return goals.length > 0;
    case 4:
      return languages.length > 0 || customLanguages.length > 0;
    default:
      return false;
  }
}

export function OnboardingFlow({
  currentStep,
  interests,
  experienceLevel,
  goals,
  languages,
  customLanguages,
  onToggleInterest,
  onSelectExperience,
  onToggleGoal,
  onToggleLanguage,
  onAddCustomLanguage,
  onRemoveCustomLanguage,
  onNext,
  onBack,
  onComplete,
}: OnboardingFlowProps) {
  const isLastStep = currentStep === 4;
  const canGo = canProceed(
    currentStep,
    interests,
    experienceLevel,
    goals,
    languages,
    customLanguages,
  );

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Soft background */}
      <GlowOrbs variant="compact" />

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="flex w-full flex-1 items-center">
        <div
          key={currentStep}
          className="animate-step-in mx-auto w-full max-w-2xl rounded-3xl border border-border/80 bg-card/85 p-6 shadow-lift backdrop-blur-xl sm:p-9"
        >
          {currentStep === 1 && (
            <StepInterests selected={interests} onToggle={onToggleInterest} />
          )}
          {currentStep === 2 && (
            <StepExperience
              selected={experienceLevel}
              onSelect={onSelectExperience}
            />
          )}
          {currentStep === 3 && (
            <StepGoals selected={goals} onToggle={onToggleGoal} />
          )}
          {currentStep === 4 && (
            <StepLanguages
              selected={languages}
              customLanguages={customLanguages}
              onToggle={onToggleLanguage}
              onAddCustom={onAddCustomLanguage}
              onRemoveCustom={onRemoveCustomLanguage}
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {currentStep > 1 && (
          <Button variant="ghost" size="lg" onClick={onBack}>
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Back
          </Button>
        )}
        <Button
          onClick={isLastStep ? onComplete : onNext}
          disabled={!canGo}
          size="lg"
          variant="gradient"
          className="px-8"
        >
          {isLastStep ? (
            <>
              <HugeiconsIcon icon={SparklesIcon} />
              See my recommendations
            </>
          ) : (
            <>
              Continue
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
