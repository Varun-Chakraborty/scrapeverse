export const SESSION_COOKIE = "session";
export const TOTAL_ONBOARDING_STEPS = 4;

export const LEGAL_VERSIONS = {
  terms: "1.0",
  privacy: "1.0",
} as const;
export type LegalDoc = keyof typeof LEGAL_VERSIONS;

export const defaultFilters = {
  maxDifficulty: "any" as const,
  language: "any",
};

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

export const PROJECT_SETUP_COMPLEXITY_LEVELS = [
  "simple",
  "moderate",
  "complex",
  "unknown",
] as const;
export type SetupComplexity = (typeof PROJECT_SETUP_COMPLEXITY_LEVELS)[number];

export const MATCH_CATEGORIES = [
  "language",
  "interest",
  "issue",
  "project",
  "goal",
] as const;
export type MatchCategory = (typeof MATCH_CATEGORIES)[number];
