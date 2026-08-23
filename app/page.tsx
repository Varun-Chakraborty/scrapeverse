"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/lib/auth-context";
import type { OnboardingPreferences } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (user?.preferences) {
      router.push("/results");
      return;
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authUser: {
    name: string;
    email: string;
    preferences: OnboardingPreferences | null;
  }) => {
    setAuthModalOpen(false);
    if (authUser.preferences) {
      router.push("/results");
    } else {
      router.push("/onboarding");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-[3px] border-primary-soft border-t-primary" />
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LandingPage onGetStarted={handleGetStarted} />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
