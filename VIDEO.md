# Abrar IT — Website Design & Development Promo (v2, বাংলা)

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
| On-screen language | **Bangla** (Anek Bangla + Noto Sans Bengali) |
| Output | `out/abrar-it-promo-v2.mp4` |

A silent master is still one flag away: `npm run video:render:silent`.

---

## 1. Commands

```bash
npm install            # once

npm run video:studio          # interactive preview — timeline, scrubber, waveform
npm run video:render          # out/abrar-it-promo-v2.mp4  (with audio)
npm run video:render:silent   # out/abrar-it-promo-silent.mp4     (no audio track)
npm run video:still    # single frame to out/frame.png (add --frame=123)
npm run video:typecheck
```

On a headless Linux box without a GPU, point Remotion at a Chrome you already
have instead of letting it download one:

```bash
npx remotion render AbrarITPromo out/abrar-it-promo-v2.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`remotion.config.ts` already pins the codec, CRF, pixel format and the `swangle`
software renderer (needed for the blur / backdrop-filter work).

---

## 2. Brand and design language

| Token | Value | Notes |
|---|---|---|
| White | `#FFFFFF` | |
| Mist | `#F3F2EE` / `#E9E7E1` | warm gray ground |
| **Brand orange** | `#F15922` | **sampled from the logo PNG itself**, not approximated |
| Ember / Soft / Peach | `#C93E0F` / `#FF8A5C` / `#FFEDE5` | gradient shadow, highlight, tint |
| Ink | `#0F0F0F` | |
| WhatsApp green | `#25D366` | used *only* on the WhatsApp button |

**Type.** Anek Bangla (display — carries Bangla and Latin), Noto Sans Bengali
(the interface type inside the website mockups), Manrope (URL and wordmarks).
All three are self-hosted variable woff2 in `public/fonts/`, so nothing is
fetched at render time. Bangla gets **no letter-spacing** — it breaks the joined
letterforms — and text is split into words only on spaces, never inside a word,
so conjuncts (প্র, ব্য, স্ট, র্স…) always shape correctly.

**The logo** at `public/abrar-it-logo.png` is drawn as-is through `<Img>` with
its aspect ratio locked (1249 × 351). It is never recoloured, filtered or
redrawn; the masked entrance animates a mask *over* the untouched image.

**What changed in v2.** The first version showed grey skeleton bars where
content should be, which read as wireframes. v2 shows real, finished websites:

* **Realistic mockups.** A property-developer site (`site/CorporateSite.tsx`),
  a lifestyle store (`site/ShopSite.tsx`) and a business dashboard
  (`site/DashboardApp.tsx`), with real Bangla copy, SVG illustrations
  (`art/Building.tsx`, `art/Products.tsx`) and `lucide-react` icons.
* **Genuinely responsive.** `CorporateSite` takes a `width` and reflows for
  desktop / tablet / phone, so dragging the browser window narrower in scene 3
  re-lays the page out live, exactly as a real site would.
* **Real behaviour.** Sticky header that gains a shadow on scroll, scroll-driven
  section reveals (`site/scroll.tsx`), hover states, a loading bar, add-to-cart
  with a toast and a badge that increments, counters that count up, a chart that
  draws itself.
* **Realistic devices.** Browser window with tabs and an address bar, laptop,
  tablet and phone with bezels, camera, dynamic island, status bar and glare.
* **Cinematic camera and cuts.** Slow pushes, a camera that moves window to
  window in scene 4, and an orange swash (`components/SceneWipe.tsx`) that joins
  the scenes.

**Mock content.** The three demo sites are fictional (Urban Nest, Lumi, Biz Hub).
The dashboard shows illustrative sample figures and the shop shows sample
prices; none of it is a claim about Abrar IT, and it can be removed by editing
`site/DashboardApp.tsx` and `art/Products.tsx`.

---

## 3. Timeline

Every timing lives in **`remotion/timeline.ts`**. Nothing else hard-codes a frame
number.

| Scene | Seconds | Frames | Narration | On screen |
|---|---|---|---|---|
| 1 · প্রশ্ন | 0 – 3.30 | 0 – 99 | "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?" | The question lands word by word; a browser opens on an honest 404 and a click does nothing |
| 2 · ক্ষতি | 3.30 – 8.67 | 99 – 260 | "…প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস ও নতুন ব্যবসার সুযোগ!" | A customer asks for the website in a chat, gets no answer, and leaves |
| 3 · সমাধান | 8.67 – 17.44 | 260 – 523 | "Abrar IT দিচ্ছে আধুনিক, দ্রুতগতির ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট…" | A site loads, scrolls and reacts; the window is dragged narrow and reflows into a phone; desktop, tablet and phone stand together |
| 4 · সলিউশন | 17.44 – 23.59 | 523 – 708 | "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর— …ওয়েব সলিউশন।" | Three live sites; the camera visits each, adds to a cart, counts up a dashboard, then pulls back |
| 5 · যোগাযোগ | 23.59 – 31.80 | 708 – 954 | "…আজই যোগাযোগ করুন · 01719686459 · Abrar IT · Your Journey…" | Logo, CTA, spoken number beside the WhatsApp button, tagline; holds to the end |

Every cut sits in a measured pause of the narration (~0.5 s) and the orange
swash plays inside that pause, so no cut lands mid-sentence.

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

`CUES` in `remotion/timeline.ts` holds every on-screen event in **absolute
seconds** — the same clock as the audio file — each annotated with the spoken
word it is pinned to:

```ts
CUES.showcase = {
  logo:     8.92,   // "Abrar IT"
  modern:   10.38,  // "আধুনিক"
  fast:     11.12,  // "দ্রুতগতির"
  mobile:   12.1,   // "মোবাইল-ফ্রেন্ডলি"  → the window starts being dragged narrow
  ...
};
```

Scenes convert these with `rel(scene, seconds)`, so changing one number moves
the reveal and everything attached to it. Word-by-word headlines take an array
of start times, one per word:

```ts
line1: [4.06, 4.56],   // প্রতিদিন · হারাচ্ছেন
```

To land something on a specific word of your narration, put that word's
timestamp in the matching cue. Everything driven by it (the mask wipe, the
settle spring, the orange edge) moves together.

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

Mapped from the supplied script: which words fall in which phrase. The script
is recorded per phrase in `audioMarkers.ts`, and phrase length corroborates it —
phrase 5 is 0.60 s for the single word "আধুনিক", phrase 6 is 0.80 s for
"দ্রুতগতির", phrase 13 is 1.68 s (the time it takes to read a phone number
aloud) and phrase 14 is 0.68 s for "Abrar IT".

Estimated: the time of each *individual word inside* a long phrase (for
example where "প্রফেশনাল" starts within phrase 1). These come from syllable
counts, accurate to roughly a tenth of a second. The audio was not transcribed
with word timestamps — `huggingface.co` is blocked in the build environment —
so if a word looks early or late, nudge its number in `CUES`.

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

## 4b. The Reels cut (9:16)

`AbrarITReel` is the same film rebuilt for a tall 1080 × 1920 frame — Instagram
and Facebook Reels, YouTube Shorts, Stories.

```bash
npm run video:reel      # out/abrar-it-reel-9x16.mp4
```

It is a re-layout, not a crop. The same narration, the same cue sheet
(`CUES` in `remotion/timeline.ts`) and the same components drive it, so a retimed
word moves in both cuts; only the arrangement changes (`remotion/reel/`):

* text sits above or below the devices instead of beside them;
* in scene 3 the browser window is 1440 × 1080 so it is exactly as tall as the
  phone it turns into, and the final shot stacks the desktop above a
  tablet and phone that overlap it;
* in scene 4 the camera pans across three windows with the neighbours peeking in;
* in scene 5 the logo, headline, call to action, spoken number and tagline are
  one centred column.

Everything that matters stays inside the platforms' safe area (`reel/layout.ts`):
about 250 px clear at the top, 350 px at the bottom and 120 px on the right, where
the app draws its own interface.

---

## 5. Project structure

```
remotion.config.ts            render settings (codec, CRF, GL renderer)
tsconfig.remotion.json        type-checking for the video only

remotion/
  index.ts  Root.tsx          registerRoot, <Composition> 1920x1080 @30fps
  AbrarITPromo.tsx            scenes + <Audio> + the swash transitions
  timeline.ts                 ◀ SCENES and CUES: ALL TIMINGS LIVE HERE
  audioMarkers.ts             measured speech phrases + the script per phrase
  theme.ts  brand.ts          colours/fonts/easings; Bangla copy, phone, URL
  fonts.ts                    local woff2 loader (Anek Bangla, Noto Sans Bengali…)
  anim.ts  ribbonGeometry.ts  prog / kf / springAt helpers; ribbon maths

  scenes/                     Scene01Hook … Scene05BrandCTA   (16:9)
  reel/                       AbrarITReel + ReelScene01 … 05 (9:16), layout.ts
  components/
    AnimatedHeadline.tsx      Bangla word-by-word masked reveal
    WebsiteBrowserMockup.tsx  browser chrome + page viewport
    ResponsiveDeviceShowcase  desktop + tablet + phone, one site, three widths
    WebsiteSolutionPanel.tsx  a window under the scene-4 camera
    LiquidGlassCard.tsx       frosted surface + GlassLabel
    LogoReveal.tsx            masked entrance over the untouched PNG
    AnimatedOrangeRibbon.tsx  logo-inspired swash that draws itself on
    SceneWipe.tsx             the orange swash between scenes
    Cursor.tsx                pointer path, press and click ripple
    FinalBrandCTA.tsx  WhatsAppFloatingButton.tsx  BackgroundCanvas.tsx
  devices/Frames.tsx          Laptop, Tablet, Phone
  site/                       CorporateSite, ShopSite, DashboardApp, ScenePages,
                              scroll.tsx (scroll + reveal engine), ui.tsx, format.ts
  art/                        Building.tsx, Products.tsx (SVG illustrations)

public/
  abrar-it-logo.png           the supplied original logo
  voiceover.mp3               the narration the cut is synced to
  fonts/                      AnekBangla-*, NotoSansBengali-*, Manrope, Inter
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

All on-screen text is Bangla and follows the narration phrase by phrase (see
`COPY` in `remotion/brand.ts`). Two things stay in English on purpose: the
tagline "Your Journey to Digital Excellence" (it is part of the logo lock-up and
is spoken in English) and the URL `www.abrarit.com`.

The film makes no claims about Abrar IT: no testimonials, ratings, statistics or
invented offers. The three demo websites are fictional and use realistic Bangla
copy; the dashboard and shop show sample figures and prices that belong to those
fictional products, not to Abrar IT.
