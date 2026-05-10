export const stats = [
  { label: "Shared Projects", value: "23K+" },
  { label: "Active Members", value: "8.4K" },
  { label: "Monthly Visits", value: "120K" },
];

export const featured = [
  {
    id: 1,
    title: "Superbase UI Kit",
    description:
      "A comprehensive design system built on Radix primitives with full dark mode support.",
    tags: ["Design System", "Radix", "Open Source"],
    featured: true,
    votes: 214,
  },
  {
    id: 2,
    title: "Shipfast Boilerplate",
    description:
      "Next.js starter with auth, payments, and email wired up so you can ship in a weekend.",
    tags: ["Next.js", "SaaS", "Boilerplate"],
    featured: false,
    votes: 87,
  },
  {
    id: 3,
    title: "Devlog — Dev Journal App",
    description:
      "A minimal journaling tool for developers to track daily progress and blockers.",
    tags: ["Productivity", "React", "Side Project"],
    featured: true,
    votes: 143,
  },
  {
    id: 4,
    title: "AI Code Reviewer",
    description:
      "GitHub bot that reviews PRs for bugs, style issues, and security vulnerabilities using GPT-4o.",
    tags: ["AI", "GitHub", "Developer Tool"],
    featured: false,
    votes: 56,
  },
];

export const recentlyLaunched: {
  id: number;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  votes: number;
}[] = [];
