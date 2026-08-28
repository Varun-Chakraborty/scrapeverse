export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  preferences: OnboardingPreferences | null;
}

export type OnboardingStep = 1 | 2 | 3 | 4;

export type Interest =
  | "Compilers"
  | "Programming Languages"
  | "Rust"
  | "Operating Systems"
  | "Databases"
  | "Web Development"
  | "AI / ML"
  | "Developer Tools"
  | "Game Development"
  | "Security"
  | "Embedded Systems"
  | "DevOps"
  | "Networking";

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type Goal =
  | "First Open Source Contribution"
  | "Build Portfolio"
  | "Learn New Technologies"
  | "Find Mentors"
  | "Contribute to Production Systems"
  | "Prepare for Jobs"
  | "Deep Technical Learning";

import type { ProgrammingLanguage } from "@/lib/languages";

export interface ReadmeIntelligence {
  hasContributionGuide: boolean;
  setupComplexity: "simple" | "moderate" | "complex" | "unknown";
  techStack: string[];
  architectureKeywords: string[];
}

export interface MatchScoreBreakdown {
  label: string;
  points: number;
  category: "language" | "interest" | "issue" | "project" | "goal";
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
  difficulty: "beginner" | "intermediate" | "advanced";
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
  maxDifficulty: "beginner" | "intermediate" | "advanced" | "any";
  language: string;
}

export interface InterestOption {
  value: Interest;
  label: string;
  icon: string;
}

export interface ExperienceOption {
  value: ExperienceLevel;
  label: string;
  description: string;
  icon: string;
}

export interface GoalOption {
  value: Goal;
  label: string;
  description: string;
}
