"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultsPage } from "@/components/recommendations/results-page";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/lib/auth-context";
import { mockRecommendations } from "@/lib/mock-data";
import type { Recommendation } from "@/lib/types";

export default function Results() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(mockRecommendations);
  const [dataSource, setDataSource] = useState<"live" | "mock">("mock");

  useEffect(() => {
    if (isLoading || !user) return;

    const prefs = user.preferences;
    if (!prefs) return;

    const allLanguages = [...prefs.languages, ...prefs.customLanguages];
    if (allLanguages.length === 0) return;

    const controller = new AbortController();

    const params = new URLSearchParams({
      languages: allLanguages.join(","),
      interests: prefs.interests.join(","),
      goals: prefs.goals.join(","),
      experience: prefs.experienceLevel ?? "",
    });

    fetch(`/api/recommendations?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.recommendations?.length > 0) {
          setRecommendations(data.recommendations);
          setDataSource(data.dataSource ?? "mock");
        } else {
          setDataSource("mock");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch recommendations:", err);
          setDataSource("mock");
        }
      });

    return () => {
      controller.abort();
    };
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ResultsPage
      recommendations={recommendations}
      onRestart={() => router.push("/onboarding")}
      onHome={() => router.push("/")}
      initialDifficulty="any"
      dataSource={dataSource}
    />
  );
}
