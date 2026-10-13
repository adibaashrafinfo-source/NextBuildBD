import { useEffect } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Premium scrolling: Lenis inertia smooth-scroll (desktop wheel/trackpad; touch stays native)
 * plus a gradient reading-progress bar. Both are skipped for prefers-reduced-motion.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
    });

    // In-page links: measure on the next frame (a closing mobile menu changes the header height),
    // then glide to an exact pixel position below the sticky header.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(decodeURIComponent(id));
      if (!el) return;
      e.preventDefault();
      // Off-screen sections use content-visibility (estimated heights), so the target can move
      // while we travel; re-measure on arrival and glide the last few pixels.
      const offset = () =>
        el.getBoundingClientRect().top - (document.querySelector("header")?.getBoundingClientRect().height ?? 72) - 8;
      const go = (attempt: number) =>
        lenis.scrollTo(Math.max(0, window.scrollY + offset()), {
          onComplete: () => {
            if (attempt < 4 && Math.abs(offset()) > 2) go(attempt + 1);
          },
        });
      requestAnimationFrame(() => {
        go(0);
        history.replaceState(null, "", `#${id}`);
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reduce]);

  if (reduce) return null;
  return (
    <m.div
      aria-hidden
      style={{ scaleX: progress }}
      className="nb-scroll-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-brand"
    />
  );
}
