"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface CtaProps {
  onGetStarted: () => void;
}

export function Cta({ onGetStarted }: CtaProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#c93663] via-[#d94f7c] to-[#9b8cf0] px-6 py-16 text-center shadow-glow sm:px-12 sm:py-20 dark:from-[#3a2c17] dark:via-[#8a6d3f] dark:to-[#b08d57]">
            {/* Decorative shapes */}
            <div
              aria-hidden="true"
              className="animate-float absolute -top-16 -left-16 size-56 rounded-full border-[24px] border-white/10"
            />
            <div
              aria-hidden="true"
              className="animate-float-delayed absolute -right-20 -bottom-20 size-72 rounded-full border-[32px] border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-grid-rose opacity-30"
              style={{ backgroundImage: "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)" }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <HugeiconsIcon icon={SparklesIcon} size={13} />
                Your first contribution is closer than you think
              </span>
              <h2 className="font-heading mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Ready to find your perfect open-source match?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Join contributors who stopped guessing and started shipping.
                Set up your profile in under 30 seconds.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="xl"
                  onClick={onGetStarted}
                  className="w-full bg-white text-primary shadow-[0_12px_32px_-8px_rgb(0_0_0/0.35)] hover:bg-white hover:shadow-[0_16px_40px_-8px_rgb(0_0_0/0.4)] sm:w-auto"
                >
                  Get started — it&apos;s free
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
