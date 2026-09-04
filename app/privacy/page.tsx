import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Scrapeverse",
  description:
    "How Scrapeverse collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "The short version",
    body: "We collect just enough information to make Scrapeverse work: your GitHub account details made available through GitHub OAuth based on the permissions you grant and your personal preferences. We use it only to give you better recommendations and to secure your account. We do not sell your data.",
  },
  {
    title: "What we collect",
    body: "When you sign in with your GitHub account, we collect your GitHub information made available through GitHub OAuth. We store your GitHub user ID so we can match you back to the same account (and keep you logged in) across visits. We may use your email address to identify existing accounts and prevent duplicate accounts. When you complete the onboarding flow, we store your interests, experience level, contribution goals, and programming languages so we can recommend issues that fit you. When you grant optional consents, we record that consent along with the IP address used at the time. We don't use advertising trackers or analytics services. Our infrastructure providers and application may generate limited technical logs (such as request, error, and security logs) that are used solely to operate, secure, and troubleshoot the service.",
  },
  {
    title: "Rate limiting",
    body: "We may use IP-based rate limiting and abuse-prevention measures to protect the service. Information used for rate limiting is retained only for as long as necessary to enforce those limits.",
  },
  {
    title: "How we use your information",
    body: "We use your account information to identify your account, authenticate you, personalize the service, and communicate with you when necessary. We use your avatar to display your profile. We match your GitHub user ID to your account so you can log in across visits. We use your preferences to rank and recommend open-source issues for you. We may use your email address to identify existing accounts and prevent duplicate accounts. That's it.",
  },
  {
    title: "Cookies and sessions",
    body: "We use a secure session cookie to keep you logged in after you sign in with GitHub. It contains a short-lived token, not your personal details, and expires automatically after a short time.",
  },
  {
    title: "Where your data lives",
    body: "Your account information is stored in our database. We're built to run on Vercel's infrastructure and use a hosted PostgreSQL database. Consent records (which include the IP address used when you granted them) are stored alongside your account.",
  },
  {
    title: "International processing",
    body: "Scrapeverse is built on Vercel's global infrastructure and uses a hosted PostgreSQL database. As a result, your personal information may be processed or stored on servers located in countries other than the one you reside in, including the United States and other regions where our infrastructure providers operate. We take reasonable steps to protect your information wherever it is processed.",
  },
  {
    title: "Sharing",
    body: "We never sell your personal information. We only share data with the services needed to run this site (for example, our infrastructure and database providers), and only to the extent needed to provide the service. These providers process your data on our behalf and are expected to protect it.",
  },
  {
    title: "GitHub authorization",
    body: "Signing in with GitHub is the only way to create an account. When you sign in, GitHub shares with us the information made available through GitHub OAuth based on the permissions you grant. We do not receive or store your GitHub password, and we don't request access to your private repositories.",
  },
  {
    title: "How long we keep it",
    body: "We keep your account and preferences for as long as your account exists. If you decide to delete your account, contact us and we'll remove your data.",
  },
  {
    title: "Security",
    body: "We take reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. These include using HTTPS/encryption in transit, hashing and signing your session tokens, restricting database access, and following secure coding practices. No method of transmission or storage is completely secure, and we cannot guarantee absolute security, but we work to keep your data safe.",
  },
  {
    title: "Your rights",
    body: "You can update your preferences in the app at any time. You may request deletion of your account and associated personal information by contacting us. We will process deletion requests within a reasonable period, subject to any legal obligations requiring retention.",
  },
  {
    title: "Your rights under the DPDP Act (India)",
    body: "If you are a resident of India, the Digital Personal Data Protection Act, 2023 grants you certain rights over your personal data. Where applicable, you may exercise rights to access, correct, and erase your personal data, and to withdraw consent you have previously given. You may also have rights to obtain information about how your data is processed and to grievance redressal. To exercise any of these rights, contact us at varunchakraborty9526@outlook.com. We will respond within the timeframes required by applicable law. You may also be entitled to file a complaint with the Data Protection Board of India if you believe your rights have been violated.",
  },
  {
    title: "Children's privacy",
    body: "Scrapeverse is not intended for children under the age required to consent to data processing under applicable law. If you believe a child has provided us with personal information, please contact us and we will take reasonable steps to remove it.",
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
