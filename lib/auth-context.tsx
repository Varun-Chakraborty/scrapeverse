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

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  fallback = "Request failed",
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error || fallback);
  }
  return res.json() as Promise<T>;
}

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
      const data = await apiFetch<{ user: User }>(
        "/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        },
        "Sign up failed",
      );
      sessionHydrated.current = true;
      setUser(data.user);
      return data.user;
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: User }>(
      "/api/auth/signin",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      "Sign in failed",
    );
    sessionHydrated.current = true;
    setUser(data.user);
    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  }, []);

  const updatePreferences = useCallback(
    async (prefs: OnboardingPreferences) => {
      const data = await apiFetch<{ preferences: OnboardingPreferences }>(
        "/api/user/preferences",
        {
          method: "PUT",
          body: JSON.stringify(prefs),
        },
        "Failed to update preferences",
      );
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
