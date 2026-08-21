"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu03Icon, Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onGetStarted: () => void;
}

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar({ onGetStarted }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-white/80 shadow-[0_4px_24px_-12px_rgb(201_54_99/0.15)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <a href="#" aria-label="Scrapeverse home" className="transition-opacity hover:opacity-80">
          <Logo />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-primary-soft hover:text-secondary-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <>
              <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                Hi, {user.name.split(" ")[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
              <Button size="sm" onClick={onGetStarted}>
                My recommendations
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onGetStarted}>
                Sign in
              </Button>
              <Button size="sm" onClick={onGetStarted}>
                Get started free
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:border-primary/30 md:hidden"
        >
          <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu03Icon} size={18} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden">
          <div className="animate-fade-up flex flex-col gap-1 px-4 py-6">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-fade-up rounded-xl px-4 py-3.5 font-heading text-lg font-semibold text-foreground transition-colors hover:bg-primary-soft"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-5">
              {user ? (
                <>
                  <Button onClick={() => { setMenuOpen(false); onGetStarted(); }} size="lg">
                    My recommendations
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => { setMenuOpen(false); signOut(); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => { setMenuOpen(false); onGetStarted(); }} size="lg">
                    Get started free
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => { setMenuOpen(false); onGetStarted(); }}>
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
