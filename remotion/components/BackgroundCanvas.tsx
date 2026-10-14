import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { osc } from "../anim";

/** Tiny tiled film grain, inlined so nothing is fetched at render time. */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="180" height="180" filter="url(#n)" opacity="0.5"/></svg>`,
  );

/**
 * The bright, premium ground the whole film sits on: white with slow-drifting
 * warm-gray and faint orange light pools, a soft vignette and fine grain.
 */
export const BackgroundCanvas: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  const driftA = osc(frame, 520) * 40 * intensity;
  const driftB = osc(frame, 700, 1.9) * 54 * intensity;
  const breathe = 1 + osc(frame, 620, 0.6) * 0.035;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 70% at ${18 + driftA * 0.1}% ${28 + driftB * 0.06}%, ${COLORS.warmGray} 0%, rgba(245,245,243,0) 62%)`,
          transform: `scale(${breathe})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 62% at ${82 - driftB * 0.08}% ${74 + driftA * 0.05}%, ${COLORS.warmGrayDeep} 0%, rgba(233,232,227,0) 66%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 48% at ${66 + driftA * 0.12}% ${22 + driftB * 0.04}%, rgba(241,89,34,${0.07 * intensity}) 0%, rgba(241,89,34,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(44% 50% at ${22 - driftB * 0.07}% ${82 - driftA * 0.06}%, rgba(241,89,34,${0.045 * intensity}) 0%, rgba(241,89,34,0) 72%)`,
        }}
      />
      {/* Vignette keeps the eye centred without darkening the frame. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 76% at 50% 48%, rgba(255,255,255,0) 52%, rgba(221,219,212,0.34) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: "repeat",
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
