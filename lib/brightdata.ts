import { bdclient } from "@brightdata/sdk";
import { githubFetch } from "./github-api";

const TRENDING_SCRAPER_ID = "c_mszmts63lwxh4wh0h";

let client: InstanceType<typeof bdclient> | null = null;

function getClient() {
  if (!client) {
    client = new bdclient({
      apiKey: process.env.BRIGHTDATA_API_KEY!,
      logLevel: "WARNING",
      structuredLogging: false,
      verbose: false,
    });
  }
  return client;
}

interface TrendingEntry {
  product_page_url: string;
}

export interface RepoData {
  githubId: number;
  repository_name: string;
  owner: string;
  description: string;
  language: string | null;
  star_count: number;
  fork_count: number;
  topics: string[];
  license: string;
  default_branch: string;
  pushed_at: string | null;
}

export interface IssueData {
  number: number;
  title: string;
  url: string;
  labels: string[];
  comments: number;
  author: string | null;
  createdAt: string;
}

export async function discoverTrendingRepos(): Promise<string[]> {
  try {
    const results = await getClient().scraperStudio.run(TRENDING_SCRAPER_ID, {
      input: { url: "https://github.com/trending" },
    });
    const urls: string[] = [];
    for (const result of results) {
      if (result.data) {
        for (const entry of result.data) {
          const url = (entry as TrendingEntry).product_page_url;
          if (url && url.includes("github.com/")) {
            urls.push(url);
          }
        }
      }
    }
    return [...new Set(urls)];
  } catch (err) {
    console.error("Failed to discover trending repos:", err);
    return [];
  }
}

export async function fetchRepoDetails(
  owner: string,
  repo: string,
): Promise<RepoData | null> {
  const res = await githubFetch(`/repos/${owner}/${repo}`);
  if (!res || !res.ok) return null;

  const data = await res.json();

  return {
    githubId: data.id,
    repository_name: data.name,
    owner: data.owner.login,
    description: data.description || "",
    language: data.language || null,
    star_count: data.stargazers_count,
    fork_count: data.forks_count,
    topics: data.topics || [],
    license: data.license?.spdx_id || "",
    default_branch: data.default_branch || "main",
    pushed_at: data.pushed_at || null,
  };
}

export async function fetchRepoDetailsBatch(
  urls: string[],
): Promise<RepoData[]> {
  const results: RepoData[] = [];

  for (const url of urls) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) continue;

    const [, owner, repo] = match;
    const details = await fetchRepoDetails(owner, repo);
    if (details) {
      results.push(details);
    }
  }

  return results;
}

export async function fetchIssues(
  owner: string,
  repo: string,
  labels: string[] = ["good first issue", "help wanted"],
): Promise<IssueData[]> {
  const allIssues: IssueData[] = [];
  const seen = new Set<number>();

  function addIssue(issue: Record<string, unknown>) {
    if (issue.pull_request) return;
    const num = issue.number as number;
    if (seen.has(num)) return;
    seen.add(num);
    allIssues.push({
      number: num,
      title: issue.title as string,
      url: issue.html_url as string,
      labels: (issue.labels as { name: string }[]).map((l) => l.name),
      comments: issue.comments as number,
      author: (issue.user as { login: string } | null)?.login ?? null,
      createdAt: issue.created_at as string,
    });
  }

  for (const label of labels) {
    const res = await githubFetch(
      `/repos/${owner}/${repo}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=10`,
    );
    if (!res || !res.ok) continue;
    const issues = await res.json();
    for (const issue of issues) addIssue(issue);
  }

  if (allIssues.length < 5) {
    const res = await githubFetch(
      `/repos/${owner}/${repo}/issues?state=open&sort=updated&per_page=15`,
    );
    if (res && res.ok) {
      const issues = await res.json();
      for (const issue of issues) addIssue(issue);
    }
  }

  return allIssues;
}

export async function closeClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
