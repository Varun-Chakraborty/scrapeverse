"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { UrlInput } from "@/components/landing/url-input";
import { FeatureBadges } from "@/components/landing/feature-badges";
import { ScraperVisualization } from "@/components/landing/scraper-visualization";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_65%)]" />
        <div className="absolute top-1/3 -right-52 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
        <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.18)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Left column */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 mb-7"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary uppercase">
              AI Powered Web Scraper
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6"
          >
            Turn the Web Into{" "}
            <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              Structured Data.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 mb-9"
          >
            Extract, transform and structure data from any website instantly.
            One URL in, clean data out — no setup required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center lg:justify-start mb-8"
          >
            <UrlInput onStartScraping={onGetStarted} />
          </motion.div>

          <div className="flex justify-center lg:justify-start">
            <FeatureBadges />
          </div>
        </div>

        {/* Right column — 3D visualization */}
        <ScraperVisualization />
      </div>
    </section>
  );
}
