"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Code2, Zap } from "lucide-react";

const badges = [
  { icon: Zap, label: "Lightning Fast" },
  { icon: Code2, label: "Clean JSON Output" },
  { icon: CheckCircle2, label: "No Setup Required" },
];

export function FeatureBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap items-center gap-x-6 gap-y-3"
    >
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary">
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
