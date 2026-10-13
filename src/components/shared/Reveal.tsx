import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// The de-blur is the priciest part (filter paint), so only large screens get it.
const WIDE = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
const HIDDEN = WIDE ? { opacity: 0, y: 28, scale: 0.985, filter: "blur(6px)" } : { opacity: 0, y: 28, scale: 0.985 };
const SHOWN = WIDE ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 1, y: 0, scale: 1 };

/**
 * Premium scroll reveal: fade + rise (+ de-blur on desktop) with an expo-out ease.
 * Reduced-motion users get a plain, quick fade.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? m.li : m.div;
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : HIDDEN}
      whileInView={reduce ? { opacity: 1 } : SHOWN}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduce ? { duration: 0.2 } : { duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}
