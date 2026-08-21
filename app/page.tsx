"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/lib/auth-context";
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  OnboardingPreferences,
} from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const { user, isLoading, updatePreferences } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
        prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item]
      );
    },
    []
  );

  const handleToggleInterest = useCallback(
    (interest: Interest) => toggleItem(setInterests, interest),
    [toggleItem]
  );

  const handleToggleGoal = useCallback(
    (goal: Goal) => toggleItem(setGoals, goal),
    [toggleItem]
  );

  const handleToggleLanguage = useCallback(
    (lang: ProgrammingLanguage) => toggleItem(setLanguages, lang),
    [toggleItem]
  );

  const handleAddCustomLanguage = useCallback((lang: string) => {
    setCustomLanguages((prev) => (prev.includes(lang) ? prev : [...prev, lang]));
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
    [interests, experienceLevel, goals, languages, customLanguages]
  );

  const handleGetStarted = () => {
    if (user?.preferences) {
      router.push("/results");
      return;
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authUser: { name: string; email: string; preferences: OnboardingPreferences | null }) => {
    setAuthModalOpen(false);
    if (authUser.preferences) {
      router.push("/results");
    } else {
      router.push("/onboarding");
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4) as OnboardingStep);
  };

  const handleBack = () => {
    setStep((prev) => {
      if (prev <= 1) {
        setShowOnboarding(false);
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-[3px] border-primary-soft border-t-primary" />
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
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

  return (
    <>
      <LandingPage onGetStarted={handleGetStarted} />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
