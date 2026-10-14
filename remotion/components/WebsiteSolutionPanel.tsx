import type { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, EASE, FONTS, SPRINGS } from "../theme";
import { osc, prog, springAt } from "../anim";
import { LiquidGlassCard } from "./LiquidGlassCard";

export type PanelEntrance = "rise" | "zoom" | "swing";

export type WebsiteSolutionPanelProps = {
  width: number;
  height: number;
  /** Mockup page to display inside the panel. */
  children: ReactNode;
  /** Design width of `children`; content is scaled to fit the panel. */
  contentWidth: number;
  /** Scroll offset applied to the mockup, in content-space px. */
  scroll?: number;
  label: string;
  /** Frame the panel enters. */
  delay: number;
  /** Frame the caption reveals. */
  labelDelay: number;
  /** Frame the panels settle into their final aligned row. */
  alignDelay: number;
  entrance?: PanelEntrance;
  /** Resting rotation of the panel in the aligned composition. */
  restRotateY?: number;
  /** Phase offset for the idle float and glass sheen. */
  phase?: number;
  /** Frame the orange reflection sweeps across. */
  sweepDelay?: number;
};

/**
 * One of the three floating glass panels in the "multiple web solutions"
 * composition: a mini site under glass with a caption beneath it.
 */
export const WebsiteSolutionPanel: React.FC<WebsiteSolutionPanelProps> = ({
  width,
  height,
  children,
  contentWidth,
  scroll = 0,
  label,
  delay,
  labelDelay,
  alignDelay,
  entrance = "rise",
  restRotateY = 0,
  phase = 0,
  sweepDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = springAt({ frame, fps, delay, config: SPRINGS.entrance });
  const align = springAt({ frame, fps, delay: alignDelay, config: SPRINGS.soft });

  // Three distinct entrances that still read as one family of motion.
  const entranceTransforms: Record<PanelEntrance, { y: number; s: number; ry: number; blur: number }> = {
    rise: { y: (1 - enter) * 150, s: 0.94 + enter * 0.06, ry: (1 - enter) * -14, blur: (1 - enter) * 10 },
    zoom: { y: (1 - enter) * 40, s: 0.84 + enter * 0.16, ry: (1 - enter) * 8, blur: (1 - enter) * 18 },
    swing: { y: (1 - enter) * 70, s: 0.9 + enter * 0.1, ry: (1 - enter) * 46, blur: (1 - enter) * 12 },
  };
  const e = entranceTransforms[entrance];

  // Panels drift freely, then settle into the clean aligned row.
  const drift = (1 - align) * osc(frame, 150, phase) * 16;
  const driftRot = (1 - align) * osc(frame, 190, phase + 1.1) * 5;
  const idleFloat = align * osc(frame, 230, phase) * 9;

  const rotateY = e.ry + driftRot + restRotateY * align;
  const sweep =
    sweepDelay === undefined ? 0 : prog(frame, sweepDelay + phase * 5, 30, EASE.inOut);

  const labelSpring = springAt({ frame, fps, delay: labelDelay, config: SPRINGS.entrance });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
        transform: `translate3d(0, ${e.y + drift + idleFloat}px, 0) rotateY(${rotateY}deg) scale(${e.s})`,
        transformStyle: "preserve-3d",
        opacity: Math.min(1, enter * 1.4),
        filter: e.blur > 0.4 ? `blur(${e.blur}px)` : undefined,
      }}
    >
      <LiquidGlassCard
        radius={30}
        style={{ width, height, padding: 22 }}
        phase={phase}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 18,
            overflow: "hidden",
            background: COLORS.white,
            boxShadow: "0 18px 44px -28px rgba(17,17,17,0.4), inset 0 0 0 1px rgba(17,17,17,0.06)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: contentWidth,
              transform: `scale(${(width - 44) / contentWidth}) translateY(${-scroll}px)`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>

          {sweep > 0 && sweep < 1 ? (
            <div
              style={{
                position: "absolute",
                top: "-40%",
                bottom: "-40%",
                left: `${-30 + sweep * 150}%`,
                width: "40%",
                transform: "rotate(14deg)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,206,180,0.55) 46%, rgba(255,255,255,0.85) 54%, rgba(255,255,255,0) 100%)",
                filter: "blur(16px)",
                opacity: Math.sin(sweep * Math.PI),
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>
      </LiquidGlassCard>

      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          paddingBottom: 10,
          marginBottom: -10,
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: FONTS.display,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: COLORS.ink,
            transform: `translateY(${(1 - labelSpring) * 118}%)`,
            opacity: Math.min(1, labelSpring * 1.5),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </span>
    </div>
  );
};
