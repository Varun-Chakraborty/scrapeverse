import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";
import { getSessionUserId } from "@/lib/session";
import { getUserByIdWithPrefs, serializeUser } from "@/lib/user";

export const GET = withApiHandler(async () => {
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
}, "Session check");
