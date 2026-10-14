import { useCurrentFrame } from "remotion";
import { COLORS, EASE } from "../theme";
import { clamp01, prog } from "../anim";

export type CursorKey = {
  /** Frame (relative to the surrounding Sequence). */
  f: number;
  x: number;
  y: number;
  /** Fires a click (press + ripple) on this key's frame. */
  click?: boolean;
};

/** A polished macOS-style pointer, drawn at an explicit position. */
export const CursorPointer: React.FC<{
  x: number;
  y: number;
  opacity?: number;
  /** 0..1 press depth. */
  press?: number;
  /** 0..1 ripple progress; omit for none. */
  ripple?: number;
  size?: number;
}> = ({ x, y, opacity = 1, press = 0, ripple, size = 34 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      pointerEvents: "none",
      zIndex: 90,
      transform: `translate(-14%, -8%) scale(${1 - press * 0.14})`,
      transformOrigin: "14% 8%",
    }}
  >
    {ripple !== undefined && ripple > 0 && ripple < 1 ? (
      <span
        style={{
          position: "absolute",
          left: 4,
          top: 3,
          width: 24 + ripple * 96,
          height: 24 + ripple * 96,
          marginLeft: -(12 + ripple * 48),
          marginTop: -(12 + ripple * 48),
          borderRadius: 999,
          border: `3px solid ${COLORS.orange}`,
          opacity: (1 - ripple) * 0.7,
        }}
      />
    ) : null}
    <svg width={size} height={size * 1.42} viewBox="0 0 24 34" style={{ display: "block", filter: "drop-shadow(0 8px 12px rgba(15,15,15,0.32))" }}>
      <path
        d="M3 1.6 L3 27.4 L9.6 21.2 L13.8 31.4 L18.3 29.4 L14.1 19.4 L22.6 18.4 Z"
        fill="#fff"
        stroke={COLORS.ink}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Interpolates a pointer along waypoints, with a gentle arc and click feedback. */
export const useCursorPath = (keys: ReadonlyArray<CursorKey>, fadeIn = 8, fadeOut = 10) => {
  const frame = useCurrentFrame();
  const first = keys[0];
  const last = keys[keys.length - 1];
  const opacity = Math.min(prog(frame, first.f - fadeIn, fadeIn, EASE.out), 1 - prog(frame, last.f, fadeOut, EASE.out));

  let i = 0;
  while (i < keys.length - 2 && frame >= keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const t = b.f === a.f ? 1 : EASE.camera(clamp01((frame - a.f) / (b.f - a.f)));
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const arc = Math.sin(t * Math.PI) * Math.hypot(dx, dy) * 0.05;
  const x = a.x + dx * t + (-dy / (Math.hypot(dx, dy) || 1)) * arc;
  const y = a.y + dy * t + (dx / (Math.hypot(dx, dy) || 1)) * arc;

  let press = 0;
  let ripple: number | undefined;
  for (const k of keys) {
    if (!k.click) continue;
    press = Math.max(press, prog(frame, k.f, 5, EASE.snap) - prog(frame, k.f + 5, 9, EASE.out));
    const r = (frame - k.f) / 24;
    if (r > 0 && r < 1) ripple = r;
  }
  return { x, y, opacity, press, ripple };
};

export const Cursor: React.FC<{ keys: ReadonlyArray<CursorKey>; size?: number }> = ({ keys, size }) => {
  const c = useCursorPath(keys);
  if (c.opacity <= 0.005) return null;
  return <CursorPointer {...c} size={size} />;
};
