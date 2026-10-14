import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONTS, SHADOWS } from "../theme";

/** Small shared primitives for the website mockups. */

export const Btn: React.FC<{
  children: ReactNode;
  tone?: "primary" | "ghost" | "white" | "ink";
  size?: number;
  /** 0..1 hover progress. */
  hover?: number;
  icon?: ReactNode;
  style?: CSSProperties;
}> = ({ children, tone = "primary", size = 17, hover = 0, icon, style }) => {
  const tones: Record<string, CSSProperties> = {
    primary: {
      background: `linear-gradient(180deg, ${COLORS.orangeSoft} -60%, ${COLORS.orange} 50%, ${COLORS.orangeDeep} 170%)`,
      color: COLORS.white,
      boxShadow: `0 ${10 + hover * 12}px ${22 + hover * 14}px -10px rgba(241,89,34,${0.5 + hover * 0.2}), inset 0 1px 0 rgba(255,255,255,0.35)`,
    },
    ghost: {
      background: hover > 0.5 ? COLORS.mist : "transparent",
      color: COLORS.ink,
      boxShadow: `inset 0 0 0 1.5px ${hover > 0.5 ? COLORS.ink : "#D9D7D0"}`,
    },
    white: {
      background: COLORS.white,
      color: COLORS.ink,
      boxShadow: `0 ${10 + hover * 12}px 24px -12px rgba(15,15,15,${0.35 + hover * 0.15})`,
    },
    ink: {
      background: COLORS.ink,
      color: COLORS.white,
      boxShadow: `0 ${10 + hover * 10}px 22px -12px rgba(15,15,15,0.5)`,
    },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.5,
        padding: `${size * 0.78}px ${size * 1.5}px`,
        borderRadius: 999,
        fontFamily: FONTS.ui,
        fontSize: size,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transform: `translateY(${-hover * 2}px) scale(${1 + hover * 0.025})`,
        ...tones[tone],
        ...style,
      }}
    >
      {children}
      {icon}
    </span>
  );
};

export const Chip: React.FC<{
  children: ReactNode;
  icon?: ReactNode;
  style?: CSSProperties;
  tone?: "peach" | "mist" | "white";
}> = ({ children, icon, style, tone = "peach" }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 16px",
      borderRadius: 999,
      fontFamily: FONTS.ui,
      fontSize: 14,
      fontWeight: 600,
      color: tone === "peach" ? COLORS.orangeDeep : COLORS.inkSoft,
      background: tone === "peach" ? COLORS.peach : tone === "white" ? COLORS.white : COLORS.mist,
      boxShadow: tone === "white" ? SHADOWS.card : undefined,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon}
    {children}
  </span>
);

export const BrandMark: React.FC<{ size?: number; ink?: boolean }> = ({ size = 34, ink = false }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: ink
        ? "linear-gradient(145deg, #3B3937, #0F0F0F)"
        : `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange} 55%, ${COLORS.orangeDeep})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
    }}
  >
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
      <path d="M4 11.2 12 4l8 7.2V20h-5.4v-5.2H9.4V20H4z" fill="#fff" />
    </svg>
  </div>
);
