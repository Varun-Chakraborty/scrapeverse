"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  SparklesIcon,
  StarIcon,
  Comment01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/check-icon";
import { MATCHED_LABELS } from "@/lib/labels";
import { languageColorMap } from "@/lib/languages";
import type { Recommendation, MatchScoreBreakdown } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      if (prefersReducedMotion()) {
        setValue(target);
        return;
      }
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
  featured?: boolean;
}

const difficultyStyleMap: Record<string, string> = {
  beginner: "bg-mint text-mint-foreground",
  intermediate: "bg-sky text-sky-foreground",
  advanced: "bg-amber-soft text-amber-foreground",
};

const labelVariantMap: Record<
  string,
  "secondary" | "info" | "destructive" | "lavender" | "outline"
> = {
  [MATCHED_LABELS.BeginnerFriendly]: "secondary",
  [MATCHED_LABELS.HelpWanted]: "info",
  [MATCHED_LABELS.BugFix]: "destructive",
  [MATCHED_LABELS.Documentation]: "lavender",
};

const setupComplexityMap: Record<string, { label: string }> = {
  simple: { label: "Simple setup" },
  moderate: { label: "Moderate setup" },
  complex: { label: "Complex setup" },
  unknown: { label: "Setup unknown" },
};

const categoryColorMap: Record<string, string> = {
  language: "text-sky-foreground",
  interest: "text-lavender-foreground",
  issue: "text-mint-foreground",
  project: "text-amber-foreground",
  goal: "text-secondary-foreground",
};

function ScoreBreakdownGroup({
  items,
  label,
}: {
  items: MatchScoreBreakdown[];
  label: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex items-start gap-1.5">
      <span className="w-14 shrink-0 text-[10px] tracking-wider text-muted-foreground/70 uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
        {items.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-0.5 text-[10px]"
          >
            <span
              className={`font-semibold ${categoryColorMap[item.category]}`}
            >
              {item.points > 0 ? "+" : ""}
              {item.points}
            </span>
            <span className="text-muted-foreground">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <CheckIcon
        size={10}
        strokeWidth={2}
        className="mt-1 shrink-0 text-primary"
      />
      {children}
    </li>
  );
}

export function RecommendationCard({
  recommendation,
  index = 0,
  featured = false,
}: RecommendationCardProps) {
  const { readme, matchScore, readinessScore } = recommendation;
  const setupInfo = readme ? setupComplexityMap[readme.setupComplexity] : null;
  const { ref, inView } = useInView<HTMLElement>();
  const displayScore = useCountUp(matchScore.total, 900);
  const barDelay = Math.min(index, 8) * 90;

  const languageItems = matchScore.breakdown.filter(
    (b) => b.category === "language",
  );
  const interestItems = matchScore.breakdown.filter(
    (b) => b.category === "interest",
  );
  const issueItems = matchScore.breakdown.filter((b) => b.category === "issue");
  const projectItems = matchScore.breakdown.filter(
    (b) => b.category === "project",
  );
  const goalItems = matchScore.breakdown.filter((b) => b.category === "goal");

  return (
    <article
      ref={ref}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className={cn(
        "card-shine gloss-border animate-fade-up group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5",
        featured
          ? "border-primary/35 bg-gradient-to-b from-primary-softer to-card shadow-glow hover:border-primary/45"
          : "border-border/80 bg-card shadow-soft hover:border-primary/25 hover:shadow-glow",
      )}
    >
      <div className="glass-edge flex flex-1 flex-col p-5">
        {featured && (
          <span className="card-shine relative mb-3 inline-flex w-fit items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-primary via-brand-mid to-brand-end px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] whitespace-nowrap text-primary-foreground uppercase shadow-glow animate-fade-in">
            <HugeiconsIcon icon={SparklesIcon} size={11} />
            Recommended for you
          </span>
        )}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <a
              href={`https://github.com/${recommendation.organization}/${recommendation.repository}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${recommendation.organization} repository on GitHub`}
              className="group/repo mb-1 block w-fit max-w-full truncate text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {recommendation.organization}
              <span aria-hidden="true" className="mx-1 text-border">
                /
              </span>
              <span className="text-secondary-foreground group-hover/repo:underline">
                {recommendation.repository}
              </span>
            </a>
            <a
              href={recommendation.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link block font-heading text-sm font-semibold leading-snug text-foreground transition-colors line-clamp-2 hover:text-primary"
            >
              <span className="inline-flex items-start gap-1">
                <span>
                  #{recommendation.issueNumber} {recommendation.issueTitle}
                </span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={14}
                  className="mt-0.5 shrink-0 opacity-0 transition-all duration-200 group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
                />
              </span>
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <div
              className="text-shimmer font-heading text-lg font-bold tabular-nums"
              title={`Match score: ${matchScore.total}`}
            >
              {displayScore}
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize",
                difficultyStyleMap[recommendation.difficulty],
              )}
            >
              {recommendation.difficulty}
            </span>
          </div>
        </div>

        {matchScore.breakdown.length > 0 && (
          <div className="mb-4 space-y-1 rounded-xl bg-muted/40 p-3">
            <ScoreBreakdownGroup items={languageItems} label="Lang" />
            <ScoreBreakdownGroup items={interestItems} label="Fit" />
            <ScoreBreakdownGroup items={issueItems} label="Issue" />
            <ScoreBreakdownGroup items={projectItems} label="Repo" />
            {goalItems.length > 0 && (
              <ScoreBreakdownGroup items={goalItems} label="Goal" />
            )}
          </div>
        )}

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Contribution readiness
            </span>
            <span
              className={cn(
                "text-[11px] font-semibold tabular-nums",
                readinessScore >= 80
                  ? "text-mint-foreground"
                  : readinessScore >= 60
                    ? "text-amber-foreground"
                    : readinessScore >= 40
                      ? "text-peach-foreground"
                      : "text-destructive",
              )}
            >
              {readinessScore}/100
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
            <div
              className={cn(
                "h-full rounded-full transition-[filter] duration-500",
                inView && "animate-bar-fill",
                readinessScore >= 80
                  ? "bg-success hover:brightness-110"
                  : readinessScore >= 60
                    ? "bg-amber-foreground"
                    : readinessScore >= 40
                      ? "bg-peach-foreground"
                      : "bg-destructive",
              )}
              style={{
                width: `${readinessScore}%`,
                animationDelay: `${barDelay}ms`,
              }}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor:
                  languageColorMap[recommendation.repoLanguage] ?? "#857079",
              }}
              aria-hidden="true"
            />
            {recommendation.repoLanguage}
          </span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={StarIcon} size={12} />
            {recommendation.repoStars.toLocaleString()}
          </span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Comment01Icon} size={12} />
            {recommendation.comments}
          </span>
        </div>

        {recommendation.matchedLabels.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {recommendation.matchedLabels.map((label) => (
              <Badge
                key={label}
                variant={labelVariantMap[label] ?? "outline"}
                className="text-[10px]"
              >
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto rounded-xl bg-secondary/70 p-4">
          <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-secondary-foreground uppercase">
            Why this issue
          </p>
          <ul className="space-y-1.5">
            {recommendation.whyRecommended.map((reason, i) => (
              <CheckItem key={i}>{reason}</CheckItem>
            ))}
            {readme?.hasContributionGuide && (
              <CheckItem>Has contribution guide</CheckItem>
            )}
            {setupInfo && <CheckItem>{setupInfo.label}</CheckItem>}
            {readme && readme.techStack.length > 0 && (
              <CheckItem>
                Tech: {readme.techStack.slice(0, 5).join(", ")}
                {readme.techStack.length > 5 &&
                  ` +${readme.techStack.length - 5} more`}
              </CheckItem>
            )}
            {readme && readme.architectureKeywords.length > 0 && (
              <CheckItem>
                Architecture:{" "}
                {readme.architectureKeywords.slice(0, 3).join(", ")}
              </CheckItem>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
