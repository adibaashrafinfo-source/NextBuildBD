import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE } from "../theme";
import { prog } from "../anim";

export type LightSweepProps = {
  delay: number;
  duration?: number;
  /** Sweep direction in degrees; 100 reads as a diagonal left-to-right wipe. */
  angle?: number;
  intensity?: number;
  /** Tints the sweep with brand orange instead of pure white. */
  warm?: boolean;
};

/** A cinematic light bar that crosses frame — the connective tissue between scenes. */
export const LightSweep: React.FC<LightSweepProps> = ({
  delay,
  duration = 26,
  angle = 102,
  intensity = 1,
  warm = true,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, duration, EASE.inOut);
  if (t <= 0 || t >= 1) {
    return null;
  }

  const pos = -40 + t * 180;
  const core = warm ? "rgba(255,186,152," : "rgba(255,255,255,";

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-60%",
          bottom: "-60%",
          left: `${pos}%`,
          width: "34%",
          transform: `rotate(${angle - 90}deg)`,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${core}${0.5 * intensity}) 44%, rgba(255,255,255,${0.92 * intensity}) 52%, ${core}${0.45 * intensity}) 60%, rgba(255,255,255,0) 100%)`,
          filter: "blur(26px)",
          opacity: Math.sin(t * Math.PI),
        }}
      />
    </AbsoluteFill>
  );
};
