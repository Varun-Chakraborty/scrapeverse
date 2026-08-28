"use client";

import { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { StepHeader } from "./step-header";
import type { ProgrammingLanguage } from "@/lib/types";
import { languageOptions } from "@/lib/languages";

interface StepLanguagesProps {
  selected: ProgrammingLanguage[];
  customLanguages: string[];
  onToggle: (lang: ProgrammingLanguage) => void;
  onAddCustom: (lang: string) => void;
  onRemoveCustom: (lang: string) => void;
}

export function StepLanguages({
  selected,
  customLanguages,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: StepLanguagesProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddCustom = useCallback(() => {
    const trimmed = inputValue.trim();
    if (
      trimmed &&
      !customLanguages.includes(trimmed) &&
      !languageOptions.some((l) => l.value === trimmed)
    ) {
      onAddCustom(trimmed);
      setInputValue("");
    }
  }, [inputValue, customLanguages, onAddCustom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCustom();
      }
    },
    [handleAddCustom],
  );

  return (
    <div className="mx-auto w-full">
      <StepHeader
        step={4}
        title="What languages do you use?"
        description="Select your preferred languages or add your own."
      />

      <div
        className="mb-6 flex flex-wrap justify-center gap-2.5"
        role="group"
        aria-label="Your languages"
      >
        {languageOptions.map((lang, i) => {
          const isSelected = selected.includes(lang.value);
          return (
            <button
              key={lang.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(lang.value)}
              style={{ animationDelay: `${i * 35}ms` }}
              className={cn(
                "animate-fade-up cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                "hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.97]",
                isSelected
                  ? "border-primary bg-primary text-white shadow-[0_6px_16px_-6px_rgb(201_54_99/0.55)]"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-secondary-foreground",
              )}
            >
              {lang.label}
            </button>
          );
        })}

        {customLanguages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => onRemoveCustom(lang)}
            aria-label={`Remove ${lang}`}
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-primary-softer px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-destructive/50 hover:bg-destructive-soft hover:text-destructive active:scale-[0.97]"
          >
            {lang}
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={12}
              className="text-muted-foreground transition-colors group-hover:text-destructive"
            />
          </button>
        ))}
      </div>

      <div className="mx-auto flex max-w-xs items-center gap-2">
        <Input
          placeholder="Add custom language…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add a custom language"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!inputValue.trim()}
          aria-label="Add language"
          className="flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-primary/30 bg-primary-soft px-4 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
        </button>
      </div>

      {(selected.length > 0 || customLanguages.length > 0) && (
        <p className="animate-fade-in mt-6 text-center text-xs font-medium text-muted-foreground">
          {selected.length + customLanguages.length}{" "}
          {selected.length + customLanguages.length === 1
            ? "language"
            : "languages"}{" "}
          selected
        </p>
      )}
    </div>
  );
}
