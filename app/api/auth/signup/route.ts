import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, withApiHandler } from "@/lib/api";
import { validateEmail, validatePassword } from "@/lib/validate";
import { createSession } from "@/lib/session";
import { getUserByEmail, hashPassword, serializeUser } from "@/lib/user";

export const POST = withApiHandler(async (request: Request) => {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return apiError("Name, email, and password are required", 400);
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return apiError("Name is required", 400);
  }

  const emailError = validateEmail(email);
  if (emailError) return apiError(emailError, 400);

  const passwordError = validatePassword(password);
  if (passwordError) return apiError(passwordError, 400);

  if (await getUserByEmail(email)) {
    return apiError("An account with this email already exists", 409);
  }

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      password: await hashPassword(password),
    },
  });

  await createSession({ userId: user.id, email: user.email });

  return NextResponse.json({
    user: serializeUser({ ...user, preferences: null }),
  });
}, "Signup");
