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

/** Total runtime in seconds. 30s @ 30fps === 900 frames. */
export const TOTAL_SECONDS = 30;

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
 * Scene boundaries in seconds. Adjust these to re-cut the video; scenes are
 * laid out back-to-back and every scene handles its own in/out animation, so
 * boundaries can move freely as long as they stay ordered and end at
 * TOTAL_SECONDS.
 */
export const SCENES = {
  hook: { start: 0, end: 5 },
  opportunity: { start: 5, end: 9 },
  showcase: { start: 9, end: 17 },
  solutions: { start: 17, end: 24 },
  brand: { start: 24, end: 30 },
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
 */
export const BEATS = {
  hook: {
    ribbonIn: 0.0,
    ribbonSecond: 0.45,
    browserIn: 0.8,
    headlineLine1: 1.5,
    headlineLine2: 2.15,
    floatingCard: 2.6,
    cursorIn: 2.9,
    cursorClick: 3.7,
    outro: 4.4,
  },
  opportunity: {
    siteIn: 0.0,
    glassPanels: 0.5,
    headlineLine1: 0.9,
    headlineLine2: 1.5,
    lightSweep: 3.1,
  },
  showcase: {
    browserIn: 0.0,
    navDraw: 0.35,
    heroIn: 0.6,
    cardsIn: 0.95,
    scrollStart: 1.3,
    scrollEnd: 3.5,
    hoverCta: 2.4,
    devicesSplit: 3.7,
    labelUiUx: 4.7,
    labelResponsive: 5.15,
    labelPerformance: 5.6,
    outro: 7.3,
  },
  solutions: {
    panel1: 0.0,
    panel2: 0.3,
    panel3: 0.6,
    align: 1.6,
    label1: 2.2,
    label2: 2.5,
    label3: 2.8,
    reflectionSweep: 4.6,
    outro: 6.3,
  },
  brand: {
    whiteWipe: 0.0,
    logoIn: 0.35,
    headline: 1.4,
    ctaButton: 2.2,
    ctaLabel: 3.0,
    tagline: 3.6,
    whatsapp: 1.9,
    hold: 4.4,
  },
} as const;

/** Beat lookup in frames, relative to the owning scene's first frame. */
export const beat = <S extends keyof typeof BEATS>(
  scene: S,
  name: keyof (typeof BEATS)[S],
): number => sec(BEATS[scene][name] as number);
