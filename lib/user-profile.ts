export const INTERESTS = [
  { value: "Compilers", icon: "⚙️" },
  { value: "Programming Languages", icon: "🔤" },
  { value: "Operating Systems", icon: "💻" },
  { value: "Databases", icon: "🗄️" },
  { value: "Web Development", icon: "🌐" },
  { value: "AI / ML", icon: "🧠" },
  { value: "Developer Tools", icon: "🛠️" },
  { value: "Game Development", icon: "🎮" },
  { value: "Security", icon: "🔒" },
  { value: "Embedded Systems", icon: "🔌" },
  { value: "DevOps", icon: "🚀" },
  { value: "Networking", icon: "📡" },
] as const;

export const EXPERIENCE_LEVELS = [
  {
    value: "Beginner",
    description:
      "New to open source. Looking for welcoming communities and well-documented issues labeled for newcomers.",
    icon: "🌱",
  },
  {
    value: "Intermediate",
    description:
      "Have contributed before. Comfortable with PRs, code review, and project workflows.",
    icon: "🌿",
  },
  {
    value: "Advanced",
    description:
      "Experienced contributor. Ready for architectural work, performance optimization, and core features.",
    icon: "🌳",
  },
] as const;

export const GOALS = [
  {
    value: "First Open Source Contribution",
    description: "Make your debut in open source",
  },
  {
    value: "Build Portfolio",
    description: "Showcase work to employers",
  },
  {
    value: "Learn New Technologies",
    description: "Pick up new skills hands-on",
  },
  {
    value: "Find Mentors",
    description: "Connect with experienced devs",
  },
  {
    value: "Contribute to Production Systems",
    description: "Work on real-world codebases",
  },
  {
    value: "Prepare for Jobs",
    description: "Strengthen your resume",
  },
  {
    value: "Deep Technical Learning",
    description: "Dive deep into complex systems",
  },
] as const;

export type Interest = (typeof INTERESTS)[number]["value"];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];
export type Goal = (typeof GOALS)[number]["value"];
