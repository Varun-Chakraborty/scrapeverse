import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { parsePreferences, serializePreferences } from "@/lib/preferences";

export const GET = withApiHandler(async () => {
  const userId = await requireSession();

  const prefs = await db.userPreferences.findUnique({
    where: { userId },
  });

  if (!prefs) {
    return NextResponse.json({ preferences: null });
  }

  return NextResponse.json({
    preferences: parsePreferences(prefs),
  });
}, "Get preferences");

export const PUT = withApiHandler(async (request: Request) => {
  const userId = await requireSession();

  const body = await request.json();
  const data = serializePreferences(body);

  const prefs = await db.userPreferences.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  return NextResponse.json({
    preferences: parsePreferences(prefs),
  });
}, "Update preferences");
