import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { parsePreferences, type PersistedPreferences } from "@/lib/preferences";

type PersistedUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: PersistedPreferences | null;
};

export function serializeUser(user: PersistedUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    preferences: user.preferences ? parsePreferences(user.preferences) : null,
  };
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function getUserByEmailWithPrefs(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { preferences: true },
  });
}

export async function getUserByIdWithPrefs(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { preferences: true },
  });
}

export async function resetPassword(userId: string, newPassword: string) {
  await db.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPassword) },
  });
}
