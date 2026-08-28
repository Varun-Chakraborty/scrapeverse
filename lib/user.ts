import { parsePreferences } from "@/lib/preferences";

type PersistedUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: {
    interests: string;
    experienceLevel: string | null;
    goals: string;
    languages: string;
    customLanguages: string;
  } | null;
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
