import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Scrapeverse",
  description:
    "The plain-English terms for using Scrapeverse, an open-source opportunity finder.",
};

const sections = [
  {
    title: "What Scrapeverse is",
    body: "Scrapeverse is a tool that helps developers find open-source projects and issues that match their interests and skill level. It pulls data from public sources like GitHub and shows you recommendations.",
  },
  {
    title: "Using the service",
    body: "You can use Scrapeverse to find open-source opportunities. You're responsible for your account and keeping your login information secure. You agree not to abuse, overload, or try to break the service.",
  },
  {
    title: "Your account",
    body: "To use the full experience, you sign in with your GitHub account. We don't create or manage your login credentials — GitHub does. You're responsible for keeping your GitHub account secure, and for what happens under your GitHub account.",
  },
  {
    title: "Sign-in method",
    body: "Scrapeverse sign-in is available only through GitHub OAuth. We no longer offer email/password sign-up, sign-in, or password reset features. When you sign in with GitHub, you authorize us to receive your basic public profile information (name, email, and avatar). We don't store your GitHub password.",
  },
  {
    title: "Content from third parties",
    body: "Scrapeverse shows projects, issues, and other content from GitHub and the public open-source community. That content belongs to its original owners. We don't own it, and we're not responsible for what it contains.",
  },
  {
    title: "Acceptable use",
    body: "Please use the site sensibly. Don't scrape our site beyond normal use, don't try to access other users' accounts, and don't use the service to do anything harmful or illegal.",
  },
  {
    title: "Rate limiting",
    body: "To ensure fair usage and protect the service, we apply rate limits of 100 requests per minute per IP address. Exceeding this limit will result in a temporary block with a 429 status code. If you need higher limits for legitimate use, please contact us.",
  },
  {
    title: "No guarantees",
    body: 'We try to keep Scrapeverse accurate and reliable, but we provide it "as is" and "as available" without any warranty. The service may change, have bugs, or be unavailable from time to time. Recommendations are suggestions, not guarantees.',
  },
  {
    title: "Limitation of liability",
    body: "To the maximum extent allowed by law, Scrapeverse won't be liable for any indirect or incidental damages arising from your use of the service.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. We'll post changes on this page with an updated date. Continuing to use the service after changes means you accept the new terms.",
  },
  {
    title: "Ending the relationship",
    body: "You can stop using Scrapeverse at any time. If you want your account and data removed, contact us and we'll delete it.",
  },
  {
    title: "Open source license",
    body: "The Scrapeverse code itself is open source under the MIT License, found in the project repository. These terms cover your use of the hosted service, not the source code.",
  },
  {
    title: "Contact",
    body: "Questions about these terms? Reach out to us at varunchakraborty9526@outlook.com and we'll be happy to help.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: September 3, 2026
      </p>
      <p className="mt-6 text-muted-foreground">
        These terms, in plain English, cover your use of the Scrapeverse website
        and service.
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
