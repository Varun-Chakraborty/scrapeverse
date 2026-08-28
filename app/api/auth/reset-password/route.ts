import { NextResponse } from "next/server";
import { apiError, withApiHandler } from "@/lib/api";
import { validatePassword } from "@/lib/validate";
import { getUserByEmail, resetPassword } from "@/lib/user";

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

  await resetPassword(user.id, newPassword);

  return NextResponse.json({ success: true });
}, "Reset password");
