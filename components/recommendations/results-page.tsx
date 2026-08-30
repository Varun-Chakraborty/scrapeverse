"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/account/user-menu";
import { RecommendationGrid } from "./recommendation-grid";
import { FilterSidebar } from "./filter-sidebar";
import { EmptyState } from "./empty-state";
import { defaultFilters } from "@/lib/constants";
import { LANGUAGES } from "@/lib/languages";
import type { Filters, Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { timeToString } from "@/lib/time-to-string";

interface ScrapeStatus {
  lastScrapedAt: string | null;
  repos: number;
  issues: number;
  readmes: number;
}

function timeSince(iso: string): string {
  const secs = (Date.now() - new Date(iso).getTime()) / 1000;
  if (secs < 60) return "just now";
  return `${timeToString(secs)} ago`;
}

interface ResultsPageProps {
  recommendations: Recommendation[];
  onRestart: () => void;
  onHome: () => void;
  initialDifficulty?: Filters["maxDifficulty"];
  dataSource?: "live" | "mock";
}

export function ResultsPage({
  recommendations,
  onRestart,
  onHome,
  initialDifficulty = "any",
  dataSource = "mock",
}: ResultsPageProps) {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    maxDifficulty: initialDifficulty,
  });
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/scrape/status")
      .then((r) => (r.ok ? r.json() : null))
      .then(setScrapeStatus)
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      if (filters.language !== "any" && rec.repoLanguage !== filters.language)
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

  const handleSelectTechnology = (tech: string) => {
    const isLanguage = LANGUAGES.some((l) => l.value === tech);
    setFilters(
      isLanguage ? { ...defaultFilters, language: tech } : defaultFilters,
    );
  };

  return (
    <div className="bg-aurora relative min-h-screen overflow-hidden bg-background">
      {/* Drifting glossy orbs */}
      <div
        aria-hidden="true"
        className="animate-orb-drift pointer-events-none absolute -top-24 -left-32 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-orb-drift pointer-events-none absolute top-40 -right-40 size-[28rem] rounded-full bg-lavender/50 blur-3xl [animation-delay:-6s]"
      />
      <div
        aria-hidden="true"
        className="animate-orb-drift pointer-events-none absolute bottom-0 left-1/3 size-80 rounded-full bg-mint/60 blur-3xl [animation-delay:-12s]"
      />

      {/* Small dot-matrix texture */}
      <div
        aria-hidden="true"
        className="bg-matrix mask-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
      />

      <header className="glass-edge sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="animate-fade-up mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onHome}
              aria-label="Back to home"
              className="transition-opacity hover:opacity-75"
            >
              <Logo />
            </button>
            <span
              aria-hidden="true"
              className="hidden h-6 w-px bg-border sm:block"
            />
            <div>
              <h1 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                Your recommendations
              </h1>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-primary">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "issue" : "issues"} matched to your
                profile
                <span className="mx-1.5">·</span>
                <span
                  className={
                    dataSource === "live"
                      ? "inline-flex items-center gap-1 font-medium text-mint-foreground"
                      : "font-medium text-amber-foreground"
                  }
                >
                  {dataSource === "live" && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 animate-pulse-dot rounded-full bg-success"
                    />
                  )}
                  {dataSource === "live" ? "Live data" : "Demo data"}
                </span>
                {scrapeStatus && (
                  <>
                    <span className="mx-1.5 hidden sm:inline">·</span>
                    <span
                      className="hidden text-muted-foreground/70 sm:inline"
                      title={`${scrapeStatus.repos} repos, ${scrapeStatus.issues} issues, ${scrapeStatus.readmes} readmes`}
                    >
                      Scraped{" "}
                      {scrapeStatus.lastScrapedAt
                        ? timeSince(scrapeStatus.lastScrapedAt)
                        : "never"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className="cursor-pointer lg:hidden"
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={14} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onRestart}>
              <HugeiconsIcon icon={RefreshIcon} size={14} />
              <span className="hidden sm:inline">Start over</span>
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="card-shine animate-slide-up-sm relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-soft lg:hidden">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          )}

          {/* Desktop sidebar */}
          <aside
            className={cn(
              "hidden w-full shrink-0 lg:block lg:w-64",
              "sticky top-24 self-start",
            )}
          >
            <div className="card-shine animate-slide-up-sm relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-soft [animation-delay:200ms]">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <EmptyState
                onBroadenSearch={handleBroadenSearch}
                onSelectTechnology={handleSelectTechnology}
              />
            ) : (
              <RecommendationGrid recommendations={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
