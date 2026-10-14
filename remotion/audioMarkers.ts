/**
 * Speech markers measured from public/voiceover.mp3.
 *
 * Produced by decoding the file to 16 kHz mono PCM and taking the RMS of every
 * 20 ms frame; a frame counts as speech above -34 dBFS relative to the track
 * peak, gaps under 140 ms are bridged, and blips under 100 ms are dropped.
 * These are therefore *measured* onsets, not estimates.
 *
 * They are reference data for timeline.ts — nothing imports them at render
 * time. Re-measure after swapping the audio and the numbers below are the only
 * thing that needs updating.
 */

export const VOICEOVER_FILE = "voiceover.mp3";
export const VOICEOVER_DURATION = 31.791;

/** Start / end of each detected speech phrase, in seconds. */
export const PHRASES = [
  { start: 0.06, end: 3.04 },
  { start: 3.56, end: 6.76 },
  { start: 6.98, end: 8.42 },
  { start: 8.92, end: 10.1 },
  { start: 10.38, end: 10.98 },
  { start: 11.12, end: 11.92 },
  { start: 12.1, end: 13.76 },
  { start: 14.06, end: 15.76 },
  { start: 15.9, end: 17.2 },
  { start: 17.68, end: 20.2 },
  { start: 20.6, end: 23.28 },
  { start: 23.9, end: 27.3 },
  { start: 27.58, end: 29.26 },
  { start: 29.6, end: 30.28 },
  { start: 30.42, end: 31.54 },
] as const;

/**
 * Gaps of 0.4s or more — the sentence breaks. Scene boundaries sit at the
 * midpoint of each, so no cut ever lands inside a spoken sentence.
 */
export const SENTENCE_BREAKS = [3.3, 8.67, 17.44, 23.59] as const;
