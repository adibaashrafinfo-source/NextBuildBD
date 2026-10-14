import { useCurrentFrame } from "remotion";
import { COLORS, EASE } from "../theme";
import { prog } from "../anim";

export type CursorProps = {
  /** Path the cursor travels, in composition px. */
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Frame the cursor appears and starts moving. */
  delay: number;
  /** Frames the travel takes. */
  duration?: number;
  /** Frame the click ripple fires. */
  clickAt?: number;
  size?: number;
};

/** A polished pointer that travels, clicks, and leaves a soft orange ripple. */
export const Cursor: React.FC<CursorProps> = ({
  from,
  to,
  delay,
  duration = 26,
  clickAt,
  size = 30,
}) => {
  const frame = useCurrentFrame();
  const appear = prog(frame, delay, 8, EASE.out);
  if (appear <= 0) {
    return null;
  }

  const t = prog(frame, delay, duration, EASE.camera);
  // Slight arc so the move doesn't read as a linear tween.
  const arc = Math.sin(t * Math.PI) * -26;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t + arc;

  const clickT = clickAt === undefined ? 0 : prog(frame, clickAt, 7, EASE.snap);
  const release = clickAt === undefined ? 0 : prog(frame, clickAt + 5, 10, EASE.out);
  const press = clickT - release;
  const ripple = clickAt === undefined ? 0 : prog(frame, clickAt, 22, EASE.out);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-18%, -12%) scale(${(0.86 + appear * 0.14) * (1 - press * 0.16)})`,
        opacity: appear,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {ripple > 0 && ripple < 1 ? (
        <span
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: 20 + ripple * 86,
            height: 20 + ripple * 86,
            marginLeft: -(10 + ripple * 43),
            marginTop: -(10 + ripple * 43),
            borderRadius: 999,
            border: `2px solid ${COLORS.orange}`,
            opacity: (1 - ripple) * 0.6,
          }}
        />
      ) : null}
      <svg width={size} height={size * 1.42} viewBox="0 0 24 34" style={{ display: "block" }}>
        <path
          d="M3 1.6 L3 27.4 L9.6 21.2 L13.8 31.4 L18.3 29.4 L14.1 19.4 L22.6 18.4 Z"
          fill={COLORS.white}
          stroke={COLORS.ink}
          strokeWidth="1.8"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 6px 12px rgba(17,17,17,0.3))" }}
        />
      </svg>
    </div>
  );
};
