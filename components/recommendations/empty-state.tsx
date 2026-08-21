"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SearchRemoveIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onBroadenSearch: () => void;
  onSelectTechnology?: (tech: string) => void;
}

const adjacentTechnologies = [
  "Go",
  "Python",
  "JavaScript",
  "Web Development",
  "DevOps",
  "Security",
];

export function EmptyState({ onBroadenSearch, onSelectTechnology }: EmptyStateProps) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/25 bg-white/70 px-4 py-20 text-center backdrop-blur-sm">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 animate-pulse-dot rounded-full bg-primary-soft blur-xl"
        />
        <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-soft">
          <HugeiconsIcon icon={SearchRemoveIcon} size={26} />
        </div>
      </div>

      <h3 className="font-heading mt-6 text-lg font-bold tracking-tight text-foreground">
        No projects found
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        We couldn&apos;t find projects matching your exact criteria. Try
        broadening your filters or exploring adjacent technologies.
      </p>

      <div className="mt-7">
        <p className="mb-2.5 text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          You might also like
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {adjacentTechnologies.map((tech) => (
            <button
              key={tech}
              onClick={() => onSelectTechnology?.(tech)}
              className="text-xs px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all cursor-pointer"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <Button variant="gradient" onClick={onBroadenSearch} className="mt-8">
        Broaden my search
      </Button>
    </div>
  );
}
