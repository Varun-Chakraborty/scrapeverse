import type { Metadata } from "next";
import { LEGAL_VERSIONS } from "@/lib/constants";

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
    body: "Scrapeverse sign-in is available only through GitHub OAuth. When you sign in with GitHub, you authorize us to receive your basic information made available through GitHub OAuth based on the permissions you grant. We don't store your GitHub password.",
  },
  {
    title: "Content from third parties",
    body: "Scrapeverse shows projects, issues, and other content from GitHub and the public open-source community. That content belongs to its original owners. We don't own it, and we're not responsible for what it contains.",
  },
  {
    title: "Acceptable use",
    body: "You may not attempt to interfere with the operation of the service, bypass security measures, automate excessive requests, or use the service in a manner that places an unreasonable burden on our infrastructure.",
  },
  {
    title: "Rate limiting",
    body: "To protect the service and ensure fair use, Scrapeverse may apply rate limits and other usage restrictions. These limits may change over time without notice.",
  },
  {
    title: "No guarantees",
    body: 'We try to keep Scrapeverse accurate and reliable, but we provide it "as is" and "as available" without any warranty. The service may change, have bugs, or be unavailable from time to time. Recommendations are suggestions, not guarantees.',
  },
  {
    title: "Limitation of liability",
    body: "To the maximum extent permitted by law, Scrapeverse and its operators will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the service.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. We'll post changes on this page with an updated date. Continuing to use the service after changes means you accept the new terms.",
  },
  {
    title: "Ending the relationship",
    body: "You can stop using Scrapeverse at any time. You may request deletion of your account and associated personal data by contacting us. We will process deletion requests in accordance with applicable law and our Privacy Policy.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate your access to Scrapeverse, with or without notice, if you violate these terms, abuse the service, or act in a way that endangers the service or other users. If we terminate your access for a breach of these terms, you may lose access to your account and any data associated with it. You can also end your relationship with us at any time by stopping use and requesting deletion of your account and data. The sections of these terms that by their nature should survive termination (including limitation of liability and governing law) will continue to apply.",
  },
  {
    title: "Open source license",
    body: "The Scrapeverse code itself is open source under the MIT License, found in the project repository. These terms cover your use of the hosted service, not the source code.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of India. Any dispute arising out of or relating to these terms or your use of Scrapeverse shall be subject to the exclusive jurisdiction of the courts of India. If any part of these terms is found to be unenforceable, the rest will remain in effect.",
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
        Version {LEGAL_VERSIONS.terms} · Last updated: September 3, 2026
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
