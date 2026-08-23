"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, QuoteDownIcon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/ui/reveal";

const stats = [
  { value: "100+", label: "Issues scanned every 6 hours" },
  { value: "30s", label: "Average setup time" },
  { value: "4", label: "Profile dimensions matched" },
  { value: "100%", label: "Free to use" },
];

const testimonials = [
  {
    quote:
      "I spent months lurking on GitHub with no idea where to start. Scrapeverse handed me three beginner issues in Rust that same evening — my first PR was merged within a week.",
    name: "Aarav Mehta",
    role: "CS student & first-time contributor",
    initials: "AM",
    tint: "from-primary to-[#e56b95]",
  },
  {
    quote:
      "The “why recommended” notes are the killer feature. I finally understand why an issue fits my stack and skill level instead of guessing from star counts.",
    name: "Sofia Reyes",
    role: "Backend engineer",
    initials: "SR",
    tint: "from-[#9b8cf0] to-[#c084fc]",
  },
  {
    quote:
      "We point every new hire at Scrapeverse during onboarding week. It finds genuinely approachable issues in our ecosystem faster than any internal doc ever did.",
    name: "Daniel Kim",
    role: "Engineering manager",
    initials: "DK",
    tint: "from-[#f4a26b] to-[#e56b95]",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Stats band */}
        <Reveal>
          <div className="grid grid-cols-2 gap-y-10 rounded-3xl border border-border/80 bg-linear-to-br from-[#fff7fa] via-white to-[#f6f4ff] px-6 py-10 shadow-soft sm:px-12 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl font-extrabold tracking-tight text-gradient-rose sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-24 max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Testimonials
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Loved by first-timers and maintainers
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <HugeiconsIcon
                  icon={QuoteDownIcon}
                  size={22}
                  className="text-primary/30"
                />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full bg-linear-to-br ${t.tint} text-xs font-bold text-white shadow-soft`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <span className="ml-auto flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <HugeiconsIcon
                        key={s}
                        icon={StarIcon}
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
