/**
 * Builds a calligraphic, tapered ribbon along a cubic Bezier — the shape
 * language of the Abrar IT logo swash (thin entry, swelling belly, thin exit).
 *
 * Returns an SVG path string for a *filled* closed shape, which gives a far
 * richer result than a constant-width stroke and lets the ribbon be "drawn"
 * by generating it only up to a given progress.
 */

export type Pt = { x: number; y: number };

const cubic = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

const cubicTangent = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const c = 3 * t * t;
  return {
    x: a * (p1.x - p0.x) + b * (p2.x - p1.x) + c * (p3.x - p2.x),
    y: a * (p1.y - p0.y) + b * (p2.y - p1.y) + c * (p3.y - p2.y),
  };
};

export type RibbonOptions = {
  /** Cubic control points, in SVG user units. */
  readonly curve: readonly [Pt, Pt, Pt, Pt];
  /** Peak half-width of the ribbon. */
  readonly width: number;
  /** 0..1 — how much of the curve to draw. */
  readonly progress?: number;
  /** Where along the curve the ribbon is at its thickest (0..1). */
  readonly belly?: number;
  /** Sampling resolution. */
  readonly steps?: number;
};

/** Width profile: thin tips, full belly, biased by `belly`. */
const widthAt = (t: number, belly: number) => {
  const shaped = t < belly ? t / belly : 1 - (t - belly) / (1 - belly);
  return Math.sin(Math.max(0, Math.min(1, shaped)) * (Math.PI / 2)) ** 0.85;
};

export const buildRibbonPath = ({
  curve,
  width,
  progress = 1,
  belly = 0.46,
  steps = 96,
}: RibbonOptions): string => {
  const [p0, p1, p2, p3] = curve;
  const end = Math.max(0.0001, Math.min(1, progress));
  const left: Pt[] = [];
  const right: Pt[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * end;
    const c = cubic(t, p0, p1, p2, p3);
    const tan = cubicTangent(t, p0, p1, p2, p3);
    const len = Math.hypot(tan.x, tan.y) || 1;
    const nx = -tan.y / len;
    const ny = tan.x / len;
    // Taper the live tip so a partially drawn ribbon still ends in a point.
    const tipFade = Math.min(1, ((end - t) / Math.max(0.0001, end)) * 14);
    const w = width * widthAt(t, belly) * Math.min(1, tipFade);
    left.push({ x: c.x + nx * w, y: c.y + ny * w });
    right.push({ x: c.x - nx * w, y: c.y - ny * w });
  }

  const fmt = (p: Pt) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  const forward = left.map((p, i) => `${i === 0 ? "M" : "L"}${fmt(p)}`).join("");
  const back = right
    .slice()
    .reverse()
    .map((p) => `L${fmt(p)}`)
    .join("");

  return `${forward}${back}Z`;
};

/** Point on the curve at `t` — used to park a highlight dot on the live tip. */
export const ribbonPointAt = (
  curve: readonly [Pt, Pt, Pt, Pt],
  t: number,
): Pt => cubic(Math.max(0, Math.min(1, t)), curve[0], curve[1], curve[2], curve[3]);
