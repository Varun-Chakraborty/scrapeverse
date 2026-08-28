import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getUserByIdWithPrefs, serializeUser } from "@/lib/user";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await getUserByIdWithPrefs(userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
