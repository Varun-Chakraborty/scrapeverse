import type { OnboardingPreferences } from "@/lib/types";
import { parseStoredList } from "@/lib/utils";

export type PersistedPreferences = {
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
    interests: parseStoredList<OnboardingPreferences["interests"][number]>(
      prefs.interests,
    ),
    experienceLevel:
      prefs.experienceLevel as OnboardingPreferences["experienceLevel"],
    goals: parseStoredList<OnboardingPreferences["goals"][number]>(prefs.goals),
    languages: parseStoredList<OnboardingPreferences["languages"][number]>(
      prefs.languages,
    ),
    customLanguages: parseStoredList<string>(prefs.customLanguages),
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
