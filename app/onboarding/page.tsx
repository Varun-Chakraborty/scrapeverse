"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useAuth } from "@/lib/auth-context";
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  OnboardingPreferences,
} from "@/lib/types";

export default function Onboarding() {
  const router = useRouter();
  const { user, isLoading, updatePreferences } = useAuth();
  const [step, setStep] = useState<OnboardingStep>(1);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);

  const toggleItem = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
      setter((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
      );
    },
    [],
  );

  const handleToggleInterest = useCallback(
    (interest: Interest) => toggleItem(setInterests, interest),
    [toggleItem],
  );

  const handleToggleGoal = useCallback(
    (goal: Goal) => toggleItem(setGoals, goal),
    [toggleItem],
  );

  const handleToggleLanguage = useCallback(
    (lang: ProgrammingLanguage) => toggleItem(setLanguages, lang),
    [toggleItem],
  );

  const handleAddCustomLanguage = useCallback((lang: string) => {
    setCustomLanguages((prev) =>
      prev.includes(lang) ? prev : [...prev, lang],
    );
  }, []);

  const handleRemoveCustomLanguage = useCallback((lang: string) => {
    setCustomLanguages((prev) => prev.filter((l) => l !== lang));
  }, []);

  const currentPrefs: OnboardingPreferences = useMemo(
    () => ({
      interests,
      experienceLevel,
      goals,
      languages,
      customLanguages,
    }),
    [interests, experienceLevel, goals, languages, customLanguages],
  );

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4) as OnboardingStep);
  };

  const handleBack = () => {
    setStep((prev) => {
      if (prev <= 1) {
        router.push("/");
        return 1;
      }
      return (prev - 1) as OnboardingStep;
    });
  };

  const handleComplete = async () => {
    if (user) {
      await updatePreferences(currentPrefs);
    }
    router.push("/results");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <OnboardingFlow
      currentStep={step}
      interests={interests}
      experienceLevel={experienceLevel}
      goals={goals}
      languages={languages}
      customLanguages={customLanguages}
      onToggleInterest={handleToggleInterest}
      onSelectExperience={setExperienceLevel}
      onToggleGoal={handleToggleGoal}
      onToggleLanguage={handleToggleLanguage}
      onAddCustomLanguage={handleAddCustomLanguage}
      onRemoveCustomLanguage={handleRemoveCustomLanguage}
      onNext={handleNext}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
}
