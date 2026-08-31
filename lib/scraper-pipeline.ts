import { db } from "./db";
import {
  discoverTrendingRepos,
  fetchRepoDetailsBatch,
  fetchIssues,
  closeClient,
  type RepoData,
  type IssueData,
} from "./brightdata";
import { fetchAndAnalyzeReadme } from "./readme-analyzer";
import { parseStoredList, serializeList } from "./utils";
import type { ReadmeIntelligence } from "./types";
import { PROJECT_SETUP_COMPLEXITY_LEVELS, SetupComplexity } from "./constants";

export async function runScrapePipeline(): Promise<{
  discovered: number;
  scraped: number;
  issuesScraped: number;
  readmesScraped: number;
  trendingRepos: string[];
  errors: string[];
}> {
  const errors: string[] = [];
  let discovered = 0;
  let scraped = 0;
  let issuesScraped = 0;
  let readmesScraped = 0;
  const trendingRepos: string[] = [];

  try {
    const urls = await discoverTrendingRepos();
    discovered = urls.length;

    let repoDataList: RepoData[] = [];

    if (urls.length > 0) {
      repoDataList = await fetchRepoDetailsBatch(urls);
    } else {
      const existingRepos = await db.scrapedRepo.findMany();
      repoDataList = existingRepos.map((r) => ({
        githubId: r.id,
        repository_name: r.name,
        owner: r.owner,
        description: r.description || "",
        language: r.language,
        star_count: r.stars,
        fork_count: r.forks,
        topics: parseStoredList<string>(r.topics),
        license: r.license || "",
        default_branch: r.defaultBranch || "main",
        pushed_at: r.pushedAt?.toISOString() || null,
      }));
      if (repoDataList.length > 0) {
        errors.push(
          "BrightData returned 0 repos — falling back to DB (" +
            repoDataList.length +
            " repos)",
        );
      }
    }

    if (repoDataList.length === 0) {
      errors.push("No trending repos discovered and no repos in DB");
      return {
        discovered: 0,
        scraped: 0,
        issuesScraped: 0,
        readmesScraped: 0,
        trendingRepos: [],
        errors,
      };
    }

    for (const repoData of repoDataList) {
      try {
        const repoId = await upsertRepo(repoData);
        scraped++;
        trendingRepos.push(`${repoData.owner}/${repoData.repository_name}`);

        const { issues, readmes } = await fetchRepoResources(repoId, repoData);
        issuesScraped += issues;
        readmesScraped += readmes;
      } catch (err) {
        errors.push(
          `Failed to store ${repoData.owner}/${repoData.repository_name}: ${err}`,
        );
      }
    }
  } catch (err) {
    errors.push(`Pipeline error: ${err}`);
  } finally {
    await closeClient();
  }

  return {
    discovered,
    scraped,
    issuesScraped,
    readmesScraped,
    trendingRepos,
    errors,
  };
}

async function fetchRepoResources(
  repoId: number,
  repoData: RepoData,
): Promise<{ issues: number; readmes: number }> {
  const issues = await fetchIssues(repoData.owner, repoData.repository_name);
  for (const issue of issues) {
    await upsertIssue(repoId, issue);
  }

  let readmes = 0;
  const readme = await fetchAndAnalyzeReadme(
    repoData.owner,
    repoData.repository_name,
  );
  if (readme) {
    await upsertReadme(repoId, readme);
    readmes = 1;
  }

  return { issues: issues.length, readmes };
}

async function upsertRepo(data: RepoData): Promise<number> {
  const values = {
    description: data.description,
    language: data.language,
    stars: data.star_count,
    forks: data.fork_count,
    topics: serializeList(data.topics || []),
    license: data.license,
    defaultBranch: data.default_branch,
    pushedAt: data.pushed_at ? new Date(data.pushed_at) : null,
  };

  await db.scrapedRepo.upsert({
    where: { fullName: `${data.owner}/${data.repository_name}` },
    create: {
      id: data.githubId,
      fullName: `${data.owner}/${data.repository_name}`,
      owner: data.owner,
      name: data.repository_name,
      ...values,
    },
    update: {
      ...values,
      scrapedAt: new Date(),
    },
  });

  return data.githubId;
}

async function upsertIssue(repoId: number, data: IssueData): Promise<void> {
  const values = {
    title: data.title,
    labels: serializeList(data.labels),
    state: "open",
    comments: data.comments,
  };

  await db.scrapedIssue.upsert({
    where: { repoId_number: { repoId, number: data.number } },
    create: {
      repoId,
      number: data.number,
      url: data.url,
      author: data.author,
      createdAt: new Date(data.createdAt),
      ...values,
    },
    update: {
      ...values,
      scrapedAt: new Date(),
    },
  });
}

function validateSetupComplexity(value: string): SetupComplexity {
  return PROJECT_SETUP_COMPLEXITY_LEVELS.includes(
    value as (typeof PROJECT_SETUP_COMPLEXITY_LEVELS)[number],
  )
    ? (value as (typeof PROJECT_SETUP_COMPLEXITY_LEVELS)[number])
    : "unknown";
}

async function upsertReadme(
  repoId: number,
  data: ReadmeIntelligence & { rawContent: string },
): Promise<void> {
  const setupComplexity = validateSetupComplexity(data.setupComplexity);
  const values = {
    rawContent: data.rawContent.slice(0, 50000),
    hasContributionGuide: data.hasContributionGuide,
    setupComplexity,
    techStack: serializeList(data.techStack),
    architectureKeywords: serializeList(data.architectureKeywords),
  };

  await db.scrapedReadme.upsert({
    where: { repoId },
    create: { repoId, ...values },
    update: { ...values, scrapedAt: new Date() },
  });
}

export async function getIssuesWithRepo(filters: {
  languages: string[];
}): Promise<
  {
    id: number;
    number: number;
    title: string;
    url: string;
    labels: string;
    comments: number;
    author: string | null;
    createdAt: Date | null;
    repo: {
      id: number;
      fullName: string;
      owner: string;
      name: string;
      description: string | null;
      language: string | null;
      stars: number;
      topics: string;
      license: string | null;
      readme: {
        hasContributionGuide: boolean;
        setupComplexity: string;
        techStack: string;
        architectureKeywords: string;
      } | null;
    };
  }[]
> {
  const where: Record<string, unknown> = {
    state: "open",
  };

  if (filters.languages.length > 0) {
    const languageOr = filters.languages.map((lang) => ({
      language: { equals: lang, mode: "insensitive" },
    }));

    const topicOr = filters.languages.map((lang) => ({
      topics: { contains: lang, mode: "insensitive" as const },
    }));

    where.repo = {
      OR: [...languageOr, ...topicOr],
    };
  }

  const issues = await db.scrapedIssue.findMany({
    where,
    include: {
      repo: {
        include: { readme: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return issues;
}
