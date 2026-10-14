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

/** The contact number read aloud in phrase #13, as supplied by the owner. */
export const SPOKEN_PHONE = "01719686459";

/**
 * Start / end of each detected speech phrase, with the line of the supplied
 * script that falls in it. The script is Bangla; the on-screen copy stays
 * English per the brief.
 *
 * The mapping is corroborated by phrase length: #5 is 0.60s for the single
 * word "আধুনিক" (modern), #6 is 0.80s for "দ্রুতগতির" (fast), #13 is 1.68s --
 * the time it takes to read a phone number aloud -- and #14 is 0.68s for
 * "Abrar IT".
 */
export const PHRASES = [
  { start: 0.06, end: 3.04, line: "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?" },
  { start: 3.56, end: 6.76, line: "তাহলে প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস" },
  { start: 6.98, end: 8.42, line: "ও নতুন ব্যবসার সুযোগ!" },
  { start: 8.92, end: 10.1, line: "Abrar IT দিচ্ছে" },
  { start: 10.38, end: 10.98, line: "আধুনিক,  -> MODERN UI/UX" },
  { start: 11.12, end: 11.92, line: "দ্রুতগতির  -> FAST PERFORMANCE" },
  { start: 12.1, end: 13.76, line: "ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট,  -> RESPONSIVE DESIGN + device split" },
  { start: 14.06, end: 15.76, line: "যা আপনার ব্র্যান্ডকে তুলে ধরে" },
  { start: 15.9, end: 17.2, line: "আরও প্রফেশনালভাবে।" },
  { start: 17.68, end: 20.2, line: "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর—" },
  { start: 20.6, end: 23.28, line: "আপনার ব্যবসার জন্য পেতে পারেন স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন।" },
  { start: 23.9, end: 27.3, line: "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে আজই যোগাযোগ করুন" },
  { start: 27.58, end: 29.26, line: "01719686459  -> WhatsApp button + number" },
  { start: 29.6, end: 30.28, line: "Abrar IT  -> logo accent" },
  { start: 30.42, end: 31.54, line: "Your Journey to Digital Excellence!  -> tagline" },
] as const;

/**
 * Gaps of 0.4s or more — the sentence breaks. Scene boundaries sit at the
 * midpoint of each, so no cut ever lands inside a spoken sentence.
 */
export const SENTENCE_BREAKS = [3.3, 8.67, 17.44, 23.59] as const;
