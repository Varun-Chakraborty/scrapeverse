"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { AuthModal } from "@/components/auth/auth-modal";
import { LoadingScreen } from "@/components/ui/loading-screen";
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
    return <LoadingScreen label="Loading your workspace…" />;
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
