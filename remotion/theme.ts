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
  mist: "#F3F2EE",
  mistDeep: "#E9E7E1",
  ink: "#0F0F0F",
  inkSoft: "#2B2A28",
  muted: "#7B7A74",
  line: "#E6E4DE",
  orange: "#F15922",
  orangeDeep: "#C93E0F",
  orangeSoft: "#FF8A5C",
  peach: "#FFEDE5",
  peachDeep: "#FAD3C2",
  whatsapp: "#25D366",
  whatsappDeep: "#12924A",
} as const;

export const FONTS = {
  /** Display type: Anek Bangla carries both Bangla and Latin. */
  display: "'Anek Bangla', 'Manrope', sans-serif",
  /** Interface type inside the website mockups. */
  ui: "'Noto Sans Bengali', 'Inter', sans-serif",
  /** Latin UI details: URLs, wordmarks. */
  latin: "'Manrope', 'Inter', sans-serif",
} as const;

/** Cinematic easings — confident settle, no bounce. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  expo: Easing.bezier(0.19, 1, 0.22, 1),
  camera: Easing.bezier(0.25, 0.8, 0.25, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.4, 0, 0.2, 1),
  snap: Easing.bezier(0.2, 0.9, 0.2, 1),
} as const;

export const SPRINGS = {
  entrance: { damping: 200, stiffness: 110, mass: 0.9 },
  soft: { damping: 200, stiffness: 70, mass: 1.1 },
  pop: { damping: 180, stiffness: 180, mass: 0.7 },
} as const;

export const SHADOWS = {
  window:
    "0 80px 140px -50px rgba(15,15,15,0.38), 0 30px 60px -30px rgba(15,15,15,0.22), 0 0 0 1px rgba(15,15,15,0.06)",
  device:
    "0 70px 120px -44px rgba(15,15,15,0.42), 0 24px 48px -24px rgba(15,15,15,0.24)",
  card: "0 22px 48px -26px rgba(15,15,15,0.24), 0 2px 6px -2px rgba(15,15,15,0.06)",
  chip: "0 18px 40px -18px rgba(15,15,15,0.32), 0 2px 8px -2px rgba(15,15,15,0.08)",
  button:
    "0 22px 44px -16px rgba(241,89,34,0.55), 0 6px 14px -6px rgba(241,89,34,0.36), inset 0 1.5px 0 rgba(255,255,255,0.38)",
} as const;

/** Standard 16:9 safe margin for 1920x1080. */
export const SAFE = 120;
