export const LANGUAGES = [
  { value: "Rust", label: "Rust", color: "#dea584" },
  { value: "C", label: "C", color: "#555555" },
  { value: "C++", label: "C++", color: "#f34b7d" },
  { value: "Go", label: "Go", color: "#00ADD8" },
  { value: "JavaScript", label: "JavaScript", color: "#f1e05a" },
  { value: "TypeScript", label: "TypeScript", color: "#3178c6" },
  { value: "Python", label: "Python", color: "#3572A5" },
  { value: "Java", label: "Java", color: "#b07219" },
  { value: "Kotlin", label: "Kotlin", color: "#A97BFF" },
  { value: "Zig", label: "Zig", color: "#ec915c" },
] as const;

export type ProgrammingLanguage = (typeof LANGUAGES)[number]["value"];

export const languageOptions = LANGUAGES.map(({ value, label }) => ({
  value,
  label,
}));

export const languageColorMap: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.value, l.color]),
);
