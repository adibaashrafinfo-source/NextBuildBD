import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONTS, SHADOWS } from "../theme";

export type WebsiteBrowserMockupProps = {
  width: number;
  height: number;
  /** Design width of the page passed as `children`. Content is scaled to fit. */
  contentWidth: number;
  /** Vertical scroll position inside the page, in content-space px. */
  scroll?: number;
  children: ReactNode;
  radius?: number;
  /** URL shown in the address pill. */
  url?: string;
  /** Hide the chrome bar for device frames that have no browser UI. */
  chrome?: boolean;
  style?: CSSProperties;
  shadow?: string;
  /** 0..1 — milky "materialising from glass" state used on entrance. */
  materialise?: number;
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      width: 11,
      height: 11,
      borderRadius: 999,
      background: color,
      display: "inline-block",
    }}
  />
);

/** A floating browser window with a realistic chrome bar and a scrollable page. */
export const WebsiteBrowserMockup: React.FC<WebsiteBrowserMockupProps> = ({
  width,
  height,
  contentWidth,
  scroll = 0,
  children,
  radius = 20,
  url = "abrarit.com",
  chrome = true,
  style,
  shadow = SHADOWS.float,
  materialise = 0,
}) => {
  const chromeHeight = chrome ? Math.max(34, Math.round(height * 0.058)) : 0;
  const scale = width / contentWidth;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: COLORS.white,
        boxShadow: shadow,
        overflow: "hidden",
        position: "relative",
        border: `1px solid rgba(17,17,17,0.07)`,
        ...style,
      }}
    >
      {chrome ? (
        <div
          style={{
            height: chromeHeight,
            background: "linear-gradient(180deg, #FBFBFA 0%, #F2F1ED 100%)",
            borderBottom: `1px solid ${COLORS.line}`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${chromeHeight * 0.45}px`,
            gap: chromeHeight * 0.4,
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            <Dot color="#E9E8E3" />
            <Dot color="#E9E8E3" />
            <Dot color="#E9E8E3" />
          </div>
          <div
            style={{
              flex: 1,
              height: chromeHeight * 0.58,
              borderRadius: 999,
              background: COLORS.white,
              border: `1px solid ${COLORS.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: chromeHeight * 0.2,
                height: chromeHeight * 0.26,
                borderRadius: 2,
                border: `1.5px solid ${COLORS.orange}`,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            />
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: chromeHeight * 0.34,
                fontWeight: 550,
                color: "#8A8982",
                letterSpacing: "0.01em",
              }}
            >
              {url}
            </span>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <Dot color="#E9E8E3" />
            <Dot color="#E9E8E3" />
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: chromeHeight,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          background: COLORS.white,
        }}
      >
        <div
          style={{
            width: contentWidth,
            transform: `scale(${scale}) translateY(${-scroll}px)`,
            transformOrigin: "top left",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>

      {/* Glass "materialising" veil — the window forms out of a reflection. */}
      {materialise > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(128deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.72) 42%, rgba(255,247,243,0.9) 100%)`,
            opacity: materialise,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};
