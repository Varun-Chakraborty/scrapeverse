"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout03Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={cn(
          "flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card pr-1 pl-1 transition-all duration-200",
          open
            ? "border-primary/40 shadow-soft"
            : "hover:border-primary/30 hover:shadow-soft"
        )}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-primary to-[#9b8cf0] text-[10px] font-bold text-white">
          {initials}
        </span>
        <span className="max-w-[100px] truncate text-xs font-semibold text-foreground sm:block hidden">
          {user.name}
        </span>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={12}
          className={cn(
            "mr-1.5 rotate-45 text-muted-foreground transition-transform duration-200",
            open && "rotate-[225deg]"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-slide-up-sm absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-lift"
        >
          <div className="border-b border-border/70 bg-secondary/50 px-4 py-3.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          {user.preferences && (
            <div className="border-t border-border/70 px-4 py-3">
              <p className="mb-1.5 text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Current setup
              </p>
              <div className="flex flex-wrap gap-1">
                {user.preferences.languages.slice(0, 3).map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground"
                  >
                    {l}
                  </span>
                ))}
                {user.preferences.languages.length > 3 && (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    +{user.preferences.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-border/70 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive-soft"
            >
              <HugeiconsIcon icon={Logout03Icon} size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
