import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const v = (name: string) => `var(--${name})`;

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px" },
    },
    extend: {
      colors: {
        bg: { DEFAULT: v("bg"), elevated: v("bg-elevated"), soft: v("bg-soft") },
        text: { DEFAULT: v("text"), muted: v("text-muted") },
        border: v("border"),
        input: v("input-border"),
        ring: v("brand"),
        brand: { DEFAULT: v("brand"), strong: v("brand-strong"), soft: v("brand-soft") },
        accent: v("accent"),
        sky: v("sky"),
        lavender: v("lavender"),
        success: v("success"),
        warning: v("warning"),
        danger: v("danger"),
        whatsapp: { DEFAULT: "#11843F", hover: "#0D6F38" }, // WhatsApp green darkened for AA with white text
      },
      backgroundImage: {
        "gradient-brand": v("gradient-brand"),
        "gradient-cta": v("gradient-cta"),
        "gradient-text": v("gradient-text"),
        "hero-glow": v("gradient-hero-glow"),
      },
      boxShadow: {
        card: v("shadow-card"),
        glow: "0 10px 30px -8px var(--brand)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        en: ['"Plus Jakarta Sans"', '"Hind Siliguri"', "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
