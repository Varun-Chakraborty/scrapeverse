import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, validatePassword, withApiHandler } from "@/lib/api";
import { getUserByEmail, hashPassword } from "@/lib/user";

export const POST = withApiHandler(async (request: Request) => {
  const { email, newPassword } = await request.json();

  if (!email || !newPassword) {
    return apiError("Email and new password are required", 400);
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) return apiError(passwordError, 400);

  const user = await getUserByEmail(email);
  if (!user) {
    return apiError("No account found with this email", 404);
  }

  await db.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(newPassword) },
  });

  return NextResponse.json({ success: true });
}, "Reset password");
