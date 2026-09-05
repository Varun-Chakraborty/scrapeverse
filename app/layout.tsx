import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { ConsentProvider } from "@/lib/consent-context";
import { ConsentGate } from "@/components/consent/consent-gate";
import {
  ThemeProvider,
  ThemeInitScript,
} from "@/components/theme/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrapeverse — Open Source Opportunity Finder",
  description:
    "Discover open-source projects that match your interests, skill level, and contribution goals. Get personalized recommendations in under 30 seconds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        jakarta.variable,
        "font-sans",
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: ThemeInitScript }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <ConsentProvider>
              {children}
              <ConsentGate />
            </ConsentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
