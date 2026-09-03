import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Scrapeverse",
  description:
    "How Scrapeverse collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "The short version",
    body: "We collect just enough information to make Scrapeverse work: your GitHub account details (name, email, and avatar) and your personal preferences. We use it only to give you better recommendations. We do not sell your data.",
  },
  {
    title: "What we collect",
    body: "When you sign in with your GitHub account, we collect your name, email address, and avatar image from your GitHub profile. When you complete the onboarding flow, we store your interests, experience level, contribution goals, and programming languages so we can recommend issues that fit you.",
  },
  {
    title: "What we don't collect",
    body: "We don't run analytics or tracking scripts, and we don't collect usage logs, location data, or anything else that isn't needed for the service to function. We don't have access to your GitHub password or private repositories — GitHub handles authentication itself and shares only the public profile information you've approved.",
  },
  {
    title: "Rate limiting",
    body: "We apply rate limiting to protect the service from abuse. We track requests by IP address and limit each IP to 100 requests per minute. If you exceed this limit, you'll receive a 429 response. This data is stored temporarily in memory and is automatically cleared after the rate limit window expires.",
  },
  {
    title: "How we use your information",
    body: "We use your name and email to identify you and keep you logged in. We use your avatar to display your profile. We use your preferences to rank and recommend open-source issues for you. That's it.",
  },
  {
    title: "Cookies and sessions",
    body: "We use a secure session cookie to keep you logged in after you sign in with GitHub. It contains a short-lived token, not your personal details, and expires automatically after a short time.",
  },
  {
    title: "Where your data lives",
    body: "Your account information is stored in our database. We're built to run on Vercel's infrastructure and use a hosted PostgreSQL database.",
  },
  {
    title: "Sharing",
    body: "We never sell your personal information. We only share data with the services needed to run this site (for example, our database provider), and only to the extent needed to provide the service.",
  },
  {
    title: "GitHub authorization",
    body: "Signing in with GitHub is the only way to create an account. When you sign in, GitHub shares with us the profile information you approve (your name, email, and avatar). We do not receive or store your GitHub password.",
  },
  {
    title: "How long we keep it",
    body: "We keep your account and preferences for as long as your account exists. If you decide to delete your account, contact us and we'll remove your data.",
  },
  {
    title: "Your rights",
    body: "You can update your preferences in the app at any time. Depending on where you live, you may also have rights to access, correct, or delete your personal data. Contact us and we'll help.",
  },
  {
    title: "Children's privacy",
    body: "Scrapeverse is not directed at children under 13, and we don't knowingly collect their data. If you believe a child has given us information, contact us and we'll delete it.",
  },
  {
    title: "Changes to this policy",
    body: "If we change how we handle your data, we'll update this page. The date at the top shows when it was last revised.",
  },
  {
    title: "Contact",
    body: "Questions about this policy? Reach out to us at varunchakraborty9526@outlook.com and we'll be happy to help.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: September 3, 2026
      </p>
      <p className="mt-6 text-muted-foreground">
        This policy explains in plain English what information Scrapeverse
        collects, why we collect it, and how we use it.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
