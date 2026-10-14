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
 * Contact number supplied by the owner and read aloud in the voice-over at
 * 27.58s. Shown on screen beside the WhatsApp button at that moment.
 */
export const PHONE = "01719686459";

/**
 * Click destination for the floating WhatsApp button, built from PHONE in
 * international form. Only meaningful in the interactive <Player> preview —
 * an MP4 carries no links. Set to null to render the button without a target.
 */
export const WHATSAPP_URL: string | null = `https://wa.me/88${PHONE}`;

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
