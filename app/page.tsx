"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { AuthModal } from "@/components/auth/auth-modal";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/lib/auth-context";

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

  if (isLoading) {
    return <LoadingScreen label="Loading your workspace…" />;
  }

  return (
    <>
      <LandingPage onGetStarted={handleGetStarted} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
