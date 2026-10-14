import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRINGS } from "../theme";
import { springAt } from "../anim";

export type HeadlineWord = {
  text: string;
  /** Frame (relative to the surrounding Sequence) the word starts rising. */
  at: number;
  accent?: boolean;
};

export type AnimatedHeadlineProps = {
  lines: ReadonlyArray<ReadonlyArray<HeadlineWord>>;
  fontSize?: number;
  lineHeight?: number;
  weight?: number;
  color?: string;
  accentColor?: string;
  align?: "left" | "center";
  family?: string;
  /** Space between words, in em. */
  wordGap?: number;
  style?: CSSProperties;
};

/**
 * Builds a headline line from a string, assigning each word the frame it should
 * start on. `accent` lists word indexes (or "all") to paint in the accent colour.
 * Words are split on spaces only — never inside a word — so Bangla conjuncts
 * always shape correctly.
 */
export const line = (
  text: string,
  at: number | ReadonlyArray<number>,
  step = 4,
  accent: ReadonlyArray<number> | "all" = [],
): HeadlineWord[] =>
  text.split(" ").map((w, i) => ({
    text: w,
    at: typeof at === "number" ? at + i * step : (at[i] ?? at[at.length - 1]),
    accent: accent === "all" || accent.includes(i),
  }));

/**
 * Word-by-word masked reveal tuned for Bangla: generous mask padding so
 * matras above the headline and below the baseline are never clipped, no
 * letter-spacing (it breaks joined glyphs), and a calm, bounce-free settle.
 */
export const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  lines,
  fontSize = 88,
  lineHeight = 1.28,
  weight = 800,
  color = COLORS.ink,
  accentColor = COLORS.orange,
  align = "left",
  family = FONTS.display,
  wordGap = 0.27,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        fontFamily: family,
        fontSize,
        fontWeight: weight,
        lineHeight,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: `${wordGap}em`,
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          {words.map((w, wi) => {
            const s = springAt({ frame, fps, delay: w.at, config: SPRINGS.entrance });
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  padding: "0.24em 0.05em 0.32em",
                  margin: "-0.24em -0.05em -0.32em",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    color: w.accent ? accentColor : undefined,
                    transform: `translateY(${(1 - s) * 118}%)`,
                    opacity: Math.min(1, s * 1.8),
                    willChange: "transform",
                  }}
                >
                  {w.text}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
