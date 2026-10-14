import type { CSSProperties } from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../brand";
import { COLORS, EASE, SPRINGS } from "../theme";
import { prog, springAt } from "../anim";

export type LogoRevealProps = {
  /** Rendered width in composition px. Height follows the asset's aspect ratio. */
  width: number;
  delay?: number;
  /** Frames the mask wipe takes. */
  duration?: number;
  style?: CSSProperties;
};

/**
 * Reveals the original Abrar IT logo behind a travelling mask.
 *
 * The PNG is drawn untouched — no recolouring, no filters on the pixels
 * themselves, and the aspect ratio is locked to the asset (1249x351).
 */
export const LogoReveal: React.FC<LogoRevealProps> = ({
  width,
  delay = 0,
  duration = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const height = width / BRAND.logoAspect;
  const wipe = prog(frame, delay, duration, EASE.inOut);
  const settle = springAt({ frame, fps, delay: delay + 4, config: SPRINGS.soft });

  if (wipe <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `scale(${1.035 - settle * 0.035})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          // Mask travels left -> right with a soft feathered trailing edge.
          WebkitMaskImage: `linear-gradient(90deg, #000 0%, #000 ${wipe * 100}%, rgba(0,0,0,0) ${Math.min(100, wipe * 100 + 9)}%)`,
          maskImage: `linear-gradient(90deg, #000 0%, #000 ${wipe * 100}%, rgba(0,0,0,0) ${Math.min(100, wipe * 100 + 9)}%)`,
        }}
      >
        <Img
          src={BRAND.logo()}
          alt={`${BRAND.name} logo`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Brand-orange light edge riding the mask while it travels. */}
      {wipe < 0.999 ? (
        <div
          style={{
            position: "absolute",
            top: "-10%",
            bottom: "-10%",
            left: `${wipe * 100}%`,
            width: 5,
            marginLeft: -2.5,
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(241,89,34,0) 0%, ${COLORS.orange} 46%, rgba(241,89,34,0) 100%)`,
            filter: "blur(2px)",
            opacity: 0.85,
          }}
        />
      ) : null}
    </div>
  );
};
