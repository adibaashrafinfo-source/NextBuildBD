import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, SHADOWS } from "../theme";
import { osc } from "../anim";

export type LiquidGlassCardProps = {
  children?: ReactNode;
  style?: CSSProperties;
  radius?: number;
  /** Strength of the backdrop blur, px. */
  blur?: number;
  /** 0..1 — how milky the panel is. */
  frost?: number;
  /** Adds the travelling specular highlight. 0 disables. */
  sheen?: number;
  /** Phase offset so stacked panels don't shimmer in lockstep. */
  phase?: number;
  /** Warm orange reflection pooled in a corner. */
  reflection?: boolean;
};

/**
 * Premium liquid-glass surface: real backdrop blur, a crisp 1px light edge,
 * an inner orange reflection and a slow travelling specular sweep.
 */
export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  radius = 28,
  blur = 26,
  frost = 0.62,
  sheen = 1,
  phase = 0,
  reflection = true,
}) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 0.55 + phase * 90) % 260) - 60;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        background: `linear-gradient(135deg, rgba(255,255,255,${0.2 + frost * 0.72}) 0%, rgba(255,255,255,${0.1 + frost * 0.42}) 48%, rgba(255,255,255,${0.16 + frost * 0.56}) 100%)`,
        backdropFilter: `blur(${blur}px) saturate(150%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
        border: "1px solid rgba(255,255,255,0.92)",
        boxShadow: SHADOWS.glass,
        ...style,
      }}
    >
      {reflection ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(70% 80% at 108% 112%, rgba(241,89,34,0.20) 0%, rgba(241,89,34,0) 64%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(60% 60% at -8% -12%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0) 58%)`,
              pointerEvents: "none",
            }}
          />
        </>
      ) : null}

      {sheen > 0 ? (
        <div
          style={{
            position: "absolute",
            top: "-45%",
            bottom: "-45%",
            left: `${sweep}%`,
            width: "26%",
            transform: "rotate(16deg)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0) 100%)",
            opacity: 0.5 * sheen,
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* Inner hairline keeps the glass edge readable against white. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          boxShadow: `inset 0 0 0 1px rgba(17,17,17,0.045)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
          transform: `translateY(${osc(frame, 300, phase) * 1.2}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Small frosted pill used for the floating feature labels. */
export const GlassLabel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  phase?: number;
}> = ({ children, style, phase = 0 }) => (
  <LiquidGlassCard
    radius={999}
    blur={18}
    frost={0.7}
    phase={phase}
    style={{ display: "inline-flex", ...style }}
  >
    <div
      style={{
        padding: "18px 34px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: COLORS.orange,
          boxShadow: `0 0 0 4px rgba(241,89,34,0.18)`,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  </LiquidGlassCard>
);
