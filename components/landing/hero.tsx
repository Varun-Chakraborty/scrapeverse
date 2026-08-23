"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  StarIcon,
  SparklesIcon,
  PlayCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onGetStarted: () => void;
}

const previewIssues = [
  {
    repo: "rust-lang / rust-analyzer",
    title: "FP Syntax Error in Expansion",
    language: "Rust",
    stars: "9.8k",
    difficulty: "Beginner",
    difficultyClass: "bg-mint text-mint-foreground",
    dot: "bg-[#dea584]",
  },
  {
    repo: "denoland / deno",
    title: "Add support for custom file watchers",
    language: "TypeScript",
    stars: "100k",
    difficulty: "Good first issue",
    difficultyClass: "bg-sky text-sky-foreground",
    dot: "bg-[#3178c6]",
  },
  {
    repo: "neovim / neovim",
    title: "Improve documentation for Lua API",
    language: "C",
    stars: "86.2k",
    difficulty: "Documentation",
    difficultyClass: "bg-lavender text-lavender-foreground",
    dot: "bg-[#6688cc]",
  },
];

function PreviewWindow() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Window chrome */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/85 shadow-lift backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/70 bg-card/70 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#f6b0c5]" />
          <span className="size-2.5 rounded-full bg-[#f9d9a5]" />
          <span className="size-2.5 rounded-full bg-[#b5e3c8]" />
          <span className="ml-3 hidden h-5 flex-1 items-center rounded-md bg-muted px-3 text-[11px] text-muted-foreground sm:flex">
            scrapeverse — your matches
          </span>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          {previewIssues.map((issue, i) => (
            <div
              key={issue.repo}
              style={{ animationDelay: `${500 + i * 140}ms` }}
              className="animate-fade-up flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-soft sm:gap-4"
            >
              <span
                className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:block ${issue.difficultyClass}`}
              >
                {issue.difficulty}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-muted-foreground">{issue.repo}</p>
                <p className="truncate text-sm font-medium text-foreground">{issue.title}</p>
              </div>
              <div className="hidden items-center gap-3 text-[11px] text-muted-foreground md:flex">
                <span className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${issue.dot}`} />
                  {issue.language}
                </span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={StarIcon} size={12} />
                  {issue.stars}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating accents */}
      <div
        aria-hidden="true"
        className="animate-float absolute -top-7 -right-4 hidden items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2.5 shadow-lift sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-mint text-mint-foreground">
          <HugeiconsIcon icon={SparklesIcon} size={15} />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">98% match</p>
          <p className="text-[10px] text-muted-foreground">based on your stack</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-float-delayed absolute -bottom-7 -left-4 hidden items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2.5 shadow-lift sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <HugeiconsIcon icon={StarIcon} size={15} />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">100+ issues</p>
          <p className="text-[10px] text-muted-foreground">scanned every 6 hours</p>
        </div>
      </div>
    </div>
  );
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid-rose mask-fade-b absolute inset-0" />
        <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_107_149/0.16),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgb(212_180_131/0.13),transparent)]" />
        <div className="animate-float absolute top-24 -left-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(155_140_240/0.14),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgb(169_155_242/0.1),transparent)]" />
        <div className="animate-float-delayed absolute top-48 -right-24 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(244_162_107/0.13),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgb(169_138_95/0.12),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            style={{ animationDelay: "90ms" }}
            className="animate-fade-up font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Find open-source projects{" "}
            <span className="text-gradient-rose animate-gradient-pan bg-[length:200%_auto]">
              worth contributing to
            </span>
          </h1>

          <p
            style={{ animationDelay: "180ms" }}
            className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Tell us your interests and stack — we scan thousands of
            live issues and surface the ones where you can actually land your
            first (or next) pull request.
          </p>

          <div
            style={{ animationDelay: "270ms" }}
            className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button variant="gradient" size="xl" onClick={onGetStarted} className="w-full sm:w-auto">
              Find my projects
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Button>
            <Button variant="outline" size="xl" render={<a href="#how-it-works" />} className="w-full sm:w-auto">
              <HugeiconsIcon icon={PlayCircleIcon} />
              See how it works
            </Button>
          </div>
        </div>

        <div style={{ animationDelay: "420ms" }} className="animate-fade-up mt-16 sm:mt-20">
          <PreviewWindow />
        </div>
      </div>
    </section>
  );
}
