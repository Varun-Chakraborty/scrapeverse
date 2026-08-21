"use client";

import { motion } from "framer-motion";
import {
  Bot,
  FileJson,
  FileSpreadsheet,
  FileText,
  Globe,
} from "lucide-react";

const outputs = [
  { icon: FileJson, label: "JSON", tint: "text-primary bg-primary/10", tilt: "-rotateY(7deg)" },
  { icon: FileText, label: "CSV", tint: "text-sky-500 bg-sky-400/10", tilt: "rotateY(0deg)" },
  { icon: FileSpreadsheet, label: "XLSX", tint: "text-emerald-500 bg-emerald-400/10", tilt: "rotateY(7deg)" },
];

export function ScraperVisualization() {
  return (
    <div className="perspective-1500 w-full max-w-md mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="preserve-3d"
        style={{ transform: "rotateX(6deg)" }}
      >
        {/* Web page node */}
        <div className="flex justify-center">
          <div className="glass-card-strong rounded-2xl p-4 w-64 depth-shadow animate-float-y relative overflow-hidden">
            <div className="scan-overlay absolute inset-x-4 top-4 h-8 rounded-md bg-linear-to-b from-primary/15 to-transparent pointer-events-none" />
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-white/80 px-3 py-2">
              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs font-mono text-muted-foreground truncate">
                https://example.com
              </span>
            </div>
          </div>
        </div>

        {/* Connector: page -> engine */}
        <div className="relative h-12 w-px mx-auto bg-linear-to-b from-primary/40 via-primary/25 to-primary/40">
          <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-[dataDrop_1.6s_ease-in-out_infinite]" />
          <span className="absolute -left-14 top-1/2 -translate-y-1/2 text-[10px] font-medium tracking-wide text-primary/70 uppercase whitespace-nowrap hidden sm:block">
            crawling
          </span>
        </div>

        {/* Scraper engine */}
        <div className="flex justify-center">
          <div className="relative animate-glow-pulse rounded-3xl">
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
            <div className="glass-card-strong rounded-3xl w-28 h-28 flex flex-col items-center justify-center gap-1.5 depth-shadow-lg relative">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Bot className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Engine
              </span>
            </div>
          </div>
        </div>

        {/* Fan-out connectors: engine -> outputs */}
        <svg
          viewBox="0 0 400 72"
          fill="none"
          preserveAspectRatio="none"
          className="w-full max-w-sm mx-auto h-16 block"
        >
          <path d="M200 0 C200 36 64 36 64 72" stroke="rgba(37,99,235,0.35)" strokeWidth="1.5" className="flow-line" />
          <path d="M200 0 L200 72" stroke="rgba(37,99,235,0.35)" strokeWidth="1.5" className="flow-line" />
          <path d="M200 0 C200 36 336 36 336 72" stroke="rgba(37,99,235,0.35)" strokeWidth="1.5" className="flow-line" />
          <circle r="3" fill="#2563EB">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M200 0 C200 36 64 36 64 72" />
          </circle>
          <circle r="3" fill="#38BDF8">
            <animateMotion dur="1.8s" begin="0.6s" repeatCount="indefinite" path="M200 0 L200 72" />
          </circle>
          <circle r="3" fill="#10B981">
            <animateMotion dur="1.8s" begin="1.2s" repeatCount="indefinite" path="M200 0 C200 36 336 36 336 72" />
          </circle>
        </svg>

        {/* Output cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto">
          {outputs.map(({ icon: Icon, label, tint, tilt }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.12 }}
              className="glass-card rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 depth-shadow animate-float-y-delayed hover:glow-blue transition-shadow duration-300"
              style={{
                transform: `translateZ(30px) ${tilt}`,
                animationDelay: `${-2 - i * 1.5}s`,
              }}
            >
              <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${tint}`}>
                <Icon className="w-4.5 h-4.5" />
              </span>
              <span className="text-xs font-semibold text-foreground tracking-wide">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
