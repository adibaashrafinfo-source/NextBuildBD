import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { EASE } from "../theme";

/**
 * A deterministic stand-in for a real browser scroll.
 *
 * <ScrollPage> translates its content by `scroll`; <Reveal> children measure
 * where they sit on the page and fade/rise into view as that position crosses
 * the bottom of the viewport — exactly the behaviour of a real site's
 * scroll-triggered entrances, but a pure function of (scroll, layout), so every
 * frame renders identically.
 */
type Ctx = {
  scroll: number;
  viewH: number;
  container: RefObject<HTMLDivElement | null>;
};

const ScrollCtx = createContext<Ctx | null>(null);

const pageTop = (el: HTMLElement, root: HTMLElement) => {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
};

export const ScrollPage: React.FC<{
  scroll: number;
  viewH: number;
  width: number;
  children: ReactNode;
}> = ({ scroll, viewH, width, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollCtx.Provider value={{ scroll, viewH, container: ref }}>
      <div
        ref={ref}
        style={{
          position: "relative",
          width,
          transform: `translate3d(0, ${-scroll}px, 0)`,
        }}
      >
        {children}
      </div>
    </ScrollCtx.Provider>
  );
};

export const Reveal: React.FC<{
  children: ReactNode;
  /** Extra px the element must travel into the viewport before it starts. */
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  /** Fraction of the viewport height over which the entrance plays. */
  span?: number;
  style?: CSSProperties;
}> = ({ children, delay = 0, y = 44, x = 0, scale = 1, span = 0.16, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(ScrollCtx);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !ctx?.container.current) {
      return;
    }
    const top = pageTop(el, ctx.container.current);
    const raw = (ctx.scroll + ctx.viewH * 0.96 - top - delay) / (ctx.viewH * span);
    const p = Math.max(0, Math.min(1, raw));
    const e = EASE.out(p);
    el.style.opacity = String(e);
    el.style.transform = `translate3d(${(1 - e) * x}px, ${(1 - e) * y}px, 0) scale(${scale + (1 - scale) * e})`;
  });

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};
