import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[#9b8cf0] shadow-[0_6px_16px_-4px_rgb(201_54_99/0.5)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
          <path d="M11 8.5v5M8.5 11h5" />
        </svg>
      </span>
      <span className="font-heading text-lg font-bold tracking-tight text-foreground">
        Scrapeverse
      </span>
    </span>
  );
}
