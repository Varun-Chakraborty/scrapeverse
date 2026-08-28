import { NextResponse } from "next/server";
import { apiError, withApiHandler } from "@/lib/api";
import { createSession } from "@/lib/session";
import {
  getUserByEmailWithPrefs,
  serializeUser,
  verifyPassword,
} from "@/lib/user";

export const POST = withApiHandler(async (request: Request) => {
  const { email, password } = await request.json();

  if (!email || !password) {
    return apiError("Email and password are required", 400);
  }

  const user = await getUserByEmailWithPrefs(email);
  if (!user) {
    return apiError("Invalid email or password", 401);
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return apiError("Invalid email or password", 401);
  }

  await createSession({ userId: user.id, email: user.email });

  return NextResponse.json({
    user: serializeUser(user),
  });
}, "Signin");
