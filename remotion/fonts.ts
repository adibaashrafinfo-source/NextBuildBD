import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Self-hosted variable fonts, loaded before the first frame is captured.
 *
 *  - Anek Bangla       display type (Bangla + Latin), 300-800
 *  - Noto Sans Bengali UI type inside the website mockups, 300-800
 *  - Manrope / Inter   Latin UI details (URL, brand wordmarks)
 *
 * Bangla and Latin live in separate woff2 files per family, joined by
 * unicode-range so the browser picks the right file per glyph. No network
 * access happens at render time.
 */
type Face = {
  family: string;
  file: string;
  weight: string;
  range?: string;
};

const FACES: Face[] = [
  { family: "Anek Bangla", file: "fonts/AnekBangla-bengali.woff2", weight: "300 800", range: "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1" },
  { family: "Anek Bangla", file: "fonts/AnekBangla-latin.woff2", weight: "300 800", range: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { family: "Noto Sans Bengali", file: "fonts/NotoSansBengali-bengali.woff2", weight: "300 800", range: "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1" },
  { family: "Noto Sans Bengali", file: "fonts/NotoSansBengali-latin.woff2", weight: "300 800", range: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { family: "Manrope", file: "fonts/Manrope-Variable.woff2", weight: "200 800" },
  { family: "Inter", file: "fonts/Inter-Variable.woff2", weight: "100 900" },
];

let started = false;

export const loadBrandFonts = () => {
  if (started || typeof document === "undefined") {
    return;
  }
  started = true;

  const handle = delayRender("Loading Abrar IT brand fonts");

  Promise.all(
    FACES.map(async ({ family, file, weight, range }) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, {
        weight,
        display: "block",
        ...(range ? { unicodeRange: range } : {}),
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
