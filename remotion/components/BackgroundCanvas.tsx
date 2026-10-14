import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { osc } from "../anim";

/** Static noise tile, inlined so nothing is fetched at render time. Breaks up gradient banding in H.264. */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(#n)" opacity="0.55"/></svg>`,
  );

/**
 * The studio floor the film sits on: pure white lifted by a slow warm-gray
 * drift and a whisper of brand orange. Deliberately cheap to render — no
 * blend modes, no live blur.
 */
export const BackgroundCanvas: React.FC<{ warmth?: number }> = ({ warmth = 1 }) => {
  const frame = useCurrentFrame();
  const a = osc(frame, 540) * 5;
  const b = osc(frame, 720, 1.7) * 5;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 72% at ${22 + a}% ${30 + b * 0.4}%, ${COLORS.mist} 0%, rgba(243,242,238,0) 64%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 60% at ${80 - b}% ${78 + a * 0.4}%, ${COLORS.mistDeep} 0%, rgba(233,231,225,0) 68%)`,
          opacity: 0.8,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 46% at ${70 + a}% ${18 + b * 0.3}%, rgba(241,89,34,${0.07 * warmth}) 0%, rgba(241,89,34,0) 72%)`,
        }}
      />
      <AbsoluteFill style={{ backgroundImage: `url("${GRAIN}")`, backgroundRepeat: "repeat", opacity: 0.028 }} />
    </AbsoluteFill>
  );
};
