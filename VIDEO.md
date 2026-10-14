# Abrar IT — 30-Second Website Design & Development Promo

A bespoke, frame-accurate motion-graphics film built with **Remotion**. It lives
alongside the existing Vite landing page and shares nothing with it except the
`public/` folder, so the site build is untouched.

| | |
|---|---|
| Composition id | `AbrarITPromo` |
| Resolution | 1920 × 1080 (16:9) |
| Frame rate | 30 fps |
| Duration | **exactly 900 frames = 30.000 s** |
| Codec | H.264 MP4, yuv420p, CRF 16 |
| Audio | **none** — the render has no audio track at all |
| Output | `out/abrar-it-promo-30s.mp4` |

---

## 1. Commands

```bash
npm install            # once

npm run video:studio   # interactive preview — timeline, scrubber, live edits
npm run video:render   # renders out/abrar-it-promo-30s.mp4
npm run video:still    # single frame to out/frame.png (add --frame=123)
npm run video:typecheck
```

On a headless Linux box without a GPU, point Remotion at a Chrome you already
have instead of letting it download one:

```bash
npx remotion render AbrarITPromo out/abrar-it-promo-30s.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`remotion.config.ts` already pins the codec, CRF, pixel format and the `swangle`
software renderer (needed for the blur / backdrop-filter work).

---

## 2. Brand

| Token | Value | Notes |
|---|---|---|
| White | `#FFFFFF` | |
| **Brand orange** | `#F15922` | **sampled from the logo PNG itself**, not approximated |
| Orange deep | `#D2460F` | shadow side of gradients |
| Orange soft | `#FF8A5C` | highlight side |
| Black | `#111111` | |
| Warm gray | `#F5F5F3` / `#E9E8E3` | |
| WhatsApp green | `#25D366` | used *only* on the WhatsApp button |

Typography: **Manrope** (display) and **Inter** (body), self-hosted as variable
woff2 in `public/fonts/`. Nothing is fetched from the network at render time.

The logo at `public/abrar-it-logo.png` is drawn as-is through `<Img>` with its
aspect ratio locked (1249 × 351). It is never recoloured, filtered or redrawn —
the masked entrance animates a mask *over* the untouched image.

---

## 3. Timeline

Every timing lives in **`remotion/timeline.ts`**. Nothing else hard-codes a frame
number.

| Scene | Seconds | Frames | Content |
|---|---|---|---|
| 1 · Hook | 0 – 5 | 0 – 150 | Orange swash sweeps in → browser materialises → `YOUR BUSINESS DESERVES / A PROFESSIONAL WEBSITE` + cursor click |
| 2 · Opportunity | 5 – 9 | 150 – 270 | Camera lands on the business site → `BUILD TRUST. / CREATE OPPORTUNITIES.` + glass panels → orange light sweep |
| 3 · Showcase | 9 – 17 | 270 – 510 | Corporate site scrolls with live UI interactions → splits into desktop / tablet / phone → `MODERN UI/UX`, `RESPONSIVE DESIGN`, `FAST PERFORMANCE` |
| 4 · Solutions | 17 – 24 | 510 – 720 | Three glass panels → `BUSINESS WEBSITES`, `E-COMMERCE STORES`, `CUSTOM WEB SOLUTIONS` |
| 5 · Brand & CTA | 24 – 30 | 720 – 900 | Logo mask reveal → `LET'S BUILD YOUR WEBSITE` → orange CTA with `www.abrarit.com` → tagline → WhatsApp button → hold |

### Re-cutting scenes

```ts
// remotion/timeline.ts
export const SCENES = {
  hook:        { start: 0,  end: 5 },
  opportunity: { start: 5,  end: 9 },
  showcase:    { start: 9,  end: 17 },
  solutions:   { start: 17, end: 24 },
  brand:       { start: 24, end: 30 },
};
```

Change the seconds, done. Scenes are laid out back to back and each one owns its
in/out animation, so boundaries can move freely as long as they stay ordered.
`TOTAL_SECONDS` drives `durationInFrames`, so changing it to e.g. `32` gives a
960-frame composition with no other edits.

### Re-timing elements inside a scene

`BEATS` holds every element's cue **in seconds relative to its own scene start**:

```ts
BEATS.brand = {
  whiteWipe: 0.0,   // = 24.0s absolute
  logoIn:    0.35,  // = 24.35s
  headline:  1.4,   // = 25.4s
  ctaButton: 2.2,   // = 26.2s
  ctaLabel:  3.0,   // = 27.0s  (www.abrarit.com wipes in)
  tagline:   3.6,   // = 27.6s
  whatsapp:  1.9,   // = 25.9s
  hold:      4.4,   // = 28.4s
};
```

To land the logo on a specific word of your narration: take the word's absolute
timestamp, subtract the scene's `start`, put the result in the beat. Everything
driven by that beat (the mask wipe, the settle spring, the orange edge) moves
together.

---

## 4. Adding your own audio later

The composition is silent on purpose — there is no `<Audio>` anywhere in the
tree, and nothing about rendering depends on an audio file existing.

### Option A — mux the audio in afterwards (recommended, no code changes)

```bash
# Keep the rendered video exactly as-is, attach the narration:
ffmpeg -i out/abrar-it-promo-30s.mp4 -i my-voiceover.mp3 \
  -c:v copy -c:a aac -b:a 192k -shortest \
  out/abrar-it-promo-30s-with-audio.mp4
```

`-shortest` cuts the result at whichever track ends first.

To nudge the narration later by e.g. 0.4s, or trim its head:

```bash
# delay the audio by 400 ms
ffmpeg -i out/abrar-it-promo-30s.mp4 -i my-voiceover.mp3 \
  -filter_complex "[1:a]adelay=400|400[a]" -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k -shortest out/final.mp4

# start the narration 0.8s into the file instead
ffmpeg -i out/abrar-it-promo-30s.mp4 -ss 0.8 -i my-voiceover.mp3 \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/final.mp4
```

### Option B — scrub against the audio inside Remotion Studio

Drop the file in `public/` and add an `<Audio>` to the composition **while you
work**, so the studio timeline shows a waveform to align against:

```tsx
// remotion/AbrarITPromo.tsx
import { Audio, staticFile } from "remotion";
// ...inside <AbsoluteFill>, as the first child:
<Audio src={staticFile("voiceover.mp3")} />
```

Run `npm run video:studio`, scrub, and move the numbers in
`remotion/timeline.ts` until the beats sit on the words. **Remove the `<Audio>`
line before rendering** if you want the silent master back, or leave it in and
Remotion will mux the audio into the MP4 for you.

### If your narration is longer than 30 s

A longer voice-over does not have to be trimmed. Either:

* stretch the film — set `TOTAL_SECONDS` to the audio length (e.g. `31.8`) and
  push the later scene boundaries out to match, so the composition becomes
  `round(31.8 × 30) = 954` frames; or
* keep the 30 s master for ad placements that cap at 30 s and trim the audio
  tail with `-t 30`.

---

## 5. Project structure

```
remotion.config.ts            render settings (codec, CRF, GL renderer)
tsconfig.remotion.json        type-checking for the video only

remotion/
  index.ts                    registerRoot
  Root.tsx                    <Composition> — 1920x1080, 30fps, 900 frames
  AbrarITPromo.tsx            scene assembly
  timeline.ts                 ◀ ALL TIMINGS LIVE HERE
  theme.ts                    colours, fonts, easings, springs, shadows
  brand.ts                    brand copy, logo path, WHATSAPP_URL
  fonts.ts                    local woff2 loader (delayRender-safe)
  anim.ts                     prog / springAt / osc helpers
  ribbonGeometry.ts           tapered calligraphic ribbon maths

  components/
    LogoReveal.tsx            masked entrance over the untouched PNG
    AnimatedOrangeRibbon.tsx  logo-inspired swash that draws itself on
    WebsiteBrowserMockup.tsx  browser chrome + scrollable page viewport
    ResponsiveDeviceShowcase.tsx  TabletFrame / PhoneFrame / DeviceSlot
    LiquidGlassCard.tsx       backdrop-blur glass + sheen (and GlassLabel)
    AnimatedHeadline.tsx      word-by-word mask reveal (and MaskedLine)
    WebsiteSolutionPanel.tsx  glass panel holding a mini site + caption
    WhatsAppFloatingButton.tsx
    FinalBrandCTA.tsx         logo + headline + CTA + tagline lock-up
    BackgroundCanvas.tsx      white / warm-gray ground, vignette, grain
    OrangeParticles.tsx       seeded ambient motes
    LightSweep.tsx            scene-to-scene light bar
    Cursor.tsx                pointer travel + click ripple

  mockups/                    the websites shown on screen, pure CSS/SVG
    CorporateSite.tsx  EcommerceSite.tsx  DashboardApp.tsx
    ResponsiveSite.tsx (TabletSite / MobileSite)  ui.tsx

public/
  abrar-it-logo.png           the supplied original logo
  fonts/Inter-Variable.woff2  fonts/Manrope-Variable.woff2
```

---

## 6. WhatsApp button

`remotion/brand.ts`:

```ts
export const WHATSAPP_URL: string | null = null;
```

No number is invented. In the rendered MP4 the button is a visual element only
(MP4s have no links). Set this to a real `https://wa.me/…` URL and the button
becomes a working link in the interactive `<Player>` preview. It sits at
bottom-right, clear of the logo, CTA and URL, with a float and a pulse ring.

---

## 7. On-screen copy

Only the storyboard wording appears, plus interface labels inside the website
mockups (`Home`, `Our Services`, `Get Started`, `Featured Products`,
`Overview`…). Body copy inside the mockups is rendered as skeleton bars and the
dashboard uses charts with no figures — so the film makes no claims, quotes no
testimonials and shows no ratings or statistics.
