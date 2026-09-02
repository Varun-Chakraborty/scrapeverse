"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MinusSignIcon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is Scrapeverse really free?",
    answer:
      "Yes. Creating an account, saving preferences, and browsing recommendations is completely free — no credit card required.",
  },
  {
    question: "Where do the project recommendations come from?",
    answer: `We scrape public issue trackers across major open-source repositories regularly, then score each issue against your profile: languages, interests, experience level, and goals.`,
  },
  {
    question: "I'm a complete beginner. Is this for me?",
    answer:
      "Absolutely. Select “Beginner” during onboarding and we prioritize issues labeled good first issue or help wanted in welcoming, well-documented communities.",
  },
  {
    question: "Can I change my preferences later?",
    answer:
      "Yes — choose Start over from the results page and run through the quick setup again. Your matches re-rank instantly.",
  },
  {
    question: "How fresh is the issue data?",
    answer: `The pipeline refreshes regularly and automatically re-scrapes when data goes stale, so you're always looking at live, open issues rather than stale snapshots.`,
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-background via-card to-background"
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            FAQ
          </p>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.question} delay={i * 60}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                    isOpen
                      ? "border-primary/25 shadow-lift"
                      : "border-border/80 shadow-soft hover:border-primary/15",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left sm:px-6"
                  >
                    <span className="font-heading text-sm font-semibold text-foreground sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen
                          ? "rotate-180 bg-primary text-white"
                          : "bg-primary-soft text-primary",
                      )}
                    >
                      <HugeiconsIcon
                        icon={isOpen ? MinusSignIcon : Add01Icon}
                        size={14}
                      />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    className={cn(
                      "grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
