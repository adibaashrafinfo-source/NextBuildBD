import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade-up on scroll (y: 16px -> 0, 0.5s) per spec §1.2.
 * <MotionConfig reducedMotion="user"> in App drops the movement for users
 * who prefer reduced motion.
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
  const Comp = as === "li" ? m.li : m.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </Comp>
  );
}
