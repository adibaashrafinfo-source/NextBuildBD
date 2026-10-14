import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, EASE } from "../theme";
import { HEIGHT, WIDTH } from "../timeline";

const C = 380;
const PW = 2 * WIDTH + 2 * C;
const PATH = `M ${C},0 L ${PW - C},0 C ${PW + C * 0.35},${HEIGHT * 0.18} ${PW + C * 0.35},${HEIGHT * 0.82} ${PW - C},${HEIGHT} L ${C},${HEIGHT} C ${-C * 0.35},${HEIGHT * 0.82} ${-C * 0.35},${HEIGHT * 0.18} ${C},0 Z`;

/**
 * The orange swash that carries the film from one scene to the next.
 *
 * Each cut lands in a measured pause of the narration (~0.5s), so the sweep
 * fits inside the silence: it covers the old scene, the hard cut happens while
 * the frame is solid orange, and it uncovers the new one.
 */
export const SceneWipe: React.FC<{
  /** Cut frames (absolute). The panel is fully covering at each. */
  cuts: ReadonlyArray<number>;
  /** Half the sweep length, in frames. */
  half?: number;
}> = ({ cuts, half = 9 }) => {
  const frame = useCurrentFrame();
  const cut = cuts.find((c) => Math.abs(frame - c) <= half + 4);
  if (cut === undefined) return null;

  const layer = (delay: number) => {
    const p = Math.max(0, Math.min(1, (frame - (cut - half) - delay) / (half * 2)));
    return -PW + (WIDTH + PW) * EASE.inOut(p);
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 200 }}>
      {[
        { delay: 2, fill: "#DC4A14" },
        { delay: 0, fill: "url(#wipe-grad)" },
      ].map((l, i) => (
        <svg
          key={i}
          width={PW}
          height={HEIGHT}
          viewBox={`0 0 ${PW} ${HEIGHT}`}
          style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${layer(l.delay)}px, 0, 0)` }}
        >
          <defs>
            <linearGradient id="wipe-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={COLORS.orangeSoft} />
              <stop offset="0.5" stopColor={COLORS.orange} />
              <stop offset="1" stopColor={COLORS.orangeSoft} />
            </linearGradient>
          </defs>
          <path d={PATH} fill={l.fill} />
        </svg>
      ))}
    </AbsoluteFill>
  );
};
