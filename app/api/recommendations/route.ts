import { NextRequest, NextResponse } from "next/server";
import { getIssuesWithRepo } from "@/lib/scraper-pipeline";
import { parseStoredList } from "@/lib/utils";
import {
  calculateGoalScore,
  calculateMatchScore,
  calculateReadinessScore,
  classifyDifficulty,
  daysSince,
  deriveLabelFlags,
  generateWhyRecommended,
  matchLabels,
} from "@/lib/matching";
import type { ReadmeIntelligence, Recommendation } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const languagesRaw = searchParams.get("languages");
  const interestsRaw = searchParams.get("interests");
  const goalsRaw = searchParams.get("goals");
  const experience = searchParams.get("experience");

  const languages = languagesRaw ? languagesRaw.split(",").filter(Boolean) : [];
  const interests = interestsRaw ? interestsRaw.split(",").filter(Boolean) : [];
  const goals = goalsRaw ? goalsRaw.split(",").filter(Boolean) : [];

  if (languages.length === 0) {
    return NextResponse.json(
      { error: "At least one language is required" },
      { status: 400 },
    );
  }

  let dataSource: "live" | "mock" = "mock";

  const issues = await getIssuesWithRepo({ languages });

  if (issues.length > 0) {
    dataSource = "live";
  }

  const recommendations: Recommendation[] = issues.map((issue) => {
    const labels = parseStoredList<string>(issue.labels);
    const repoTopics = parseStoredList<string>(issue.repo.topics);
    const flags = deriveLabelFlags(labels);
    const difficulty = classifyDifficulty(flags.lower);
    const matchedLabels = matchLabels(flags, interests);
    const issueAge = daysSince(issue.createdAt?.toISOString() ?? null);

    const readmeData: ReadmeIntelligence | null = issue.repo.readme
      ? {
          hasContributionGuide: issue.repo.readme.hasContributionGuide,
          setupComplexity: issue.repo.readme
            .setupComplexity as ReadmeIntelligence["setupComplexity"],
          techStack: parseStoredList<string>(issue.repo.readme.techStack),
          architectureKeywords: parseStoredList<string>(
            issue.repo.readme.architectureKeywords,
          ),
        }
      : null;

    const goalSignals = calculateGoalScore(
      goals,
      flags,
      { stars: issue.repo.stars },
      readmeData,
      issueAge,
      issue.comments,
      difficulty,
    );

    const matchScore = calculateMatchScore(
      languages,
      interests,
      {
        language: issue.repo.language,
        topics: issue.repo.topics,
        stars: issue.repo.stars,
      },
      flags,
      readmeData,
      issueAge,
      issue.comments,
      experience,
      goalSignals,
    );

    const whyRecommended = generateWhyRecommended(
      languages,
      interests,
      {
        language: issue.repo.language,
        topics: issue.repo.topics,
        stars: issue.repo.stars,
      },
      flags,
      difficulty,
      readmeData,
      issueAge,
      issue.comments,
      goals,
    );

    const readinessScore = calculateReadinessScore(
      flags,
      issue.comments,
      issueAge,
      readmeData,
      issue.repo.stars,
      experience,
    );

    return {
      id: `${issue.repo.id}-${issue.number}`,
      issueNumber: issue.number,
      issueTitle: issue.title,
      issueUrl: issue.url,
      labels,
      comments: issue.comments,
      author: issue.author,
      repository: issue.repo.name,
      organization: issue.repo.owner,
      repoDescription: issue.repo.description || "No description available.",
      repoLanguage: issue.repo.language || "Unknown",
      repoStars: issue.repo.stars,
      repoTopics,
      whyRecommended,
      difficulty,
      matchedLabels,
      readme: readmeData,
      matchScore,
      readinessScore,
    };
  });

  recommendations.sort((a, b) => b.matchScore.total - a.matchScore.total);

  const MAX_PER_REPO = 4;

  const byRepo = new Map<string, typeof recommendations>();
  for (const rec of recommendations) {
    const key = `${rec.organization}/${rec.repository}`;
    const list = byRepo.get(key);
    if (list) {
      list.push(rec);
    } else {
      byRepo.set(key, [rec]);
    }
  }

  const queues = [...byRepo.values()]
    .map((recs) => recs.slice(0, MAX_PER_REPO))
    .sort((a, b) => b.length - a.length);

  const diversified: typeof recommendations = [];
  let keepGoing = true;
  while (keepGoing) {
    keepGoing = false;
    for (const queue of queues) {
      if (queue.length > 0) {
        diversified.push(queue.shift()!);
        keepGoing = true;
      }
    }
  }

  return NextResponse.json({
    recommendations: diversified,
    count: diversified.length,
    dataSource,
  });
}
