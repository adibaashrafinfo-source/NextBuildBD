import { random, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { HEIGHT, WIDTH } from "../timeline";

export type OrangeParticlesProps = {
  count?: number;
  seed?: string;
  /** Global opacity multiplier. */
  intensity?: number;
  /** Larger values drift faster. */
  speed?: number;
};

/**
 * Ambient brand-orange motes. Deterministic (seeded) so every render of a
 * given frame is pixel-identical.
 */
export const OrangeParticles: React.FC<OrangeParticlesProps> = ({
  count = 26,
  seed = "abrar",
  intensity = 1,
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r1 = random(`${seed}-x-${i}`);
        const r2 = random(`${seed}-y-${i}`);
        const r3 = random(`${seed}-s-${i}`);
        const r4 = random(`${seed}-v-${i}`);
        const r5 = random(`${seed}-w-${i}`);

        const size = 3 + r3 * 9;
        const rise = (frame * (0.25 + r4 * 0.75) * speed) % (HEIGHT + 260);
        const x = r1 * WIDTH + Math.sin(frame / (70 + r5 * 90) + i) * (18 + r5 * 36);
        const y = HEIGHT + 130 - rise - r2 * 160;
        const depth = 0.3 + r3 * 0.7;
        const fade =
          Math.min(1, (HEIGHT + 130 - y) / 220) * Math.min(1, (y + 140) / 260);

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: 999,
              background:
                r5 > 0.72
                  ? COLORS.orangeSoft
                  : r5 > 0.4
                    ? COLORS.orange
                    : "rgba(241,89,34,0.6)",
              opacity: Math.max(0, fade) * (0.14 + depth * 0.3) * intensity,
              filter: `blur(${(1 - depth) * 2.4}px)`,
              boxShadow: `0 0 ${size * 2.4}px rgba(241,89,34,${0.22 * depth})`,
            }}
          />
        );
      })}
    </div>
  );
};
