import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, withApiHandler } from "@/lib/api";
import { validatePassword } from "@/lib/validate";
import { requireSession } from "@/lib/session";
import { resetPassword, verifyPassword } from "@/lib/user";

export const POST = withApiHandler(async (request: Request) => {
  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return apiError("Current and new passwords are required", 400);
  }

  const passwordError = validatePassword(newPassword, "New password");
  if (passwordError) return apiError(passwordError, 400);

  const userId = await requireSession();

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return apiError("User not found", 404);
  }

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    return apiError("Current password is incorrect", 401);
  }

  await resetPassword(userId, newPassword);

  return NextResponse.json({ success: true });
}, "Change password");
