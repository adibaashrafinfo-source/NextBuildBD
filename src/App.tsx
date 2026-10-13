import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsAppFab } from "@/components/WhatsAppFab";

// Sections 4–16 + sticky bar (see BelowFold) and the footer load as separate chunks.
const BelowFold = lazy(() => import("@/components/BelowFold"));
const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-bg-elevated focus:px-4 focus:py-3 focus:font-semibold focus:text-text focus:shadow-card"
      >
        মূল কনটেন্টে যান
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Suspense fallback={<div className="min-h-screen" aria-hidden />}>
          <BelowFold />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <WhatsAppFab />
    </>
  );
}
