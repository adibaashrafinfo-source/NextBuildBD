import { staticFile } from "remotion";

/**
 * Brand constants and the one piece of owner-supplied configuration in the
 * project: the WhatsApp destination.
 */
export const BRAND = {
  name: "Abrar IT",
  url: "www.abrarit.com",
  tagline: "Your Journey to Digital Excellence",
  /** The original logo asset. Rendered as-is — never recoloured or redrawn. */
  logo: () => staticFile("abrar-it-logo.png"),
  logoAspect: 1249 / 351,
} as const;

/**
 * Click destination for the floating WhatsApp button.
 *
 * Intentionally `null`: no number is invented here. The rendered MP4 shows the
 * button as a visual element either way. Set this to a real wa.me link (e.g.
 * "https://wa.me/8801XXXXXXXXX") and the button becomes clickable in the
 * interactive <Player> preview.
 */
export const WHATSAPP_URL: string | null = null;

/** Copy used on screen. Exactly the storyboard wording — nothing added. */
export const COPY = {
  hook: { line1: "YOUR BUSINESS DESERVES", line2: "A PROFESSIONAL WEBSITE" },
  opportunity: { line1: "BUILD TRUST.", line2: "CREATE OPPORTUNITIES." },
  showcase: {
    labels: ["MODERN UI/UX", "RESPONSIVE DESIGN", "FAST PERFORMANCE"],
  },
  solutions: {
    labels: ["BUSINESS WEBSITES", "E-COMMERCE STORES", "CUSTOM WEB SOLUTIONS"],
  },
  brand: { headline: "LET'S BUILD YOUR WEBSITE" },
} as const;
