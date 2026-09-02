import { MATCHED_LABELS } from "@/lib/labels";
import { parseStoredList } from "@/lib/utils";
import type {
  MatchScore,
  MatchScoreBreakdown,
  ReadmeIntelligence,
} from "@/lib/types";
import { Difficulty } from "./constants";

export function classifyDifficulty(lower: string[]): Difficulty {
  if (
    lower.some(
      (l) =>
        l.includes("good first issue") ||
        l.includes("easy") ||
        l.includes("beginner"),
    )
  ) {
    return "beginner";
  }
  if (
    lower.some(
      (l) =>
        l.includes("help wanted") ||
        l.includes("medium") ||
        l.includes("enhancement"),
    )
  ) {
    return "intermediate";
  }
  return "advanced";
}

export type LabelFlags = {
  lower: string[];
  isGoodFirstIssue: boolean;
  isHelpWanted: boolean;
  isDocumentation: boolean;
  isBug: boolean;
  isEnhancement: boolean;
};

export function deriveLabelFlags(labels: string[]): LabelFlags {
  const lower = labels.map((l) => l.toLowerCase());
  return {
    lower,
    isGoodFirstIssue: lower.some((l) => l.includes("good first issue")),
    isHelpWanted: lower.some((l) => l.includes("help wanted")),
    isDocumentation: lower.some(
      (l) => l.includes("documentation") || l.includes("docs"),
    ),
    isBug: lower.some((l) => l.includes("bug")),
    isEnhancement: lower.some(
      (l) => l.includes("enhancement") || l.includes("feature"),
    ),
  };
}

export function matchLabels(flags: LabelFlags, interests: string[]): string[] {
  const matched: string[] = [];
  const { lower, isGoodFirstIssue, isHelpWanted, isBug, isDocumentation } =
    flags;

  for (const interest of interests) {
    const lowerInterest = interest.toLowerCase();
    if (lower.some((l) => l.includes(lowerInterest))) {
      matched.push(interest);
    }
  }

  if (isGoodFirstIssue) matched.push(MATCHED_LABELS.BeginnerFriendly);
  if (isHelpWanted) matched.push(MATCHED_LABELS.HelpWanted);
  if (isBug) matched.push(MATCHED_LABELS.BugFix);
  if (isDocumentation) matched.push(MATCHED_LABELS.Documentation);

  return [...new Set(matched)];
}

export function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  const created = new Date(dateStr);
  return Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function starBand(
  stars: number,
): "established" | "growing" | "emerging" | "small" {
  if (stars > 10000) return "established";
  if (stars > 1000) return "growing";
  if (stars > 100) return "emerging";
  return "small";
}

function matchPrimaryLanguage(
  languages: string[],
  repoLanguage: string | null,
): string | null {
  if (
    repoLanguage &&
    languages.some((l) => l.toLowerCase() === repoLanguage.toLowerCase())
  ) {
    return repoLanguage;
  }
  return null;
}

function matchTopicLanguage(
  languages: string[],
  lowerTopics: string[],
): string | null {
  return (
    languages.find((l) =>
      lowerTopics.some((t) => t.includes(l.toLowerCase())),
    ) ?? null
  );
}

function matchTechStack(languages: string[], techStack: string[]): string[] {
  return (techStack ?? []).filter((s) =>
    languages.some((l) => l.toLowerCase() === s.toLowerCase()),
  );
}

function matchInterestsByTopics(
  interests: string[],
  lowerTopics: string[],
): string[] {
  return interests.filter((i) =>
    lowerTopics.some((t) => t.includes(i.toLowerCase())),
  );
}

function analyzeMatch(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string },
  readme: ReadmeIntelligence | null,
): {
  primaryLanguage: string | null;
  topicLangMatch: string | null;
  matchedInterests: string[];
  stackMatch: string[];
} {
  const lowerTopics = parseStoredList<string>(repo.topics).map((t) =>
    t.toLowerCase(),
  );
  const primaryLanguage = matchPrimaryLanguage(languages, repo.language);
  const topicLangMatch = primaryLanguage
    ? null
    : matchTopicLanguage(languages, lowerTopics);
  const matchedInterests = matchInterestsByTopics(interests, lowerTopics);
  const stackMatch = matchTechStack(languages, readme?.techStack ?? []);
  return { primaryLanguage, topicLangMatch, matchedInterests, stackMatch };
}

export function generateWhyRecommended(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  flags: LabelFlags,
  difficulty: string,
  readme: ReadmeIntelligence | null,
  issueAge: number,
  comments: number,
  goals: string[],
): string[] {
  const reasons: string[] = [];

  const { primaryLanguage, topicLangMatch, matchedInterests, stackMatch } =
    analyzeMatch(languages, interests, repo, readme);

  if (primaryLanguage) {
    reasons.push(
      `Primary language is ${primaryLanguage} — matches your stack.`,
    );
  } else if (topicLangMatch) {
    reasons.push(`Uses ${topicLangMatch} (via project topics).`);
  }

  if (matchedInterests.length > 1) {
    reasons.push(
      `Matches ${matchedInterests.length} of your interests: ${matchedInterests.join(", ")}.`,
    );
  } else if (matchedInterests.length === 1) {
    reasons.push(`Aligns with your interest in ${matchedInterests[0]}.`);
  }

  if (stackMatch.length > 0) {
    reasons.push(`Tech stack includes ${stackMatch.join(", ")}.`);
  }

  if (difficulty === "beginner") {
    reasons.push("Marked as a good first issue — ideal for new contributors.");
  } else if (difficulty === "intermediate") {
    reasons.push("Open for community contributions.");
  }

  if (flags.isDocumentation) {
    reasons.push(
      "Documentation contribution — great way to learn the codebase.",
    );
  }
  if (flags.isHelpWanted) {
    reasons.push("Maintainers are actively seeking help on this.");
  }

  if (issueAge <= 7) {
    reasons.push(
      `Created ${issueAge === 0 ? "today" : `${issueAge}d ago`} — still fresh and actionable.`,
    );
  } else if (issueAge > 90) {
    reasons.push(
      `Open for ${Math.floor(issueAge / 30)} months — may need a fresh take.`,
    );
  }

  if (comments > 5) {
    reasons.push(`${comments} comments — active discussion on approach.`);
  }

  if (readme?.hasContributionGuide) {
    reasons.push("Has a contribution guide — onboarding is clear.");
  }

  if (readme?.setupComplexity === "simple") {
    reasons.push("Simple setup — get started in minutes.");
  } else if (readme?.setupComplexity === "complex") {
    reasons.push("Complex setup — plan extra time for environment config.");
  }

  const band = starBand(repo.stars);
  if (band === "established") {
    reasons.push(
      `Established project with ${repo.stars.toLocaleString()} stars.`,
    );
  } else if (band === "growing") {
    reasons.push(`Growing project with ${repo.stars.toLocaleString()} stars.`);
  }

  if (
    goals.includes("First Open Source Contribution") &&
    difficulty === "beginner"
  ) {
    reasons.push("Great fit for your first open source contribution.");
  }
  if (goals.includes("Build Portfolio") && band !== "small") {
    reasons.push("Visible project that strengthens your portfolio.");
  }
  if (goals.includes("Find Mentors") && comments > 5) {
    reasons.push(
      "Active discussion — good opportunity to connect with maintainers.",
    );
  }
  if (
    goals.includes("Contribute to Production Systems") &&
    band === "established"
  ) {
    reasons.push("Production-grade project used by many teams.");
  }
  if (goals.includes("Prepare for Jobs") && band === "established") {
    reasons.push("Resume-worthy project with wide industry recognition.");
  }
  if (
    goals.includes("Deep Technical Learning") &&
    readme?.setupComplexity === "complex"
  ) {
    reasons.push("Deep technical challenge — great for skill growth.");
  }
  if (goals.includes("Learn New Technologies") && flags.isDocumentation) {
    reasons.push("Documentation task — perfect for learning a new codebase.");
  }

  if (reasons.length === 0) {
    reasons.push("Active issue in a relevant repository.");
  }

  return reasons.slice(0, 4);
}

export function calculateMatchScore(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  flags: LabelFlags,
  readme: ReadmeIntelligence | null,
  issueAge: number,
  comments: number,
  experienceLevel: string | null,
  goalSignals: { points: number; label: string }[],
): MatchScore {
  const breakdown: MatchScoreBreakdown[] = [];
  const { isGoodFirstIssue, isHelpWanted, isDocumentation, isBug } = flags;
  const isBeginner = experienceLevel === "Beginner";

  // --- Language match (max 35) ---
  const { primaryLanguage, topicLangMatch, matchedInterests, stackMatch } =
    analyzeMatch(languages, interests, repo, readme);
  if (primaryLanguage) {
    breakdown.push({
      label: `${primaryLanguage} primary`,
      points: 30,
      category: "language",
    });
  } else if (topicLangMatch) {
    breakdown.push({
      label: `${topicLangMatch} in topics`,
      points: 15,
      category: "language",
    });
  }

  if (stackMatch.length > 0) {
    breakdown.push({
      label: `Tech: ${stackMatch[0]}`,
      points: 5,
      category: "language",
    });
  }

  // --- Interest alignment (max 20) ---
  if (matchedInterests.length > 1) {
    breakdown.push({
      label: `${matchedInterests.length} interests matched`,
      points: 20,
      category: "interest",
    });
  } else if (matchedInterests.length === 1) {
    breakdown.push({
      label: `${matchedInterests[0]} interest`,
      points: 12,
      category: "interest",
    });
  }

  // --- Issue quality (max ~20) ---
  if (isGoodFirstIssue) {
    breakdown.push({
      label: "Good First Issue",
      points: isBeginner ? 15 : 10,
      category: "issue",
    });
  }
  if (isDocumentation) {
    breakdown.push({
      label: "Documentation",
      points: isBeginner ? 8 : 5,
      category: "issue",
    });
  }
  if (isHelpWanted) {
    breakdown.push({ label: "Help Wanted", points: 5, category: "issue" });
  }
  if (isBug) {
    breakdown.push({ label: "Bug Fix", points: 3, category: "issue" });
  }

  // Issue freshness
  if (issueAge <= 7) {
    breakdown.push({ label: "Fresh issue", points: 7, category: "issue" });
  } else if (issueAge <= 30) {
    breakdown.push({ label: "Recent issue", points: 4, category: "issue" });
  } else if (issueAge > 90) {
    breakdown.push({ label: "Stale (90d+)", points: -5, category: "issue" });
  }

  // Issue engagement
  if (comments >= 2 && comments <= 15) {
    breakdown.push({
      label: "Active discussion",
      points: 3,
      category: "issue",
    });
  } else if (comments > 15) {
    breakdown.push({ label: "High engagement", points: 1, category: "issue" });
  }

  // --- Project health (max ~25) ---
  switch (starBand(repo.stars)) {
    case "established":
      breakdown.push({
        label: "Established project",
        points: 12,
        category: "project",
      });
      break;
    case "growing":
      breakdown.push({
        label: "Growing project",
        points: 8,
        category: "project",
      });
      break;
    case "emerging":
      breakdown.push({
        label: "Emerging project",
        points: 4,
        category: "project",
      });
      break;
  }

  if (readme?.hasContributionGuide) {
    breakdown.push({
      label: "Contribution guide",
      points: isBeginner ? 8 : 5,
      category: "project",
    });
  }

  if (readme?.setupComplexity === "simple") {
    breakdown.push({
      label: "Simple setup",
      points: isBeginner ? 5 : 3,
      category: "project",
    });
  } else if (readme?.setupComplexity === "complex") {
    breakdown.push({
      label: "Complex setup",
      points: isBeginner ? -3 : -1,
      category: "project",
    });
  }

  // --- Goal alignment (max ~15) ---
  for (const sig of goalSignals) {
    breakdown.push({ label: sig.label, points: sig.points, category: "goal" });
  }

  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}

export function calculateGoalScore(
  goals: string[],
  flags: LabelFlags,
  repo: { stars: number },
  readme: ReadmeIntelligence | null,
  issueAge: number,
  comments: number,
  difficulty: string,
): { points: number; label: string }[] {
  const signals: { points: number; label: string }[] = [];
  const {
    isGoodFirstIssue,
    isHelpWanted,
    isDocumentation,
    isBug,
    isEnhancement,
  } = flags;
  const hasGuide = readme?.hasContributionGuide ?? false;
  const setup = readme?.setupComplexity ?? "unknown";
  const techCount = readme?.techStack?.length ?? 0;
  const band = starBand(repo.stars);
  const notableStars = band === "growing" || band === "established";

  for (const goal of goals) {
    switch (goal) {
      case "First Open Source Contribution": {
        if (isGoodFirstIssue) {
          signals.push({ points: 5, label: "Labeled good-first-issue" });
        }
        if (hasGuide) {
          signals.push({ points: 3, label: "Has contribution guide" });
        }
        if (setup === "simple") {
          signals.push({ points: 3, label: "Simple project setup" });
        }
        if (issueAge <= 14) {
          signals.push({ points: 2, label: "Recently opened" });
        }
        if (difficulty === "beginner") {
          signals.push({ points: 2, label: "Beginner-friendly issue" });
        }
        if (isHelpWanted) {
          signals.push({ points: 2, label: "Maintainers requesting help" });
        }
        break;
      }
      case "Build Portfolio": {
        if (band === "established") {
          signals.push({ points: 5, label: "10k+ star project" });
        } else if (band === "growing") {
          signals.push({ points: 3, label: "1k+ star project" });
        } else if (band === "emerging") {
          signals.push({ points: 1, label: "Growing project" });
        }
        if (isBug || isEnhancement) {
          signals.push({ points: 3, label: "Bug fix or feature" });
        }
        if (isHelpWanted) {
          signals.push({ points: 2, label: "Open for contribution" });
        }
        if (hasGuide) {
          signals.push({ points: 2, label: "Contribution guidelines exist" });
        }
        break;
      }
      case "Learn New Technologies": {
        if (techCount > 3) {
          signals.push({
            points: 4,
            label: `Diverse tech stack (${techCount} tools)`,
          });
        } else if (techCount > 0) {
          signals.push({ points: 2, label: "Identifiable tech stack" });
        }
        if (isDocumentation) {
          signals.push({ points: 3, label: "Documentation task" });
        }
        if (notableStars) {
          signals.push({ points: 2, label: "Established codebase to study" });
        }
        if (isEnhancement) {
          signals.push({ points: 2, label: "Feature work — learn by doing" });
        }
        break;
      }
      case "Find Mentors": {
        if (isHelpWanted) {
          signals.push({
            points: 4,
            label: "Maintainers actively seeking help",
          });
        }
        if (hasGuide) {
          signals.push({
            points: 3,
            label: "Contributor onboarding documented",
          });
        }
        if (comments >= 3) {
          signals.push({
            points: 3,
            label: `${comments} comments — active thread`,
          });
        }
        if (notableStars) {
          signals.push({ points: 2, label: "Established community" });
        }
        break;
      }
      case "Contribute to Production Systems": {
        if (band === "established") {
          signals.push({ points: 6, label: "Production-grade project" });
        } else if (band === "growing") {
          signals.push({ points: 4, label: "Production-use project" });
        }
        if (isBug) {
          signals.push({ points: 3, label: "Bug fix — real-world impact" });
        }
        if (readme?.architectureKeywords?.length) {
          signals.push({ points: 2, label: "Architecture documented" });
        }
        if (isEnhancement) {
          signals.push({ points: 2, label: "Feature work in production code" });
        }
        break;
      }
      case "Prepare for Jobs": {
        if (band === "established") {
          signals.push({ points: 4, label: "Resume-worthy project" });
        } else if (band === "growing") {
          signals.push({ points: 2, label: "Notable project" });
        }
        if (isGoodFirstIssue) {
          signals.push({ points: 3, label: "Quick win for portfolio" });
        }
        if (isBug || isEnhancement) {
          signals.push({ points: 2, label: "Concrete deliverable" });
        }
        if (hasGuide) {
          signals.push({
            points: 2,
            label: "Professional contribution process",
          });
        }
        break;
      }
      case "Deep Technical Learning": {
        if (setup === "complex") {
          signals.push({ points: 4, label: "Complex system to explore" });
        }
        if (difficulty === "advanced") {
          signals.push({ points: 3, label: "Advanced challenge" });
        }
        if (readme?.architectureKeywords?.length) {
          signals.push({ points: 2, label: "Architecture keywords present" });
        }
        if (isEnhancement) {
          signals.push({
            points: 2,
            label: "Feature work — deep codebase understanding",
          });
        }
        if (notableStars) {
          signals.push({ points: 1, label: "Mature codebase" });
        }
        break;
      }
    }
  }

  return signals;
}

export function calculateReadinessScore(
  flags: LabelFlags,
  comments: number,
  issueAge: number,
  readme: Pick<
    ReadmeIntelligence,
    "hasContributionGuide" | "setupComplexity"
  > | null,
  repoStars: number,
  experienceLevel: string | null,
): number {
  let score = 0;
  const { isGoodFirstIssue, isHelpWanted, isDocumentation } = flags;
  const isBeginner = experienceLevel === "Beginner";
  const isAdvanced = experienceLevel === "Advanced";

  // Base: it's an open issue in a repo active enough to be discovered
  score += 10;

  // Contribution guide — critical for beginners, nice for others
  if (readme?.hasContributionGuide) {
    score += isBeginner ? 30 : isAdvanced ? 10 : 25;
  }

  // Setup complexity
  if (readme?.setupComplexity === "simple") {
    score += isBeginner ? 20 : 15;
  } else if (readme?.setupComplexity === "moderate") {
    score += isBeginner ? 5 : 10;
  } else if (readme?.setupComplexity === "complex") {
    score += isBeginner ? -5 : isAdvanced ? 10 : 0;
  }

  // Issue labels — beginners rely on explicit signals, advanced can handle anything
  if (isGoodFirstIssue) {
    score += isBeginner ? 20 : isAdvanced ? 5 : 15;
  }
  if (isHelpWanted) {
    score += isAdvanced ? 15 : 10;
  }
  if (isDocumentation) {
    score += 5;
  }

  // Issue freshness
  if (issueAge <= 7) score += 10;
  else if (issueAge <= 30) score += 5;
  else if (issueAge > 90) score += isBeginner ? -10 : -5;

  // Discussion activity — maintainer engagement signals accessibility
  if (comments >= 2 && comments <= 15) score += 10;

  // Project stability
  if (repoStars > 10000) score += 5;

  return Math.max(0, Math.min(100, score));
}
