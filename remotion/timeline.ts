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
    ribbonIn: 0.0,
    ribbonSecond: 0.28,
    browserIn: 0.45,
    headlineLine1: 0.7,
    headlineLine2: 1.35,
    floatingCard: 1.72,
    cursorIn: 1.82,
    cursorClick: 2.5,
    outro: 2.92,
  },
  opportunity: {
    // 0.26 === 3.56s absolute, the onset of the second spoken sentence.
    siteIn: 0.0,
    headlineLine1: 0.26,
    glassPanels: 0.55,
    headlineLine2: 1.2,
    // 3.68 === 6.98s absolute, the onset of the following phrase.
    accentSweep: 3.68,
    lightSweep: 4.8,
  },
  showcase: {
    browserIn: 0.0,
    navDraw: 0.25,
    heroIn: 0.5,
    cardsIn: 0.8,
    scrollStart: 0.9,
    hoverCta: 1.71,
    scrollEnd: 2.2,
    // The split and the three labels each land on a measured phrase onset:
    // 11.12 / 12.10 / 14.06 / 15.90 absolute.
    devicesSplit: 2.45,
    labelUiUx: 3.43,
    labelResponsive: 5.39,
    labelPerformance: 7.23,
    outro: 8.42,
  },
  solutions: {
    panel1: 0.0,
    panel2: 0.35,
    label1: 0.4,
    panel3: 0.7,
    align: 1.6,
    label2: 1.6,
    // 3.16 === 20.60s absolute, the onset of the closing solutions phrase.
    label3: 3.16,
    reflectionSweep: 4.3,
    outro: 5.78,
  },
  brand: {
    whiteWipe: 0.0,
    // Onsets at 23.90 / 27.58 / 29.60 / 30.42 absolute.
    logoIn: 0.31,
    headline: 1.3,
    whatsapp: 2.6,
    ctaButton: 3.4,
    ctaLabel: 3.99,
    logoAccent: 6.01,
    tagline: 6.83,
    hold: 7.4,
  },
} as const;

/** Beat lookup in frames, relative to the owning scene's first frame. */
export const beat = <S extends keyof typeof BEATS>(
  scene: S,
  name: keyof (typeof BEATS)[S],
): number => sec(BEATS[scene][name] as number);
