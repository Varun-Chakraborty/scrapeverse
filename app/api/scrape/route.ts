import { NextRequest, NextResponse } from "next/server";
import { runScrapePipeline, runScrapeForRepo } from "@/lib/scraper-pipeline";

export async function GET(request: NextRequest) {
  let { searchParams } = request.nextUrl;
  let repo = searchParams.get("repo");

  if (repo) {
    const success = await runScrapeForRepo(repo);
    return NextResponse.json({
      status: success ? "ok" : "failed",
      repo,
    });
  }

  const result = await runScrapePipeline();
  return NextResponse.json(result);
}
