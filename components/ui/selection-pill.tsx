import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/check-icon";
import type { ButtonHTMLAttributes } from "react";

interface SelectionPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  showCheck?: boolean;
}

export function SelectionPill({
  selected,
  showCheck = false,
  className,
  children,
  ...props
}: SelectionPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "animate-fade-up flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.97]",
        selected
          ? "border-primary bg-primary text-white shadow-[0_6px_16px_-6px_rgb(201_54_99/0.55)]"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-secondary-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {showCheck && (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 items-center justify-center rounded-full transition-all duration-200",
            selected ? "scale-100 bg-white/25" : "scale-0",
          )}
        >
          <CheckIcon size={9} strokeWidth={2} />
        </span>
      )}
    </button>
  );
}