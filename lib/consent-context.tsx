"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./auth-context";

interface ConsentStatusEntry {
  type: string;
  version: string;
  consented: boolean;
}

interface ConsentContextValue {
  needsConsent: boolean;
  consents: ConsentStatusEntry[];
  accept: () => Promise<void>;
  decline: () => Promise<void>;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

async function fetchConsentStatus(): Promise<{
  needsConsent: boolean;
  consents: ConsentStatusEntry[];
}> {
  const res = await fetch("/api/auth/consent");
  const data = await res.json();
  return {
    needsConsent: Boolean(data.needsConsent),
    consents: Array.isArray(data.consents) ? data.consents : [],
  };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consents, setConsents] = useState<ConsentStatusEntry[]>([]);

  useEffect(() => {
    if (!user) return;

    fetchConsentStatus().then((data) => {
      setNeedsConsent(data.needsConsent);
      setConsents(data.consents);
    });
  }, [user]);

  const accept = useCallback(async () => {
    const res = await fetch("/api/auth/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: true }),
    });
    const data = await res.json();
    setNeedsConsent(Boolean(data.needsConsent));
    setConsents(Array.isArray(data.consents) ? data.consents : []);
  }, []);

  const decline = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <ConsentContext.Provider
      value={{ needsConsent, consents, accept, decline }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
