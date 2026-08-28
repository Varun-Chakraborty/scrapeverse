import { NextResponse } from "next/server";

export function withApiHandler(
  fn: (request: Request) => Promise<NextResponse>,
  context: string,
) {
  return async function handler(request: Request) {
    try {
      return await fn(request);
    } catch (error) {
      console.error(`${context} error:`, error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function validateEmail(email: unknown): string | null {
  if (typeof email !== "string" || !email.includes("@")) {
    return "Valid email is required";
  }
  return null;
}

export function validatePassword(
  password: unknown,
  label = "Password",
): string | null {
  if (typeof password !== "string" || password.length < 4) {
    return `${label} must be at least 4 characters`;
  }
  return null;
}
