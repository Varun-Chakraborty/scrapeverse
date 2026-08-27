import { db } from "./db";
import {
  discoverTrendingRepos,
  fetchRepoDetails,
  fetchRepoDetailsBatch,
  fetchIssues,
  closeClient,
  type RepoData,
  type IssueData,
} from "./brightdata";
import { fetchAndAnalyzeReadme } from "./readme-analyzer";

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
        topics: JSON.parse(r.topics || "[]"),
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

        const issues = await fetchIssues(
          repoData.owner,
          repoData.repository_name,
        );
        for (const issue of issues) {
          await upsertIssue(repoId, issue);
          issuesScraped++;
        }

        const readme = await fetchAndAnalyzeReadme(
          repoData.owner,
          repoData.repository_name,
        );
        if (readme) {
          await upsertReadme(repoId, readme);
          readmesScraped++;
        }
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

export async function runScrapeForRepo(fullName: string): Promise<boolean> {
  try {
    const match = fullName.match(/^([^/]+)\/([^/]+)$/);
    if (!match) return false;

    const [, owner, repo] = match;
    const repoData = await fetchRepoDetails(owner, repo);
    if (!repoData) return false;

    const repoId = await upsertRepo(repoData);
    const issues = await fetchIssues(repoData.owner, repoData.repository_name);
    for (const issue of issues) {
      await upsertIssue(repoId, issue);
    }

    const readme = await fetchAndAnalyzeReadme(
      repoData.owner,
      repoData.repository_name,
    );
    if (readme) {
      await upsertReadme(repoId, readme);
    }

    return true;
  } catch (err) {
    console.error(`Failed to scrape ${fullName}:`, err);
    return false;
  } finally {
    await closeClient();
  }
}

async function upsertRepo(data: RepoData): Promise<number> {
  await db.scrapedRepo.upsert({
    where: { fullName: `${data.owner}/${data.repository_name}` },
    create: {
      id: data.githubId,
      fullName: `${data.owner}/${data.repository_name}`,
      owner: data.owner,
      name: data.repository_name,
      description: data.description,
      language: data.language,
      stars: data.star_count,
      forks: data.fork_count,
      topics: JSON.stringify(data.topics || []),
      license: data.license,
      defaultBranch: data.default_branch,
      pushedAt: data.pushed_at ? new Date(data.pushed_at) : null,
    },
    update: {
      description: data.description,
      language: data.language,
      stars: data.star_count,
      forks: data.fork_count,
      topics: JSON.stringify(data.topics || []),
      license: data.license,
      defaultBranch: data.default_branch,
      pushedAt: data.pushed_at ? new Date(data.pushed_at) : null,
      scrapedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return data.githubId;
}

async function upsertIssue(repoId: number, data: IssueData): Promise<void> {
  await db.scrapedIssue.upsert({
    where: { repoId_number: { repoId, number: data.number } },
    create: {
      repoId,
      number: data.number,
      title: data.title,
      url: data.url,
      labels: JSON.stringify(data.labels),
      state: "open",
      comments: data.comments,
      author: data.author,
      createdAt: new Date(data.createdAt),
    },
    update: {
      title: data.title,
      labels: JSON.stringify(data.labels),
      state: "open",
      comments: data.comments,
      scrapedAt: new Date(),
    },
  });
}

const VALID_SETUP_COMPLEXITIES = [
  "simple",
  "moderate",
  "complex",
  "unknown",
] as const;

function validateSetupComplexity(
  value: string,
): "simple" | "moderate" | "complex" | "unknown" {
  return VALID_SETUP_COMPLEXITIES.includes(
    value as (typeof VALID_SETUP_COMPLEXITIES)[number],
  )
    ? (value as (typeof VALID_SETUP_COMPLEXITIES)[number])
    : "unknown";
}

async function upsertReadme(
  repoId: number,
  data: {
    rawContent: string;
    hasContributionGuide: boolean;
    setupComplexity: string;
    techStack: string[];
    architectureKeywords: string[];
  },
): Promise<void> {
  const setupComplexity = validateSetupComplexity(data.setupComplexity);
  await db.scrapedReadme.upsert({
    where: { repoId },
    create: {
      repoId,
      rawContent: data.rawContent.slice(0, 50000),
      hasContributionGuide: data.hasContributionGuide,
      setupComplexity,
      techStack: JSON.stringify(data.techStack),
      architectureKeywords: JSON.stringify(data.architectureKeywords),
    },
    update: {
      rawContent: data.rawContent.slice(0, 50000),
      hasContributionGuide: data.hasContributionGuide,
      setupComplexity,
      techStack: JSON.stringify(data.techStack),
      architectureKeywords: JSON.stringify(data.architectureKeywords),
      scrapedAt: new Date(),
    },
  });
}

export async function getIssuesWithRepo(filters: {
  languages: string[];
  interests: string[];
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
