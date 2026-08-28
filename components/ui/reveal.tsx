"use client";

import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  });

  const Tag = as;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-visible={inView}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}