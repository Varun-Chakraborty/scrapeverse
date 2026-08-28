import { NextResponse } from "next/server";
import { apiError, withApiHandler } from "@/lib/api";
import { getSessionUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { parsePreferences, serializePreferences } from "@/lib/preferences";

export const GET = withApiHandler(async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    return apiError("Unauthorized", 401);
  }

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
  const userId = await getSessionUserId();
  if (!userId) {
    return apiError("Unauthorized", 401);
  }

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
