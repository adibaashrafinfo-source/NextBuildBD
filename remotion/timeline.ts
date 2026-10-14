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
  loss: { start: 3.3, end: 8.67 },
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
 * Cue sheet: every on-screen event, in ABSOLUTE seconds from the top of the
 * film — the same clock as public/voiceover.mp3.
 *
 * To re-sync something, find the second the narrator says the word and change
 * the number here. Scenes convert to scene-relative frames with `rel()`, so
 * nothing else needs to move. Each value is annotated with the spoken word it
 * is pinned to (see audioMarkers.ts for the measured phrase boundaries).
 */
export const CUES = {
  hook: {
    // "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?"  0.06 - 3.04
    ribbon: 0.0,
    window: 0.12,
    url: 0.35,
    line1: [0.1, 0.4, 0.74, 0.92], // আপনার · ব্যবসার · কি · এখনো
    line2: [1.4, 1.72], //            কোনো · প্রফেশনাল
    line3: [2.36, 2.86], //           ওয়েবসাইট · নেই?
    cursorIn: 1.55,
    click: 2.5,
  },
  loss: {
    // "তাহলে প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস"  3.56 - 6.76
    // "ও নতুন ব্যবসার সুযোগ!"                                  6.98 - 8.42
    phone: 3.35,
    chat: 3.5,
    line1: [4.06, 4.56], //   প্রতিদিন · হারাচ্ছেন
    line2: [5.2, 5.7], //      সম্ভাব্য · কাস্টমারের
    line3: [6.35], //          বিশ্বাস
    line4: [6.98, 7.22, 7.56, 8.0], // ও · নতুন · ব্যবসার · সুযোগ!
  },
  showcase: {
    // "Abrar IT দিচ্ছে" 8.92 · "আধুনিক," 10.38 · "দ্রুতগতির" 11.12
    // "ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট," 12.10 · "যা আপনার ব্র্যান্ডকে তুলে ধরে" 14.06
    // "আরও প্রফেশনালভাবে।" 15.90 - 17.20
    window: 8.8,
    logo: 8.92,
    modern: 10.38,
    cardHover: 10.62,
    fast: 11.12,
    dragIn: 11.75,
    mobile: 12.1,
    dragOut: 13.28,
    morph: 13.3,
    trio: 13.55,
    brandLine: 14.06,
    proLine: 15.9,
  },
  solutions: {
    // "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর—" 17.68 - 20.20
    // "...স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন।"      20.60 - 23.28
    business: 17.68,
    shopMove: 19.0,
    shop: 19.38,
    addToCart: 20.1,
    customMove: 21.45,
    custom: 21.84,
    pullBack: 22.7,
  },
  brand: {
    // "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে আজই যোগাযোগ করুন" 23.90 - 27.30
    // number 27.58 · "Abrar IT" 29.60 · tagline 30.42
    logo: 23.9,
    lead: [24.0, 24.35, 24.8, 25.3, 25.65], // আপনার · ব্যবসাকে · অনলাইনে · এগিয়ে · নিতে
    headline: [25.95, 26.35, 26.8], //   আজই · যোগাযোগ · করুন
    cta: 27.0,
    whatsapp: 27.58,
    phoneLabel: 27.84,
    logoAccent: 29.6,
    tagline: 30.42,
  },
} as const;

/** Absolute seconds -> frames relative to the start of `scene`. */
export const rel = (scene: SceneName, absoluteSeconds: number) =>
  sec(absoluteSeconds) - sec(SCENES[scene].start);
