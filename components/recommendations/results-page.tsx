"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterHorizontalIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import { UserMenu } from "@/components/account/user-menu";
import { RecommendationGrid } from "./recommendation-grid";
import { FilterSidebar } from "./filter-sidebar";
import { EmptyState } from "./empty-state";
import { defaultFilters } from "@/lib/mock-data";
import type { Filters, Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResultsPageProps {
  recommendations: Recommendation[];
  onRestart: () => void;
  onOpenPreferences: () => void;
}

export function ResultsPage({
  recommendations,
  onRestart,
  onOpenPreferences,
}: ResultsPageProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      if (
        filters.language !== "any" &&
        rec.repoLanguage !== filters.language
      )
        return false;
      if (filters.beginnerFriendlyOnly && rec.difficulty !== "beginner")
        return false;
      if (
        filters.maxDifficulty !== "any" &&
        rec.difficulty !== filters.maxDifficulty
      )
        return false;
      return true;
    });
  }, [recommendations, filters]);

  const handleBroadenSearch = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onRestart}
              aria-label="Back to home"
              className="hidden transition-opacity hover:opacity-75 sm:block"
            >
              <Logo />
            </button>
            <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
            <div>
              <h1 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                Your recommendations
              </h1>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-primary">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "issue" : "issues"} matched to your profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className="lg:hidden"
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={14} />
              Filters
            </Button>
            <Button variant="ghost" size="sm" onClick={onRestart}>
              <HugeiconsIcon icon={RefreshIcon} size={14} />
              Start over
            </Button>
            <UserMenu onOpenPreferences={onOpenPreferences} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="animate-slide-up-sm rounded-2xl border border-border/80 bg-card p-5 shadow-soft lg:hidden">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          )}

          {/* Desktop sidebar */}
          <aside
            className={cn(
              "hidden w-full shrink-0 lg:block lg:w-64",
              "sticky top-24 self-start"
            )}
          >
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <EmptyState onBroadenSearch={handleBroadenSearch} />
            ) : (
              <RecommendationGrid recommendations={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
