import { SetupComplexity } from "./constants";
import { githubFetch } from "./github-api";
import type { ReadmeIntelligence } from "./types";

type ReadmeIntelligenceWithRaw = ReadmeIntelligence & { rawContent: string };

const CONTRIBUTION_PATTERNS = [
  /contributing/i,
  /how to contribute/i,
  /pull request/i,
  /development setup/i,
  /getting started/i,
  /for developers/i,
  /hacking/i,
  /hack on/i,
];

type SetupTier = Exclude<SetupComplexity, "unknown">;

const SETUP_SIMPLE = [
  /cargo install/i,
  /go install/i,
  /npm install/i,
  /pip install/i,
  /brew install/i,
  /apt install/i,
  /make install/i,
];

const SETUP_COMPLEX = [
  /docker/i,
  /kubernetes/i,
  /microservice/i,
  /setup multiple/i,
  /prerequisites:/i,
  /before you begin/i,
  /system requirements/i,
  /compile from source/i,
  /build from source/i,
];

const SETUP_MODERATE = ["install", "setup"] as const;

const SETUP_TIERS: {
  tier: SetupTier;
  patterns: RegExp[];
  keywords: readonly string[];
}[] = [
  { tier: "simple", patterns: SETUP_SIMPLE, keywords: [] },
  { tier: "complex", patterns: SETUP_COMPLEX, keywords: [] },
  { tier: "moderate", patterns: [], keywords: SETUP_MODERATE },
];

const TECH_STACK_KEYWORDS = [
  "rust",
  "go",
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "c++",
  "zig",
  "react",
  "vue",
  "svelte",
  "angular",
  "nextjs",
  "nuxt",
  "astro",
  "postgres",
  "mysql",
  "sqlite",
  "redis",
  "mongodb",
  "neo4j",
  "docker",
  "kubernetes",
  "terraform",
  "ansible",
  "grpc",
  "rest",
  "graphql",
  "websocket",
  "tokio",
  "async-std",
  "hyper",
  "axum",
  "actix",
  "webpack",
  "vite",
  "esbuild",
  "rollup",
  "linux",
  "windows",
  "macos",
  "wasm",
  "machine-learning",
  "deep-learning",
  "neural-network",
  "compiler",
  "interpreter",
  "vm",
  "jit",
  "database",
  "sql",
  "nosql",
  "crypto",
  "encryption",
  "tls",
  "ssl",
];

const ARCHITECTURE_KEYWORDS = [
  "microservice",
  "monolith",
  "event-driven",
  "cqrs",
  "ddd",
  "actor-model",
  "message-queue",
  "pub-sub",
  "pipeline",
  "plugin-system",
  "middleware",
  "layered-architecture",
  "hexagonal",
  "clean-architecture",
  "mvc",
  "mvvm",
  "concurrent",
  "parallel",
  "async",
  "non-blocking",
  "client-server",
  "peer-to-peer",
  "distributed",
  "serverless",
  "lambda",
  "edge",
  "workspace",
  "monorepo",
  "multi-crate",
];

async function fetchReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  const res = await githubFetch(`/repos/${owner}/${repo}/readme`, {
    raw: true,
  });
  if (!res || !res.ok) return null;
  return await res.text();
}

function analyzeReadme(
  content: string,
): Omit<ReadmeIntelligence, "rawContent"> {
  const lower = content.toLowerCase();

  const hasContributionGuide = CONTRIBUTION_PATTERNS.some((p) =>
    p.test(content),
  );

  let setupComplexity: SetupComplexity = "unknown";
  for (const { tier, patterns, keywords } of SETUP_TIERS) {
    if (
      patterns.some((p) => p.test(content)) ||
      keywords.some((kw) => lower.includes(kw))
    ) {
      setupComplexity = tier;
      break;
    }
  }

  const techStack = TECH_STACK_KEYWORDS.filter((kw) => lower.includes(kw));

  const architectureKeywords = ARCHITECTURE_KEYWORDS.filter((kw) =>
    lower.includes(kw),
  );

  return {
    hasContributionGuide,
    setupComplexity,
    techStack,
    architectureKeywords,
  };
}

export async function fetchAndAnalyzeReadme(
  owner: string,
  repo: string,
): Promise<ReadmeIntelligenceWithRaw | null> {
  const rawContent = await fetchReadme(owner, repo);
  if (!rawContent) return null;

  const analysis = analyzeReadme(rawContent);

  return {
    rawContent,
    ...analysis,
  };
}
