import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONTS, SHADOWS } from "../theme";

/**
 * Frosted-glass surface. The blur is deliberately small and only used on small
 * elements — large live backdrop blurs are the single most expensive thing to
 * rasterise in a software-rendered video.
 */
export const LiquidGlassCard: React.FC<{
  children?: ReactNode;
  radius?: number;
  blur?: number;
  style?: CSSProperties;
}> = ({ children, radius = 28, blur = 14, style }) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
      backdropFilter: `blur(${blur}px) saturate(160%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
      border: "1px solid rgba(255,255,255,0.95)",
      boxShadow: `${SHADOWS.chip}, inset 0 1px 0 rgba(255,255,255,1), inset 0 -18px 30px -22px rgba(241,89,34,0.3)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A feature callout: orange icon disc + a Bangla label on glass. */
export const GlassLabel: React.FC<{
  icon: ReactNode;
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
}> = ({ icon, children, size = 34, style }) => (
  <LiquidGlassCard radius={999} style={{ display: "inline-flex", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.42, padding: `${size * 0.3}px ${size * 0.8}px ${size * 0.3}px ${size * 0.3}px`, whiteSpace: "nowrap" }}>
      <span
        style={{
          width: size * 1.5,
          height: size * 1.5,
          borderRadius: 999,
          background: `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange} 60%, ${COLORS.orangeDeep})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 20px -8px rgba(241,89,34,0.7), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {icon}
      </span>
      <span style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: COLORS.ink }}>{children}</span>
    </div>
  </LiquidGlassCard>
);
