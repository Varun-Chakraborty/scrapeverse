"use client";

import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import { useBodyScrollLock, useEscapeKey } from "@/lib/use-dismissible";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, open);
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="animate-modal-in relative z-10 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-border/70 bg-popover shadow-[0_32px_80px_-16px_rgb(61_31_43/0.3)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 rounded-t-3xl bg-linear-to-b from-primary-softer to-transparent"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>

        <div className="relative px-6 pt-9 pb-7 sm:px-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo />
            <h2 className="font-heading mt-5 text-xl font-bold tracking-tight text-foreground">
              Welcome to Scrapeverse
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to save your preferences and get personalized
              recommendations.
            </p>
          </div>

          <a href="/api/auth/github" className="block w-full">
            <Button variant="gradient" className="w-full">
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </Button>
          </a>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
