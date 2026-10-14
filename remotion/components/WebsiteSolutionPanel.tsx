import type { ReactNode } from "react";
import { COLORS } from "../theme";
import { WebsiteBrowserMockup } from "./WebsiteBrowserMockup";

export type WebsiteSolutionPanelProps = {
  /** Window size in CSS px and its resting display scale. */
  width: number;
  height: number;
  k: number;
  /** Where the panel's centre sits on screen, and the camera zoom applied to it. */
  cx: number;
  cy: number;
  zoom: number;
  /** Degrees to turn toward the camera. */
  rotateY: number;
  /** 0 = in focus, 1 = fully veiled. */
  veil: number;
  /** 0..1 entrance. */
  enter: number;
  title: string;
  url: string;
  favicon?: ReactNode;
  children: (w: number, h: number) => ReactNode;
};

/**
 * One of the three solution windows in the "multiple web solutions" scene. The
 * scene's camera drives its position and zoom; this adds the 3D turn, the
 * veil that pushes unfocused windows back, and the entrance.
 */
export const WebsiteSolutionPanel: React.FC<WebsiteSolutionPanelProps> = ({
  width,
  height,
  k,
  cx,
  cy,
  zoom,
  rotateY,
  veil,
  enter,
  title,
  url,
  favicon,
  children,
}) => {
  const w = width * k;
  const h = height * k;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        opacity: Math.min(1, enter * 1.8),
        transform: `perspective(2600px) translateY(${(1 - enter) * 140}px) rotateY(${rotateY}deg) scale(${zoom * (0.94 + enter * 0.06)})`,
        transformOrigin: "50% 50%",
      }}
    >
      <WebsiteBrowserMockup width={width} height={height} scale={k} title={title} url={url} favicon={favicon}>
        {children}
      </WebsiteBrowserMockup>
      {veil > 0.01 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20 * k,
            background: `rgba(255,255,255,${veil * 0.62})`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

export const InkFavicon: React.FC = () => (
  <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: `linear-gradient(145deg, #3B3937, ${COLORS.ink})` }} />
);
