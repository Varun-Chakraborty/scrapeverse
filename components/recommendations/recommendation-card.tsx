"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, StarIcon, Comment01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
}

const difficultyStyleMap: Record<string, string> = {
  beginner: "bg-mint text-mint-foreground",
  intermediate: "bg-sky text-sky-foreground",
  advanced: "bg-amber-soft text-amber-foreground",
};

const labelVariantMap: Record<string, "secondary" | "info" | "destructive" | "lavender" | "outline"> = {
  "Beginner Friendly": "secondary",
  "Help Wanted": "info",
  "Bug Fix": "destructive",
  Documentation: "lavender",
};

export function RecommendationCard({ recommendation, index = 0 }: RecommendationCardProps) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className="animate-fade-up group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-lift"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1 truncate text-[11px] font-medium text-muted-foreground">
              {recommendation.organization}
              <span aria-hidden="true" className="mx-1 text-border">/</span>
              <span className="text-secondary-foreground">{recommendation.repository}</span>
            </p>
            <a
              href={recommendation.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-start gap-1 font-heading text-sm font-semibold leading-snug text-foreground transition-colors line-clamp-2 hover:text-primary"
            >
              <span>
                #{recommendation.issueNumber} {recommendation.issueTitle}
              </span>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                className="mt-0.5 shrink-0 opacity-0 transition-all duration-200 group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
              />
            </a>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize",
              difficultyStyleMap[recommendation.difficulty]
            )}
          >
            {recommendation.difficulty}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary/60" aria-hidden="true" />
            {recommendation.repoLanguage}
          </span>
          <span aria-hidden="true" className="text-border">·</span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={StarIcon} size={12} />
            {recommendation.repoStars.toLocaleString()}
          </span>
          <span aria-hidden="true" className="text-border">·</span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Comment01Icon} size={12} />
            {recommendation.comments}
          </span>
        </div>

        {recommendation.labels.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {recommendation.labels.slice(0, 4).map((label) => (
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
              <li
                key={i}
                className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-primary"
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
