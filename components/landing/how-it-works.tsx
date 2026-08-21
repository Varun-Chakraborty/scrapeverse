"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserEdit01Icon, SearchFocusIcon, Rocket02Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: UserEdit01Icon,
    step: "01",
    title: "Tell us about you",
    description:
      "A 5-step quiz captures your interests, experience, goals, languages, and how much time you have.",
  },
  {
    icon: SearchFocusIcon,
    step: "02",
    title: "We scan the ecosystem",
    description:
      "Our pipeline continuously scrapes live issues across major repositories and scores them against your profile.",
  },
  {
    icon: Rocket02Icon,
    step: "03",
    title: "Start contributing",
    description:
      "Open a curated shortlist of issues with difficulty, context, and a direct link — pick one and ship your PR.",
  },
];

export function HowItWorks({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 sm:py-28">
      {/* Soft band background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-white via-[#fff7fa] to-white"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            How it works
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            From signup to first PR in three steps
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Connector line */}
          <div
            aria-hidden="true"
            className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-primary/20 md:block"
          />

          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 120}>
              <div className="group relative flex flex-col items-center text-center">
                <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                  <HugeiconsIcon icon={step.icon} size={24} />
                  <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-[0_4px_10px_-2px_rgb(201_54_99/0.5)]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading mt-6 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14 text-center">
          <Button variant="gradient" size="lg" onClick={onGetStarted}>
            Start the 30-second setup
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
