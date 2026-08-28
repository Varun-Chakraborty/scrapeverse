import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/api";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is required");
}
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function setSessionCookie(
  token: string,
  maxAge = SESSION_MAX_AGE,
) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  await setSessionCookie("", 0);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await decrypt(token);
  return payload?.userId ?? null;
}

export async function requireSession(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) throw new HttpError("Unauthorized", 401);
  return userId;
}

export async function createSession(payload: SessionPayload) {
  const token = await encrypt(payload);
  await setSessionCookie(token);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
