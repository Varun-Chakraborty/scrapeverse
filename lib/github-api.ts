const GITHUB_API = "https://api.github.com";
const USER_AGENT = "scrapeverse/0.1.0";

let rateLimitRemaining = -1;
let rateLimitReset = 0;

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": USER_AGENT,
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function getRawHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.raw",
    "User-Agent": USER_AGENT,
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function updateRateLimit(headers: Headers) {
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");

  if (remaining !== null) {
    rateLimitRemaining = parseInt(remaining, 10);
  }
  if (reset !== null) {
    rateLimitReset = parseInt(reset, 10) * 1000;
  }
}

async function sleepUntilReset(): Promise<void> {
  const now = Date.now();
  const waitMs = rateLimitReset - now + 1000;
  if (waitMs <= 0) return;

  console.log(
    `GitHub API rate limit exhausted. Sleeping ${Math.ceil(waitMs / 1000)}s until reset...`,
  );
  await new Promise((resolve) => setTimeout(resolve, waitMs));
}

export async function githubFetch(
  path: string,
  options: { raw?: boolean } = {},
): Promise<Response | null> {
  const headers = options.raw ? getRawHeaders() : getHeaders();
  const url = path.startsWith("http") ? path : `${GITHUB_API}${path}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    if (rateLimitRemaining === 0 || rateLimitRemaining === -1) {
      await sleepUntilReset();
    }

    const res = await fetch(url, { headers });
    updateRateLimit(res.headers);

    if (res.status === 403 && rateLimitRemaining === 0) {
      console.log(`Rate limited on ${path}, waiting for reset...`);
      await sleepUntilReset();
      continue;
    }

    if (res.status === 403 || res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      const waitSec = retryAfter ? parseInt(retryAfter, 10) : 60;
      console.log(
        `GitHub API ${res.status} on ${path}, retrying in ${waitSec}s...`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      continue;
    }

    return res;
  }

  console.error(`Failed after 3 attempts: ${path}`);
  return null;
}
