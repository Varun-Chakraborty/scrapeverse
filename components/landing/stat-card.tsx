"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  decimals?: number;
  suffix?: string;
  change?: string;
  delay?: number;
}

function useCountUp(target: number, decimals: number, active: boolean) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString("en-US")
      );
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimals]);

  return display;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  decimals = 0,
  suffix = "",
  change,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const display = useCountUp(value, decimals, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="glass-card glass-card-hover rounded-2xl p-6 depth-shadow group"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="w-5 h-5" />
        </span>
        {change && (
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-400/10 rounded-full px-2.5 py-1">
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight text-foreground mb-1">
        {display}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
}
