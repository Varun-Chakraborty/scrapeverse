"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target02Icon,
  SparklesIcon,
  Clock01Icon,
  FilterHorizontalIcon,
  ShieldUserIcon,
  GitPullRequestIcon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/ui/reveal";

const features = [
  {
    icon: Target02Icon,
    tint: "bg-primary-soft text-primary",
    title: "Matched to your profile",
    description:
      "Recommendations ranked by your languages, interests, experience level, and goals — not by hype.",
  },
  {
    icon: SparklesIcon,
    tint: "bg-lavender text-lavender-foreground",
    title: "Explains every pick",
    description:
      "Each issue comes with a clear “why this was recommended” breakdown, so you always know why it landed in your feed.",
  },
  {
    icon: Clock01Icon,
    tint: "bg-peach text-peach-foreground",
    title: "Always fresh data",
    description:
      "Issues are scraped and refreshed continuously, so you never waste an evening on something merged weeks ago.",
  },
  {
    icon: FilterHorizontalIcon,
    tint: "bg-sky text-sky-foreground",
    title: "Precision filters",
    description:
      "Slice results by difficulty, language, or beginner-friendliness to find the exact kind of contribution you want.",
  },
  {
    icon: ShieldUserIcon,
    tint: "bg-mint text-mint-foreground",
    title: "Saved preferences",
    description:
      "Create a free account and your profile follows you — update it anytime and your matches re-rank instantly.",
  },
  {
    icon: GitPullRequestIcon,
    tint: "bg-amber-soft text-amber-foreground",
    title: "From issue to PR",
    description:
      "Every card links straight to the live GitHub issue with labels, activity, and context — one click from browsing to contributing.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Features
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to start contributing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Stop drowning in GitHub search results. Scrapeverse turns raw issue
            data into a shortlist you can act on.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 90}>
              <div className="group h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-lift">
                <span
                  className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${feature.tint}`}
                >
                  <HugeiconsIcon icon={feature.icon} size={22} />
                </span>
                <h3 className="font-heading mt-5 text-base font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
