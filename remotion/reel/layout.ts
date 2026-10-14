/**
 * Reels / Shorts / Stories canvas: 1080x1920 (9:16).
 *
 * Instagram and Facebook overlay their own UI on a Reel, so everything that
 * matters stays inside a safe area: roughly 250px clear at the top (account
 * name), 350px at the bottom (caption and buttons) and 120px on the right (the
 * like / comment / share column).
 */
export const RW = 1080;
export const RH = 1920;

export const SAFE_TOP = 250;
export const SAFE_BOTTOM = RH - 350;
export const SAFE_LEFT = 70;
/** Right edge of safe content — leaves room for the action column. */
export const SAFE_RIGHT = RW - 120;
