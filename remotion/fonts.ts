import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Loads the self-hosted variable fonts (Inter + Manrope, latin subset) before
 * the first frame is captured. Local files only — no network at render time.
 */
const FACES = [
  { family: "Inter", file: "fonts/Inter-Variable.woff2" },
  { family: "Manrope", file: "fonts/Manrope-Variable.woff2" },
];

let started = false;

export const loadBrandFonts = () => {
  if (started || typeof document === "undefined") {
    return;
  }
  started = true;

  const handle = delayRender("Loading Abrar IT brand fonts");

  Promise.all(
    FACES.map(async ({ family, file }) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, {
        weight: "100 900",
        display: "block",
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((err) => {
      // Never hard-fail a render over a font; fall back to the system stack.
      console.warn("Brand font load failed, falling back to system fonts.", err);
    })
    .finally(() => continueRender(handle));
};
