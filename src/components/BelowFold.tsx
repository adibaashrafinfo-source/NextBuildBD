import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { Audience } from "@/components/Audience";
import { Curriculum } from "@/components/Curriculum";
import { Tools } from "@/components/Tools";
import { Facilities } from "@/components/Facilities";
import { Outcome } from "@/components/Outcome";
import { CostSection } from "@/components/CostSection";
import { Process } from "@/components/Process";
import { LiveClass } from "@/components/LiveClass";
import { Pricing } from "@/components/Pricing";
import { Instructor } from "@/components/Instructor";
import { Faq } from "@/components/Faq";
import { Enroll } from "@/components/Enroll";
import { FinalCta } from "@/components/FinalCta";
import { StickyEnrollBar } from "@/components/StickyEnrollBar";

/**
 * Main-content sections after the hero, split into its own chunk so the first paint
 * only parses Header + Hero. Sections render in spec order (§3).
 */
export default function BelowFold() {
  // Deep links like /#enroll: the target didn't exist when the browser tried to scroll.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    el.scrollIntoView();
    // Web fonts swap in afterwards and reflow the page; re-align once they're ready.
    document.fonts?.ready.then(() => el.scrollIntoView());
  }, []);

  return (
    // framer-motion lives in this chunk only; reducedMotion="user" honours prefers-reduced-motion.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Audience />
        <Curriculum />
        <Tools />
        <Facilities />
        <Outcome />
        <CostSection />
        <Process />
        <LiveClass />
        <Pricing />
        <Instructor />
        <Faq />
        <Enroll />
        <FinalCta />
        <StickyEnrollBar />
      </MotionConfig>
    </LazyMotion>
  );
}
