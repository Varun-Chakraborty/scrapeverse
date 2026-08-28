import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, validatePassword, withApiHandler } from "@/lib/api";
import { getSessionUserId } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/user";

export const POST = withApiHandler(async (request: Request) => {
  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return apiError("Current and new passwords are required", 400);
  }

  const passwordError = validatePassword(newPassword, "New password");
  if (passwordError) return apiError(passwordError, 400);

  const userId = await getSessionUserId();
  if (!userId) {
    return apiError("Not authenticated", 401);
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return apiError("User not found", 404);
  }

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    return apiError("Current password is incorrect", 401);
  }

  await db.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(newPassword) },
  });

  return NextResponse.json({ success: true });
}, "Change password");
