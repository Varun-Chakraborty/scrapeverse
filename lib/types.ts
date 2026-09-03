import { Difficulty, MatchCategory, SetupComplexity } from "./constants";
import type { ProgrammingLanguage } from "@/lib/languages";
import { ExperienceLevel, Goal, Interest } from "@/lib/user-profile";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  preferences: OnboardingPreferences | null;
}

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface ReadmeIntelligence {
  hasContributionGuide: boolean;
  setupComplexity: SetupComplexity;
  techStack: string[];
  architectureKeywords: string[];
}

export interface MatchScoreBreakdown {
  label: string;
  points: number;
  category: MatchCategory;
}

export interface MatchScore {
  total: number;
  breakdown: MatchScoreBreakdown[];
}

export interface Recommendation {
  id: string;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
  labels: string[];
  comments: number;
  author: string | null;
  repository: string;
  organization: string;
  repoDescription: string;
  repoLanguage: string;
  repoStars: number;
  repoTopics: string[];
  whyRecommended: string[];
  difficulty: Difficulty;
  matchedLabels: string[];
  readme: ReadmeIntelligence | null;
  matchScore: MatchScore;
  readinessScore: number;
}

export interface OnboardingPreferences {
  interests: Interest[];
  experienceLevel: ExperienceLevel | null;
  goals: Goal[];
  languages: ProgrammingLanguage[];
  customLanguages: string[];
}

export interface Filters {
  maxDifficulty: Difficulty | "any";
  language: string;
}
