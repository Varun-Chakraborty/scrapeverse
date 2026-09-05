"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/lib/consent-context";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/landing/logo";

export function ConsentGate() {
  const { needsConsent, consents, accept, decline } = useConsent();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const visible = Boolean(user) && needsConsent;

  if (!visible) return null;

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await accept();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setSubmitting(true);
    await decline();
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-60 flex items-center justify-center bg-background/85 p-4 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Updated terms and privacy policy"
    >
      <div className="animate-modal-in w-full max-w-md rounded-3xl border border-border bg-popover p-8 shadow-[0_32px_80px_-16px_rgb(61_31_43/0.4)]">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h2 className="font-heading mt-5 text-xl font-bold tracking-tight text-foreground">
            We&apos;ve updated our legal documents
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Before you continue, please review and accept the latest versions of
            our Privacy Policy and Terms of Service.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {consents.map((consent) => (
            <li
              key={consent.type}
              className="flex items-center justify-between rounded-2xl border border-border bg-card/60 px-4 py-3"
            >
              <span className="text-sm font-medium capitalize text-foreground">
                {consent.type === "terms"
                  ? "Terms of Service"
                  : "Privacy Policy"}
                {consent.consented ? null : (
                  <span className="font-normal text-muted-foreground lowercase">
                    {" "}
                    (v{consent.version} - updated)
                  </span>
                )}
              </span>
              <a
                href={consent.type === "terms" ? "/terms" : "/privacy"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                View
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-7 space-y-3">
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleAccept}
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Accept & continue"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={handleDecline}
            disabled={submitting}
          >
            Decline & sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
