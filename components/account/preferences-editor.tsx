"use client";

import { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  TickDouble02Icon,
  LockPasswordIcon,
  HeartIcon,
  Rocket02Icon,
  Target02Icon,
  CodeIcon,
  Clock01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/landing/logo";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepExperience } from "@/components/onboarding/step-experience";
import { StepGoals } from "@/components/onboarding/step-goals";
import { StepLanguages } from "@/components/onboarding/step-languages";
import { StepTime } from "@/components/onboarding/step-time";
import { useAuth } from "@/lib/auth-context";
import type {
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  TimeCommitment,
  OnboardingPreferences,
} from "@/lib/types";

type EditorSection =
  | "overview"
  | "interests"
  | "experience"
  | "goals"
  | "languages"
  | "time"
  | "password";

interface PreferencesEditorProps {
  onClose: () => void;
}

export function PreferencesEditor({ onClose }: PreferencesEditorProps) {
  const { user, updatePreferences } = useAuth();
  const prefs = user?.preferences;

  const [section, setSection] = useState<EditorSection>("overview");

  const [interests, setInterests] = useState<Interest[]>(prefs?.interests ?? []);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    prefs?.experienceLevel ?? null
  );
  const [goals, setGoals] = useState<Goal[]>(prefs?.goals ?? []);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>(
    prefs?.languages ?? []
  );
  const [customLanguages, setCustomLanguages] = useState<string[]>(
    prefs?.customLanguages ?? []
  );
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(
    prefs?.timeCommitment ?? null
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const toggleItem = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
      setter((prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item]
      );
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const newPrefs: OnboardingPreferences = {
        interests,
        experienceLevel,
        goals,
        languages,
        customLanguages,
        timeCommitment,
      };
      await updatePreferences(newPrefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword) {
      setPasswordError("Both fields are required");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const sections: {
    key: EditorSection;
    label: string;
    description: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      key: "interests",
      label: "Interests",
      description: "Topics and ecosystems you care about",
      icon: <HugeiconsIcon icon={HeartIcon} size={18} />,
      count: interests.length,
    },
    {
      key: "experience",
      label: "Experience",
      description: "Your open-source contribution level",
      icon: <HugeiconsIcon icon={Rocket02Icon} size={18} />,
      count: experienceLevel ? 1 : 0,
    },
    {
      key: "goals",
      label: "Goals",
      description: "What you want to achieve",
      icon: <HugeiconsIcon icon={Target02Icon} size={18} />,
      count: goals.length,
    },
    {
      key: "languages",
      label: "Languages",
      description: "Programming languages you use",
      icon: <HugeiconsIcon icon={CodeIcon} size={18} />,
      count: languages.length + customLanguages.length,
    },
    {
      key: "time",
      label: "Time commitment",
      description: "Hours you can invest weekly",
      icon: <HugeiconsIcon icon={Clock01Icon} size={18} />,
      count: timeCommitment ? 1 : 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to results"
              className="hidden transition-opacity hover:opacity-75 sm:block"
            >
              <Logo />
            </button>
            <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
            <div>
              <h1 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                Edit preferences
              </h1>
              <p className="text-xs text-muted-foreground">
                Update your profile to refine recommendations
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to results
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {section === "overview" && (
          <div className="animate-fade-up space-y-4">
            <div className="rounded-2xl border border-primary/15 bg-linear-to-br from-[#fff7fa] to-white p-5 shadow-soft">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Click any section below to edit your preferences. Changes are
                saved to your account when you press{" "}
                <span className="font-semibold text-secondary-foreground">Save changes</span>.
              </p>
            </div>

            <div className="grid gap-3">
              {sections.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => setSection(s.key)}
                  className="animate-fade-up group flex cursor-pointer items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                    {s.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {s.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {s.description}
                    </span>
                  </span>
                  {s.count !== undefined && s.count > 0 && (
                    <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-bold text-mint-foreground">
                      {s.count}
                    </span>
                  )}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSection("password")}
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender text-lavender-foreground transition-transform duration-300 group-hover:scale-110">
                  <HugeiconsIcon icon={LockPasswordIcon} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    Change password
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Update your account security
                  </span>
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant={saved ? "secondary" : "gradient"}
                className="px-6"
              >
                {saving ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <HugeiconsIcon icon={TickDouble02Icon} />
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        )}

        {section !== "overview" && (
          <div className="animate-fade-up">
            <button
              type="button"
              onClick={() => setSection("overview")}
              className="mb-6 flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Back to overview
            </button>

            <div className="rounded-3xl border border-border/80 bg-white/85 p-6 shadow-soft backdrop-blur-sm sm:p-8">
              {section === "interests" && (
                <StepInterests
                  selected={interests}
                  onToggle={(i) => toggleItem(setInterests, i)}
                />
              )}

              {section === "experience" && (
                <StepExperience
                  selected={experienceLevel}
                  onSelect={setExperienceLevel}
                />
              )}

              {section === "goals" && (
                <StepGoals
                  selected={goals}
                  onToggle={(g) => toggleItem(setGoals, g)}
                />
              )}

              {section === "languages" && (
                <StepLanguages
                  selected={languages}
                  customLanguages={customLanguages}
                  onToggle={(l) => toggleItem(setLanguages, l)}
                  onAddCustom={(l) =>
                    setCustomLanguages((prev) =>
                      prev.includes(l) ? prev : [...prev, l]
                    )
                  }
                  onRemoveCustom={(l) =>
                    setCustomLanguages((prev) => prev.filter((c) => c !== l))
                  }
                />
              )}

              {section === "time" && (
                <StepTime
                  selected={timeCommitment}
                  onSelect={setTimeCommitment}
                />
              )}

              {section === "password" && (
                <div>
                  <div className="mb-8 text-center">
                    <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                      Change password
                    </h2>
                    <p className="mt-2.5 text-sm text-muted-foreground">
                      Choose a strong password with at least 4 characters.
                    </p>
                  </div>

                  <div className="mx-auto max-w-sm space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-foreground">
                        Current password
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-foreground">
                        New password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-foreground">
                        Confirm new password
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>

                    {passwordError && (
                      <div
                        role="alert"
                        className="animate-slide-up-sm flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive-soft px-3.5 py-2.5"
                      >
                        <HugeiconsIcon
                          icon={Alert02Icon}
                          size={15}
                          className="mt-px shrink-0 text-destructive"
                        />
                        <p className="text-xs font-medium leading-relaxed text-destructive">
                          {passwordError}
                        </p>
                      </div>
                    )}
                    {passwordSuccess && (
                      <p className="animate-slide-up-sm flex items-center gap-2 rounded-xl bg-success-soft px-3.5 py-2.5 text-xs font-semibold text-success">
                        <HugeiconsIcon icon={TickDouble02Icon} size={15} />
                        Password changed successfully
                      </p>
                    )}

                    <Button
                      onClick={handlePasswordChange}
                      disabled={changingPassword}
                      variant="gradient"
                      className="w-full"
                    >
                      {changingPassword ? "Changing…" : "Change password"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {section !== "password" && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => setSection("overview")}>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
