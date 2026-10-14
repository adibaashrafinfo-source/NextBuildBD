import { useCurrentFrame } from "remotion";
import { buildRibbonPath, ribbonPointAt, type Pt } from "../ribbonGeometry";
import { COLORS } from "../theme";
import { EASE } from "../theme";
import { osc, prog } from "../anim";

export type RibbonProps = {
  /** Cubic control points in a 1920x1080 user space. */
  curve: readonly [Pt, Pt, Pt, Pt];
  /** Frame the draw-on begins. */
  delay?: number;
  /** Frames the draw-on takes. */
  duration?: number;
  width?: number;
  belly?: number;
  opacity?: number;
  /** Adds a thin trailing hairline that follows the main ribbon. */
  hairline?: boolean;
  /** Parks a soft glow on the live tip while drawing. */
  tipGlow?: boolean;
  /** Vertical drift amplitude, px. */
  drift?: number;
  gradientId: string;
};

/**
 * A calligraphic orange ribbon built from the same taper logic as the swash in
 * the Abrar IT logo. Draws itself on, then drifts gently.
 */
export const AnimatedOrangeRibbon: React.FC<RibbonProps> = ({
  curve,
  delay = 0,
  duration = 42,
  width = 16,
  belly = 0.46,
  opacity = 1,
  hairline = true,
  tipGlow = true,
  drift = 10,
  gradientId,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, duration, EASE.out);
  if (p <= 0) {
    return null;
  }

  const d = buildRibbonPath({ curve, width, progress: p, belly });
  const hair = buildRibbonPath({
    curve,
    width: width * 0.16,
    progress: Math.min(1, p * 1.08),
    belly: Math.min(0.9, belly + 0.18),
  });
  const tip = ribbonPointAt(curve, p);
  const floatY = osc(frame, 240, delay * 0.05) * drift;
  const floatX = osc(frame, 330, 1.2) * drift * 0.4;

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        opacity,
        transform: `translate3d(${floatX}px, ${floatY}px, 0)`,
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={COLORS.orangeDeep} stopOpacity="0.9" />
          <stop offset="38%" stopColor={COLORS.orange} />
          <stop offset="78%" stopColor={COLORS.orangeSoft} />
          <stop offset="100%" stopColor={COLORS.orangeSoft} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${gradientId}-hair`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.orange} stopOpacity="0" />
          <stop offset="55%" stopColor={COLORS.orangeSoft} stopOpacity="0.75" />
          <stop offset="100%" stopColor={COLORS.white} stopOpacity="0.9" />
        </linearGradient>
        <filter id={`${gradientId}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Ambient glow under the ribbon. */}
      <path d={d} fill={COLORS.orange} opacity={0.2} filter={`url(#${gradientId}-soft)`} />
      <path d={d} fill={`url(#${gradientId})`} />
      {/* Specular edge along the top of the belly. */}
      <path
        d={buildRibbonPath({ curve, width: width * 0.42, progress: p, belly: belly * 0.8 })}
        fill="rgba(255,255,255,0.28)"
      />
      {hairline ? <path d={hair} fill={`url(#${gradientId}-hair)`} opacity={0.75} /> : null}

      {tipGlow && p < 0.999 ? (
        <>
          <circle cx={tip.x} cy={tip.y} r={width * 1.5} fill={COLORS.orangeSoft} opacity={0.3} filter={`url(#${gradientId}-soft)`} />
          <circle cx={tip.x} cy={tip.y} r={width * 0.34} fill={COLORS.white} opacity={0.95} />
        </>
      ) : null}
    </svg>
  );
};
