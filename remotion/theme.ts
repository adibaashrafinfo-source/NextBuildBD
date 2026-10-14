import { Easing } from "remotion";

/**
 * Brand tokens for the Abrar IT promo.
 *
 * `orange` is sampled directly from public/abrar-it-logo.png (the dominant
 * stroke colour of the logo swash), so on-screen accents match the asset
 * exactly rather than approximately.
 */
export const COLORS = {
  white: "#FFFFFF",
  orange: "#F15922",
  orangeDeep: "#D2460F",
  orangeSoft: "#FF8A5C",
  ink: "#111111",
  inkSoft: "#2A2A28",
  warmGray: "#F5F5F3",
  warmGrayDeep: "#E9E8E3",
  muted: "#8A8A83",
  line: "#E4E3DE",
  whatsapp: "#25D366",
  whatsappDeep: "#12924A",
} as const;

export const FONTS = {
  display: "'Manrope', 'Inter', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

/** Cinematic easings — slow out, confident settle. No bounce. */
export const EASE = {
  /** Default scene/element entrance. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Softer, for long camera moves. */
  camera: Easing.bezier(0.25, 0.8, 0.25, 1),
  /** Symmetrical, for sweeps and wipes. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Quick snap for UI micro-interactions. */
  snap: Easing.bezier(0.2, 0.9, 0.2, 1),
} as const;

/** Spring presets used across the scenes. */
export const SPRINGS = {
  entrance: { damping: 200, stiffness: 110, mass: 0.9 },
  soft: { damping: 200, stiffness: 70, mass: 1.1 },
  pop: { damping: 180, stiffness: 180, mass: 0.7 },
} as const;

export const SHADOWS = {
  card: "0 24px 60px -24px rgba(17,17,17,0.22), 0 4px 14px -6px rgba(17,17,17,0.08)",
  float:
    "0 60px 120px -40px rgba(17,17,17,0.30), 0 18px 48px -24px rgba(17,17,17,0.14)",
  glass:
    "0 30px 70px -28px rgba(17,17,17,0.20), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -26px 48px -34px rgba(241,89,34,0.38)",
  button:
    "0 18px 36px -12px rgba(241,89,34,0.50), 0 6px 14px -6px rgba(241,89,34,0.32), inset 0 1px 0 rgba(255,255,255,0.35)",
} as const;

/** Standard 16:9 safe margin for 1920x1080. */
export const SAFE = 110;
