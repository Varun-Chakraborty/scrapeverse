import { NextResponse } from "next/server";
import { runScrapePipeline } from "@/lib/scraper-pipeline";

export async function GET() {
  const result = await runScrapePipeline();
  return NextResponse.json(result);
}
