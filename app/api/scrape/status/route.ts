import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [repoCount, issueCount, readmeCount, latest] = await Promise.all([
    db.scrapedRepo.count(),
    db.scrapedIssue.count({ where: { state: "open" } }),
    db.scrapedReadme.count(),
    db.scrapedRepo.findFirst({
      orderBy: { scrapedAt: "desc" },
      select: { scrapedAt: true },
    }),
  ]);

  return NextResponse.json({
    lastScrapedAt: latest?.scrapedAt?.toISOString() ?? null,
    repos: repoCount,
    issues: issueCount,
    readmes: readmeCount,
  });
}
