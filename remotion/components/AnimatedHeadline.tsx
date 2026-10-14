import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, EASE, FONTS, SPRINGS } from "../theme";
import { prog, springAt } from "../anim";

export type HeadlineLine = {
  text: string;
  /** Paints the whole line in brand orange. */
  accent?: boolean;
  /** Paints individual words (0-indexed) in brand orange. */
  accentWords?: readonly number[];
};

export type AnimatedHeadlineProps = {
  lines: readonly HeadlineLine[];
  /** Frame each line starts, relative to the sequence. */
  lineDelays: readonly number[];
  fontSize?: number;
  lineHeight?: number;
  weight?: number;
  letterSpacing?: string;
  align?: "left" | "center";
  color?: string;
  style?: CSSProperties;
  /** Frames between consecutive words inside a line. */
  wordStagger?: number;
  /** Draws a brand-orange sweep under the accented line. */
  /** Brand-orange sweep under one line. `width` is the bar length in px. */
  accentSweep?: { line: number; delay: number; duration?: number; width: number };
};

/**
 * Word-by-word masked reveal: each word rises out of its own clipping box with
 * a controlled opacity and scale settle. No bounce, no character jitter.
 */
export const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  lines,
  lineDelays,
  fontSize = 104,
  lineHeight = 1.06,
  weight = 800,
  letterSpacing = "-0.022em",
  align = "left",
  color = COLORS.ink,
  style,
  wordStagger = 3.2,
  accentSweep,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        fontFamily: FONTS.display,
        fontSize,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.text.split(" ");
        const base = lineDelays[lineIndex] ?? 0;
        const sweepActive = accentSweep && accentSweep.line === lineIndex;
        const sweepP = sweepActive
          ? prog(frame, accentSweep.delay, accentSweep.duration ?? 26, EASE.inOut)
          : 0;

        return (
          <div
            key={lineIndex}
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: `0 ${fontSize * 0.26}px`,
              justifyContent: align === "center" ? "center" : "flex-start",
            }}
          >
            {words.map((word, wordIndex) => {
              const delay = base + wordIndex * wordStagger;
              const s = springAt({
                frame,
                fps,
                delay,
                config: SPRINGS.entrance,
              });
              const isAccent =
                line.accent || (line.accentWords?.includes(wordIndex) ?? false);

              return (
                <span
                  key={wordIndex}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    paddingBottom: fontSize * 0.085,
                    marginBottom: -fontSize * 0.085,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      color: isAccent ? COLORS.orange : undefined,
                      transform: `translateY(${(1 - s) * 112}%) scale(${0.985 + s * 0.015})`,
                      opacity: Math.min(1, s * 1.5),
                      willChange: "transform",
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}

            {sweepActive ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -fontSize * 0.1,
                  height: Math.max(4, fontSize * 0.055),
                  width: sweepP * accentSweep.width,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.orange} 0%, ${COLORS.orangeSoft} 100%)`,
                  boxShadow: "0 6px 18px -6px rgba(241,89,34,0.55)",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** Single masked line of smaller supporting type. */
export const MaskedLine: React.FC<{
  children: string;
  delay: number;
  fontSize?: number;
  weight?: number;
  color?: string;
  letterSpacing?: string;
  fontFamily?: string;
  style?: CSSProperties;
}> = ({
  children,
  delay,
  fontSize = 34,
  weight = 500,
  color = COLORS.muted,
  letterSpacing = "0.02em",
  fontFamily = FONTS.body,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt({ frame, fps, delay, config: SPRINGS.soft });

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        paddingBottom: fontSize * 0.3,
        marginBottom: -fontSize * 0.3,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight: weight,
          color,
          letterSpacing,
          transform: `translateY(${(1 - s) * 108}%)`,
          opacity: Math.min(1, s * 1.6),
        }}
      >
        {children}
      </span>
    </span>
  );
};
