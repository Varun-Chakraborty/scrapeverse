"use client";

import { Globe2, TrendingUp, Database, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/landing/stat-card";

const stats = [
  {
    icon: TrendingUp,
    title: "Total Extractions",
    value: 12481,
    change: "+18.6%",
  },
  {
    icon: Globe2,
    title: "Websites Crawled",
    value: 782,
    change: "+9.2%",
  },
  {
    icon: Database,
    title: "Data Points",
    value: 1.2,
    decimals: 1,
    suffix: "M+",
  },
  {
    icon: CheckCircle2,
    title: "Success Rate",
    value: 98.7,
    decimals: 1,
    suffix: "%",
  },
];

export function StatsSection() {
  return (
    <section id="features" className="relative py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.title} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
