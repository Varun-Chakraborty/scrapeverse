"use client";

import { RecommendationCard } from "./recommendation-card";
import type { Recommendation } from "@/lib/types";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

export function RecommendationGrid({
  recommendations,
}: RecommendationGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {recommendations.map((rec, i) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          index={i}
          featured={i === 0}
        />
      ))}
    </div>
  );
}
