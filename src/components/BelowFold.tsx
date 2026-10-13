import { useEffect, useRef, useState } from "react";
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
import { SmoothScroll } from "@/components/shared/SmoothScroll";

/**
 * Main-content sections after the hero, split into its own chunk so the first paint
 * only parses Header + Hero. Sections render in spec order (§3).
 */
export default function BelowFold() {
  // Mount in two batches: the next few sections right away, the rest once the main thread is idle.
  // This keeps the initial render's long tasks short (better TBT on low-end phones).
  const [full, setFull] = useState(false);
  const pendingHash = useRef<string | null>(decodeURIComponent(window.location.hash.slice(1)) || null);

  useEffect(() => {
    if (full) return;
    const go = () => setFull(true);
    const id =
      "requestIdleCallback" in window ? window.requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 600);
    // A click on an in-page link whose target isn't mounted yet: mount everything, then scroll there.
    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement | null)?.closest("a")?.getAttribute("href");
      if (!href?.startsWith("#") || document.getElementById(href.slice(1))) return;
      e.preventDefault();
      pendingHash.current = href.slice(1);
      go();
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [full]);

  // Deep links (/#enroll) and early clicks: scroll once the target exists.
  useEffect(() => {
    if (!full || !pendingHash.current) return;
    const el = document.getElementById(pendingHash.current);
    pendingHash.current = null;
    if (!el) return;
    // content-visibility sections settle to real heights as they render: re-align for a few frames,
    // and once more after web fonts reflow the page.
    const align = (frames = 8) => {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" });
      if (frames > 0) requestAnimationFrame(() => align(frames - 1));
    };
    align();
    document.fonts?.ready.then(() => align());
  }, [full]);

  return (
    // framer-motion lives in this chunk only; reducedMotion="user" honours prefers-reduced-motion.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <Audience />
        <Curriculum />
        <Tools />
        {full ? (
          <>
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
          </>
        ) : (
          <div className="min-h-[200vh]" aria-hidden />
        )}
      </MotionConfig>
    </LazyMotion>
  );
}
