import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRINGS } from "../theme";
import { osc, springAt } from "../anim";
import { WHATSAPP_URL } from "../brand";

export type WhatsAppFloatingButtonProps = {
  /** Frame the button springs in. */
  delay?: number;
  size?: number;
  /** Distance from the bottom-right corner of the frame. */
  inset?: { right: number; bottom: number };
  style?: CSSProperties;
};

const WhatsAppGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={COLORS.white} aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.44 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.07c0 2 .52 3.96 1.52 5.69L.58 23.7l6.08-1.6a11.33 11.33 0 0 0 5.39 1.38h.01c6.26 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.34-8.04" />
  </svg>
);

/**
 * Floating WhatsApp action button, bottom-right. Official WhatsApp green is used
 * here and nowhere else in the film. In the rendered MP4 it is purely visual;
 * in the interactive <Player> it links out only when WHATSAPP_URL is configured.
 */
export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  delay = 0,
  size = 104,
  inset = { right: 96, bottom: 84 },
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = springAt({ frame, fps, delay, config: SPRINGS.pop });
  if (s <= 0.001) {
    return null;
  }

  const float = osc(frame - delay, 92) * 7;
  // Slow outward pulse ring.
  const pulse = ((frame - delay) % 78) / 78;

  const body = (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: `2px solid ${COLORS.whatsapp}`,
          transform: `scale(${1 + pulse * 0.55})`,
          opacity: (1 - pulse) * 0.45 * s,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          background: `linear-gradient(160deg, #3BE07A 0%, ${COLORS.whatsapp} 46%, ${COLORS.whatsappDeep} 100%)`,
          boxShadow: `0 26px 52px -18px rgba(18,146,74,0.58), 0 8px 18px -8px rgba(18,146,74,0.42), inset 0 1.5px 0 rgba(255,255,255,0.42)`,
        }}
      />
      <span style={{ position: "relative", display: "flex" }}>
        <WhatsAppGlyph size={size * 0.52} />
      </span>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        right: inset.right,
        bottom: inset.bottom,
        transform: `translateY(${(1 - s) * 60 + float}px) scale(${0.72 + s * 0.28})`,
        opacity: Math.min(1, s * 1.6),
        zIndex: 50,
        ...style,
      }}
    >
      {WHATSAPP_URL ? (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          style={{ display: "block", textDecoration: "none" }}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
};
