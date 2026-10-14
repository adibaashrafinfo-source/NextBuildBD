# Abrar IT — 30-Second Website Design & Development Promo

A bespoke, frame-accurate motion-graphics film built with **Remotion**. It lives
alongside the existing Vite landing page and shares nothing with it except the
`public/` folder, so the site build is untouched.

| | |
|---|---|
| Composition id | `AbrarITPromo` |
| Resolution | 1920 × 1080 (16:9) |
| Frame rate | 30 fps |
| Duration | **954 frames = 31.8 s** — the length of the voice-over |
| Codec | H.264 MP4, yuv420p, CRF 16 |
| Audio | AAC, muxed from `public/voiceover.mp3` |
| Output | `out/abrar-it-promo-voiceover.mp4` |

A silent master is still one flag away: `npm run video:render:silent` renders the
same composition with `--muted`, producing a video with no audio track.

---

## 1. Commands

```bash
npm install            # once

npm run video:studio          # interactive preview — timeline, scrubber, waveform
npm run video:render          # out/abrar-it-promo-voiceover.mp4  (with audio)
npm run video:render:silent   # out/abrar-it-promo-silent.mp4     (no audio track)
npm run video:still    # single frame to out/frame.png (add --frame=123)
npm run video:typecheck
```

On a headless Linux box without a GPU, point Remotion at a Chrome you already
have instead of letting it download one:

```bash
npx remotion render AbrarITPromo out/abrar-it-promo-voiceover.mp4 \
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
| 1 · Hook | 0 – 3.30 | 0 – 99 | Orange swash sweeps in → browser materialises → `YOUR BUSINESS DESERVES / A PROFESSIONAL WEBSITE` + cursor click |
| 2 · Opportunity | 3.30 – 8.67 | 99 – 260 | Camera lands on the business site → `BUILD TRUST. / CREATE OPPORTUNITIES.` + glass panels → orange light sweep |
| 3 · Showcase | 8.67 – 17.44 | 260 – 523 | Corporate site scrolls with live UI interactions → splits into desktop / tablet / phone → `MODERN UI/UX`, `RESPONSIVE DESIGN`, `FAST PERFORMANCE` |
| 4 · Solutions | 17.44 – 23.59 | 523 – 708 | Three glass panels → `BUSINESS WEBSITES`, `E-COMMERCE STORES`, `CUSTOM WEB SOLUTIONS` |
| 5 · Brand & CTA | 23.59 – 31.80 | 708 – 954 | Logo mask reveal → `LET'S BUILD YOUR WEBSITE` → orange CTA with `www.abrarit.com` → tagline → WhatsApp button → hold |

Every boundary sits at the midpoint of a measured pause between spoken
sentences, so no cut lands inside a sentence.

### Re-cutting scenes

```ts
// remotion/timeline.ts
export const SCENES = {
  hook:        { start: 0,     end: 3.3 },
  opportunity: { start: 3.3,   end: 8.67 },
  showcase:    { start: 8.67,  end: 17.44 },
  solutions:   { start: 17.44, end: 23.59 },
  brand:       { start: 23.59, end: 31.8 },
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
  whiteWipe:  0.0,   // = 23.59s absolute
  logoIn:     0.31,  // = 23.90s  ← measured phrase onset
  headline:   1.3,   // = 24.89s
  whatsapp:   2.6,   // = 26.19s
  ctaButton:  3.4,   // = 26.99s
  ctaLabel:   3.99,  // = 27.58s  ← measured phrase onset
  logoAccent: 6.01,  // = 29.60s  ← measured phrase onset
  tagline:    6.83,  // = 30.42s  ← measured phrase onset
  hold:       7.4,   // = 30.99s
};
```

To land the logo on a specific word of your narration: take the word's absolute
timestamp, subtract the scene's `start`, put the result in the beat. Everything
driven by that beat (the mask wipe, the settle spring, the orange edge) moves
together.

---

## 4. How the cut is synced to the voice-over

`public/voiceover.mp3` (31.791 s) is mounted on the composition:

```tsx
// remotion/AbrarITPromo.tsx
<Audio src={staticFile("voiceover.mp3")} />
```

Remotion muxes it into the MP4 during the render, so no separate ffmpeg step is
needed.

### Where the timings came from

`remotion/audioMarkers.ts` holds measurements, not guesses. The file was decoded
to 16 kHz mono PCM and the RMS of every 20 ms frame computed; a frame counts as
speech above −34 dBFS relative to the track peak, gaps under 140 ms are bridged
and blips under 100 ms dropped. That yields **15 speech phrases** and **4 pauses
of 0.4 s or longer** — the sentence breaks at **3.30 s, 8.67 s, 17.44 s and
23.59 s**, which is exactly where the scene boundaries now sit.

Inside each scene, the headline and label reveals are pinned to phrase onsets.
The three feature labels in scene 3 land on three consecutive phrases of near
identical length (1.66 s / 1.70 s / 1.30 s at 12.10 s, 14.06 s and 15.90 s) —
the signature of a spoken three-item list.

### What is measured and what is inferred

Measured: every phrase boundary, every pause, the track length.

Inferred: **which words are in which phrase.** The audio was not transcribed —
`huggingface.co` is blocked in this environment, so no speech-to-text model
could be downloaded. The mapping of storyboard copy onto phrases comes from the
storyboard structure matching the measured phrase structure, which it does
closely, but it has not been verified against the script.

To make it exact, open the script used to generate the voice-over, find the
timestamp of the word a reveal should land on, subtract that scene's `start`,
and put the result in the corresponding `BEATS` entry.

### Swapping in a different voice-over

1. Replace `public/voiceover.mp3`.
2. Re-measure the phrases (the method is documented at the top of
   `remotion/audioMarkers.ts`) and update `PHRASES` / `SENTENCE_BREAKS`.
3. Set `TOTAL_SECONDS` to the new length and move the `SCENES` boundaries onto
   the new sentence breaks.
4. Nudge `BEATS` onto the new phrase onsets.

### Scrubbing against the waveform

`npm run video:studio` shows the audio waveform under the frame timeline. Drag
the playhead to a word, read the frame number, divide by 30 for seconds,
subtract the scene `start`, and that is the beat value.

### Rendering a silent master

```bash
npm run video:render:silent     # same composition, --muted, no audio stream
```

Or remove the `<Audio>` line from `remotion/AbrarITPromo.tsx`; nothing else
depends on the audio file existing.

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
  audioMarkers.ts             measured speech phrases from the voice-over
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
  voiceover.mp3               the narration the cut is synced to
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
