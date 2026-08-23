"use client";

import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Alert02Icon,
  TickDouble02Icon,
  LockIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/landing/logo";
import { useAuth } from "@/lib/auth-context";
import type { OnboardingPreferences } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; preferences: OnboardingPreferences | null }) => void;
}

type Tab = "sign-in" | "sign-up" | "forgot-password";

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signUp, signIn } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setResetSuccess(false);
  };

  const handleTabSwitch = (newTab: Tab) => {
    reset();
    setTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (tab === "sign-up") {
        if (!name.trim()) {
          setError("Name is required");
          return;
        }
        if (!email.trim()) {
          setError("Email is required");
          return;
        }
        if (password.length < 4) {
          setError("Password must be at least 4 characters");
          return;
        }
        const newUser = await signUp(name.trim(), email.trim().toLowerCase(), password);
        if (newUser) {
          onSuccess(newUser);
        }
      } else {
        if (!email.trim()) {
          setError("Email is required");
          return;
        }
        const user = await signIn(email.trim().toLowerCase(), password);
        if (user) {
          onSuccess(user);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (password.length < 4) {
        setError("New password must be at least 4 characters");
        return;
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setResetSuccess(true);
    } catch {
      setError("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles: Record<Tab, string> = {
    "sign-in": "Welcome back",
    "sign-up": "Create your account",
    "forgot-password": "Reset your password",
  };

  const descriptions: Record<Tab, string> = {
    "sign-in": "Sign in to access your saved preferences.",
    "sign-up": "Save your preferences and pick up where you left off.",
    "forgot-password": "Enter your email and choose a new password.",
  };

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titles[tab]}
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="animate-modal-in relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border/70 bg-popover shadow-[0_32px_80px_-16px_rgb(61_31_43/0.3)]"
      >
        {/* Decorative top gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 rounded-t-3xl bg-linear-to-b from-primary-softer to-transparent"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>

        <div className="relative px-6 pt-9 pb-7 sm:px-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo />
            <h2 className="font-heading mt-5 text-xl font-bold tracking-tight text-foreground">
              {titles[tab]}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {descriptions[tab]}
            </p>
          </div>

          {tab !== "forgot-password" && (
            <div
              className="mb-5 flex rounded-full border border-border bg-secondary/60 p-1"
              role="tablist"
              aria-label="Authentication options"
            >
              {(["sign-in", "sign-up"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => handleTabSwitch(t)}
                  className={cn(
                    "flex-1 cursor-pointer rounded-full py-2 text-xs font-semibold transition-all duration-300",
                    tab === t
                      ? "bg-background text-primary shadow-soft"
                      : "text-muted-foreground hover:text-secondary-foreground"
                  )}
                >
                  {t === "sign-in" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>
          )}

          {tab === "forgot-password" && !resetSuccess && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Field label="Email" icon={<HugeiconsIcon icon={Mail01Icon} size={15} />}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />
              </Field>

              <Field label="New password" icon={<HugeiconsIcon icon={LockIcon} size={15} />}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Field>

              {error && <ErrorAlert message={error} />}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting…" : "Reset password"}
              </Button>

              <BackToSignIn onBack={() => handleTabSwitch("sign-in")} />
            </form>
          )}

          {tab === "forgot-password" && resetSuccess && (
            <div className="animate-scale-in flex flex-col items-center py-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-mint text-mint-foreground">
                <HugeiconsIcon icon={TickDouble02Icon} size={26} />
              </span>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Password reset successfully
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can now sign in with your new password.
              </p>
              <Button
                onClick={() => handleTabSwitch("sign-in")}
                variant="gradient"
                className="mt-6 w-full"
              >
                Sign in with new password
              </Button>
            </div>
          )}

          {tab !== "forgot-password" && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === "sign-up" && (
                  <Field label="Name">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      autoFocus
                    />
                  </Field>
                )}

                <Field label="Email" icon={<HugeiconsIcon icon={Mail01Icon} size={15} />}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus={tab === "sign-in"}
                  />
                </Field>

                <Field label="Password" icon={<HugeiconsIcon icon={LockIcon} size={15} />}>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={tab === "sign-up" ? "new-password" : "current-password"}
                  />
                </Field>

                {tab === "sign-in" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("forgot-password")}
                      className="cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && <ErrorAlert message={error} />}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? tab === "sign-up"
                      ? "Creating account…"
                      : "Signing in…"
                    : tab === "sign-up"
                      ? "Create account"
                      : "Sign in"}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                {tab === "sign-in" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("sign-up")}
                      className="cursor-pointer font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("sign-in")}
                      className="cursor-pointer font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              <div className="relative my-5">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-popover px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    or
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue without account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="animate-slide-up-sm flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive-soft px-3.5 py-2.5"
    >
      <HugeiconsIcon icon={Alert02Icon} size={15} className="mt-px shrink-0 text-destructive" />
      <p className="text-xs font-medium leading-relaxed text-destructive">{message}</p>
    </div>
  );
}

function BackToSignIn({ onBack }: { onBack: () => void }) {
  return (
    <p className="mt-4 text-center">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-xs font-semibold text-primary underline-offset-2 hover:underline"
      >
        Back to sign in
      </button>
    </p>
  );
}
