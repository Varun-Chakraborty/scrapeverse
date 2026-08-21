"use client";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { Testimonials } from "./testimonials";
import { Faq } from "./faq";
import { Cta } from "./cta";
import { Footer } from "./footer";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <Navbar onGetStarted={onGetStarted} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <HowItWorks onGetStarted={onGetStarted} />
        <Testimonials />
        <Faq />
        <Cta onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
