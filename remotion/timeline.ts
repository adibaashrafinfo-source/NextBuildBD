/**
 * Centralised, editable timeline for the Abrar IT promo.
 *
 * Everything downstream (composition length, <Sequence> placement, per-scene
 * beats) is derived from the numbers in this file, so re-timing the video to a
 * voice-over is a matter of editing seconds here — no component needs touching.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Total runtime in seconds. Matches the voice-over in public/voiceover.mp3
 * (31.791s); 31.8s @ 30fps === 954 frames.
 */
export const TOTAL_SECONDS = 31.8;

/** Seconds -> frames, rounded to the nearest whole frame. */
export const sec = (seconds: number) => Math.round(seconds * FPS);

export const DURATION_IN_FRAMES = sec(TOTAL_SECONDS);

export type SceneSpan = {
  /** Scene start, in seconds from the top of the video. */
  readonly start: number;
  /** Scene end, in seconds from the top of the video. */
  readonly end: number;
};

/**
 * Scene boundaries in seconds.
 *
 * Each one sits at the midpoint of a measured pause in the voice-over (see
 * audioMarkers.ts → SENTENCE_BREAKS), so no cut lands inside a spoken
 * sentence. Scenes are laid out back-to-back and every scene handles its own
 * in/out animation, so boundaries can move freely as long as they stay ordered
 * and end at TOTAL_SECONDS.
 */
export const SCENES = {
  hook: { start: 0, end: 3.3 },
  opportunity: { start: 3.3, end: 8.67 },
  showcase: { start: 8.67, end: 17.44 },
  solutions: { start: 17.44, end: 23.59 },
  brand: { start: 23.59, end: 31.8 },
} as const satisfies Record<string, SceneSpan>;

export type SceneName = keyof typeof SCENES;

/** <Sequence> props for a scene, in frames. */
export const sceneSequence = (name: SceneName) => {
  const { start, end } = SCENES[name];
  return { from: sec(start), durationInFrames: sec(end) - sec(start) };
};

/** Scene length in frames. */
export const sceneFrames = (name: SceneName) =>
  sec(SCENES[name].end) - sec(SCENES[name].start);

/**
 * Per-scene beats, in seconds *relative to the scene start*.
 *
 * These are the hooks you move when syncing to narration: find the word you
 * want an element to land on, convert to "seconds into that scene", done.
 * Beats carrying an absolute time in a comment are pinned to a measured
 * phrase onset from audioMarkers.ts.
 */
export const BEATS = {
  hook: {
    // Sentence: "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?" (0.06-3.04)
    ribbonIn: 0.0,
    browserIn: 0.3,
    headlineLine1: 0.35, // 0.35s — on "আপনার ব্যবসার" (your business)
    ribbonSecond: 0.5,
    headlineLine2: 1.55, // 1.55s — lands before "প্রফেশনাল ওয়েবসাইট" at ~1.9s
    floatingCard: 1.9,
    cursorIn: 2.0,
    cursorClick: 2.6,
    outro: 2.95,
  },
  opportunity: {
    // "তাহলে প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস" (3.56-6.76)
    // "ও নতুন ব্যবসার সুযোগ!" (6.98-8.42)
    siteIn: 0.0,
    headlineLine1: 0.6, // 3.90s — as the "losing trust" clause begins
    glassPanels: 1.1,
    headlineLine2: 3.68, // 6.98s — exactly the "opportunity" clause onset
    accentSweep: 4.76, // 8.06s — the orange sweep hits the word "সুযোগ"
    lightSweep: 4.95,
  },
  showcase: {
    // "Abrar IT দিচ্ছে" (8.92) · "আধুনিক," (10.38) · "দ্রুতগতির" (11.12)
    // "ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট," (12.10) · rest of the sentence to 17.20
    browserIn: 0.0,
    navDraw: 0.25, // 8.92s — on "Abrar IT দিচ্ছে"
    heroIn: 0.5,
    cardsIn: 0.85,
    scrollStart: 1.0,
    hoverCta: 1.45,
    labelUiUx: 1.71, // 10.38s — on "আধুনিক" (modern)
    labelPerformance: 2.45, // 11.12s — on "দ্রুতগতির" (fast)
    scrollEnd: 2.9,
    devicesSplit: 3.43, // 12.10s — devices fan out on "মোবাইল-ফ্রেন্ডলি"
    labelResponsive: 4.15, // 12.82s — still inside "ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট",
    // by which point the devices have fanned out far enough to clear the label
    outro: 8.42,
  },
  solutions: {
    // "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর—" (17.68-20.20)
    // "...স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন।" (20.60-23.28)
    panel1: 0.0,
    label1: 0.26, // 17.70s — on "বিজনেস ওয়েবসাইট"
    panel2: 0.35,
    panel3: 0.7,
    align: 1.5,
    label2: 1.92, // 19.36s — on "ই-কমার্স স্টোর"
    label3: 4.4, // 21.84s — on "স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন"
    reflectionSweep: 3.1,
    outro: 5.78,
  },
  brand: {
    // "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে আজই যোগাযোগ করুন" (23.90-27.30)
    // "01719686459" (27.58-29.26) · "Abrar IT" (29.60) · tagline (30.42)
    whiteWipe: 0.0,
    logoIn: 0.31, // 23.90s — phrase onset
    headline: 1.2, // 24.79s
    ctaButton: 2.6, // 26.19s
    ctaLabel: 3.2, // 26.79s — URL wipes in on "যোগাযোগ করুন" (contact)
    whatsapp: 3.99, // 27.58s — button lands as the number is read aloud
    phoneLabel: 4.25, // 27.84s — the number appears beside it
    logoAccent: 6.01, // 29.60s — logo pulses on the spoken "Abrar IT"
    tagline: 6.83, // 30.42s — on "Your Journey to Digital Excellence!"
    hold: 7.6,
  },
} as const;

/** Beat lookup in frames, relative to the owning scene's first frame. */
export const beat = <S extends keyof typeof BEATS>(
  scene: S,
  name: keyof (typeof BEATS)[S],
): number => sec(BEATS[scene][name] as number);
