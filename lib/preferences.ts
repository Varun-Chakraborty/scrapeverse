import type { OnboardingPreferences } from "@/lib/types";

type PersistedPreferences = {
  interests: string;
  experienceLevel: string | null;
  goals: string;
  languages: string;
  customLanguages: string;
};

export function parsePreferences(
  prefs: PersistedPreferences,
): OnboardingPreferences {
  return {
    interests: JSON.parse(prefs.interests),
    experienceLevel:
      prefs.experienceLevel as OnboardingPreferences["experienceLevel"],
    goals: JSON.parse(prefs.goals),
    languages: JSON.parse(prefs.languages),
    customLanguages: JSON.parse(prefs.customLanguages),
  };
}

export function serializePreferences(
  prefs: Partial<OnboardingPreferences>,
): PersistedPreferences {
  return {
    interests: JSON.stringify(prefs.interests ?? []),
    experienceLevel: prefs.experienceLevel ?? null,
    goals: JSON.stringify(prefs.goals ?? []),
    languages: JSON.stringify(prefs.languages ?? []),
    customLanguages: JSON.stringify(prefs.customLanguages ?? []),
  };
}
