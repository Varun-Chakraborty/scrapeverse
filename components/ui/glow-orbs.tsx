import { cn } from "@/lib/utils";

interface OrbDefinition {
  cls: string;
  bg: string;
  darkBg: string;
}

const HERO_ORBS: OrbDefinition[] = [
  {
    cls: "absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2",
    bg: "bg-[radial-gradient(closest-side,rgb(229_107_149/0.16),transparent)]",
    darkBg:
      "dark:bg-[radial-gradient(closest-side,rgb(212_180_131/0.13),transparent)]",
  },
  {
    cls: "animate-float absolute top-24 -left-24 size-72",
    bg: "bg-[radial-gradient(closest-side,rgb(155_140_240/0.14),transparent)]",
    darkBg:
      "dark:bg-[radial-gradient(closest-side,rgb(169_155_242/0.1),transparent)]",
  },
  {
    cls: "animate-float-delayed absolute top-48 -right-24 size-80",
    bg: "bg-[radial-gradient(closest-side,rgb(244_162_107/0.13),transparent)]",
    darkBg:
      "dark:bg-[radial-gradient(closest-side,rgb(169_138_95/0.12),transparent)]",
  },
];

const COMPACT_ORBS: OrbDefinition[] = [
  {
    cls: "absolute -top-24 left-1/2 h-96 w-[680px] -translate-x-1/2",
    bg: "bg-[radial-gradient(closest-side,rgb(229_107_149/0.13),transparent)]",
    darkBg: "",
  },
  {
    cls: "animate-float absolute top-1/3 -left-24 size-64",
    bg: "bg-[radial-gradient(closest-side,rgb(155_140_240/0.12),transparent)]",
    darkBg: "",
  },
  {
    cls: "animate-float-delayed absolute right-[-6rem] bottom-10 size-72",
    bg: "bg-[radial-gradient(closest-side,rgb(244_162_107/0.11),transparent)]",
    darkBg: "",
  },
];

export function GlowOrbs({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const orbs = variant === "hero" ? HERO_ORBS : COMPACT_ORBS;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="bg-grid-rose mask-fade-b absolute inset-0" />
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn("rounded-full blur-2xl", orb.cls, orb.bg, orb.darkBg)}
        />
      ))}
    </div>
  );
}