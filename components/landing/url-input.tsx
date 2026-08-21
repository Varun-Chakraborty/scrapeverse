"use client";

import { useState } from "react";
import { ArrowRight, Globe, Loader2 } from "lucide-react";

interface UrlInputProps {
  onStartScraping: (url: string) => void;
}

export function UrlInput({ onStartScraping }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    onStartScraping(url.trim());
    setTimeout(() => setIsSubmitting(false), 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card-strong rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 depth-shadow-lg w-full max-w-xl"
    >
      <div className="relative flex-1 w-full">
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="url"
          placeholder="Enter URL to scrape..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-13 w-full pl-11 pr-4 py-3 text-base rounded-xl border border-white/60 bg-white/70 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/60"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary text-primary-foreground text-base font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-px active:translate-y-0 transition-all cursor-pointer disabled:opacity-70 w-full sm:w-auto"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Start Scraping
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
