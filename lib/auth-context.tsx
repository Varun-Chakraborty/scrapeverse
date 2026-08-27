"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { User, OnboardingPreferences } from "./types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: OnboardingPreferences) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionHydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchSession().then((sessionUser) => {
      if (!cancelled) {
        if (!sessionHydrated.current) {
          setUser(sessionUser);
        }
        sessionHydrated.current = true;
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Sign up failed");
      }

      const data = await res.json();
      sessionHydrated.current = true;
      setUser(data.user);
      return data.user as User;
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Sign in failed");
    }

    const data = await res.json();
    sessionHydrated.current = true;
    setUser(data.user);
    return data.user as User;
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  }, []);

  const updatePreferences = useCallback(
    async (prefs: OnboardingPreferences) => {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update preferences");
      }

      const data = await res.json();
      setUser((prev) =>
        prev ? { ...prev, preferences: data.preferences } : null,
      );
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signUp, signIn, signOut, updatePreferences }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
