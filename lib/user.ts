import { db } from "@/lib/db";
import { parsePreferences, type PersistedPreferences } from "@/lib/preferences";

type PersistedUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  preferences: PersistedPreferences | null;
};

export function serializeUser(user: PersistedUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    preferences: user.preferences ? parsePreferences(user.preferences) : null,
  };
}

export async function getUserByGithubId(githubId: string) {
  return db.user.findUnique({ where: { githubId } });
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
