import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  apiError,
  validateEmail,
  validatePassword,
  withApiHandler,
} from "@/lib/api";
import { encrypt, setSessionCookie } from "@/lib/session";
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

  const token = await encrypt({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  return NextResponse.json({
    user: serializeUser({ ...user, preferences: null }),
  });
}, "Signup");
