export const LANGUAGES = [
  { value: "Rust", color: "#dea584" },
  { value: "C", color: "#555555" },
  { value: "C++", color: "#f34b7d" },
  { value: "Go", color: "#00ADD8" },
  { value: "JavaScript", color: "#f1e05a" },
  { value: "TypeScript", color: "#3178c6" },
  { value: "Python", color: "#3572A5" },
  { value: "Java", color: "#b07219" },
  { value: "Kotlin", color: "#A97BFF" },
  { value: "Zig", color: "#ec915c" },
] as const;

export type ProgrammingLanguage = (typeof LANGUAGES)[number]["value"];

export const languageColorMap: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.value, l.color]),
);
