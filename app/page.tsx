"use client";

import { useState, useCallback, useMemo } from "react";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { StatsSection } from "@/components/landing/stats-section";
import { ExportFormats } from "@/components/landing/export-formats";
import { Footer } from "@/components/landing/footer";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { ResultsPage } from "@/components/recommendations/results-page";
import { AuthModal } from "@/components/auth/auth-modal";
import { PreferencesEditor } from "@/components/account/preferences-editor";
import { useAuth } from "@/lib/auth-context";
import { mockRecommendations } from "@/lib/mock-data";
import type {
  AppView,
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  TimeCommitment,
  OnboardingPreferences,
  Recommendation,
} from "@/lib/types";

export default function Home() {
  const { user, isLoading, updatePreferences } = useAuth();
  const [view, setView] = useState<AppView>("landing");
  const [step, setStep] = useState<OnboardingStep>(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(
    null
  );

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
      timeCommitment,
    }),
    [interests, experienceLevel, goals, languages, customLanguages, timeCommitment]
  );

  const loadRecommendations = useCallback(async () => {
    const allLanguages = [...languages, ...customLanguages];
    if (allLanguages.length === 0) return;

    try {
      const params = new URLSearchParams({
        languages: allLanguages.join(","),
        interests: interests.join(","),
      });
      const res = await fetch(`/api/recommendations?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.recommendations?.length > 0) {
        setRecommendations(data.recommendations);
      }
    } catch {
      setRecommendations(mockRecommendations);
    }
  }, [languages, customLanguages, interests]);

  const loadPrefsToState = useCallback((prefs: OnboardingPreferences) => {
    setInterests(prefs.interests);
    setExperienceLevel(prefs.experienceLevel);
    setGoals(prefs.goals);
    setLanguages(prefs.languages);
    setCustomLanguages(prefs.customLanguages);
    setTimeCommitment(prefs.timeCommitment);
  }, []);

  const handleGetStarted = () => {
    if (user?.preferences) {
      loadPrefsToState(user.preferences);
      setView("results");
      loadRecommendations();
      return;
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authUser: { name: string; email: string; preferences: OnboardingPreferences | null }) => {
    setAuthModalOpen(false);
    if (authUser.preferences) {
      loadPrefsToState(authUser.preferences);
      setView("results");
      loadRecommendations();
    } else {
      setView("onboarding");
      setStep(1);
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 6) as OnboardingStep);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as OnboardingStep);
  };

  const handleComplete = async () => {
    if (user) {
      await updatePreferences(currentPrefs);
    }
    setView("results");
    loadRecommendations();
  };

  const handleRestart = () => {
    setInterests([]);
    setExperienceLevel(null);
    setGoals([]);
    setLanguages([]);
    setCustomLanguages([]);
    setTimeCommitment(null);
    setStep(1);
    setView("landing");
  };

  const handleOpenPreferences = () => {
    setView("preferences");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (view === "preferences") {
    return <PreferencesEditor onClose={() => setView("results")} />;
  }

  if (view === "landing") {
    return (
      <div className="min-h-screen">
        <Navbar onGetStarted={handleGetStarted} />
        <main>
          <Hero onGetStarted={handleGetStarted} />
          <StatsSection />
          <ExportFormats />
        </main>
        <Footer />
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  if (view === "onboarding") {
    return (
      <OnboardingFlow
        currentStep={step}
        interests={interests}
        experienceLevel={experienceLevel}
        goals={goals}
        languages={languages}
        customLanguages={customLanguages}
        timeCommitment={timeCommitment}
        onToggleInterest={handleToggleInterest}
        onSelectExperience={setExperienceLevel}
        onToggleGoal={handleToggleGoal}
        onToggleLanguage={handleToggleLanguage}
        onAddCustomLanguage={handleAddCustomLanguage}
        onRemoveCustomLanguage={handleRemoveCustomLanguage}
        onSelectTime={setTimeCommitment}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <ResultsPage
      recommendations={recommendations.length > 0 ? recommendations : mockRecommendations}
      onRestart={handleRestart}
      onOpenPreferences={handleOpenPreferences}
    />
  );
}
