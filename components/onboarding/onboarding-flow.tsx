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
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
} from "@/lib/types";

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
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid-rose mask-fade-b absolute inset-0" />
        <div className="absolute -top-24 left-1/2 h-96 w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_107_149/0.13),transparent)] blur-2xl" />
        <div className="animate-float absolute top-1/3 -left-24 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(155_140_240/0.12),transparent)] blur-2xl" />
        <div className="animate-float-delayed absolute right-[-6rem] bottom-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(244_162_107/0.11),transparent)] blur-2xl" />
      </div>

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
