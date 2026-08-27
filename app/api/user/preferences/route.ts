import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = await decrypt(token);
  return payload?.userId ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await db.userPreferences.findUnique({
      where: { userId },
    });

    if (!prefs) {
      return NextResponse.json({ preferences: null });
    }

    return NextResponse.json({
      preferences: {
        interests: JSON.parse(prefs.interests),
        experienceLevel: prefs.experienceLevel,
        goals: JSON.parse(prefs.goals),
        languages: JSON.parse(prefs.languages),
        customLanguages: JSON.parse(prefs.customLanguages),
      },
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interests, experienceLevel, goals, languages, customLanguages } =
      body;

    const data = {
      interests: JSON.stringify(interests ?? []),
      experienceLevel: experienceLevel ?? null,
      goals: JSON.stringify(goals ?? []),
      languages: JSON.stringify(languages ?? []),
      customLanguages: JSON.stringify(customLanguages ?? []),
    };

    const prefs = await db.userPreferences.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    return NextResponse.json({
      preferences: {
        interests: JSON.parse(prefs.interests),
        experienceLevel: prefs.experienceLevel,
        goals: JSON.parse(prefs.goals),
        languages: JSON.parse(prefs.languages),
        customLanguages: JSON.parse(prefs.customLanguages),
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
