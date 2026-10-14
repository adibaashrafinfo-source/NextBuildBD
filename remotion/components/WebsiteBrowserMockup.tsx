import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Lock, MoreHorizontal, RotateCw, Share2, X, Plus } from "lucide-react";
import { COLORS, FONTS, SHADOWS } from "../theme";

export const CHROME_H = 92;

export type WebsiteBrowserMockupProps = {
  /** Window size in CSS px. The page renders into (width, height - CHROME_H). */
  width: number;
  height: number;
  /** Display scale: on-screen px per CSS px. */
  scale?: number;
  /** Receives the page viewport size in CSS px. */
  children: (viewportW: number, viewportH: number) => ReactNode;
  title?: string;
  url?: string;
  /** 0..1 — how much of the URL has been typed. */
  urlTyped?: number;
  /** 0..1 — page-load bar; 0 hides it, 1 means done. */
  loading?: number;
  radius?: number;
  shadow?: boolean;
  /** Replaces the favicon swatch. */
  favicon?: ReactNode;
  style?: CSSProperties;
};

const Light: React.FC<{ c: string }> = ({ c }) => (
  <span style={{ width: 13, height: 13, borderRadius: 99, background: c, display: "block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
);

/**
 * A realistic floating browser window: tab strip, toolbar, address bar and a
 * page viewport. The page is rendered at its natural CSS size and scaled as a
 * whole, so type stays crisp and layouts reflow exactly as they would live.
 */
export const WebsiteBrowserMockup: React.FC<WebsiteBrowserMockupProps> = ({
  width,
  height,
  scale = 1,
  children,
  title = "আর্বান নেস্ট — স্বপ্নের ঠিকানা",
  url = "urbannest.com.bd",
  urlTyped = 1,
  loading = 0,
  radius = 20,
  shadow = true,
  favicon,
  style,
}) => {
  const vw = width;
  const vh = height - CHROME_H;
  const shown = url.slice(0, Math.max(0, Math.round(url.length * urlTyped)));
  const loadingNow = loading > 0 && loading < 1;

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        position: "relative",
        borderRadius: radius * scale,
        boxShadow: shadow ? SHADOWS.window : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          borderRadius: radius,
          overflow: "hidden",
          background: COLORS.white,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        {/* tab strip */}
        <div
          style={{
            height: 46,
            background: "#E4E2DC",
            display: "flex",
            alignItems: "flex-end",
            padding: "0 16px",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", height: 46, paddingRight: 8 }}>
            <Light c="#FF5F57" />
            <Light c="#FEBC2E" />
            <Light c="#28C840" />
          </div>
          <div
            style={{
              height: 38,
              minWidth: Math.min(320, width * 0.34),
              maxWidth: 340,
              background: "#F7F6F3",
              borderRadius: "12px 12px 0 0",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              fontFamily: FONTS.ui,
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.inkSoft,
            }}
          >
            {favicon ?? (
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  flexShrink: 0,
                  background: `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`,
                }}
              />
            )}
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
            <X size={15} color={COLORS.muted} />
          </div>
          <div style={{ height: 38, display: "flex", alignItems: "center", paddingBottom: 4 }}>
            <Plus size={18} color={COLORS.muted} />
          </div>
        </div>

        {/* toolbar */}
        <div
          style={{
            height: CHROME_H - 46,
            background: "#F7F6F3",
            borderBottom: `1px solid ${COLORS.line}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 18px",
          }}
        >
          <ChevronLeft size={21} color={COLORS.muted} />
          <ChevronRight size={21} color="#BDBBB4" />
          <RotateCw
            size={18}
            color={COLORS.muted}
            style={{ transform: loadingNow ? `rotate(${loading * 720}deg)` : undefined }}
          />
          <div
            style={{
              flex: 1,
              height: 32,
              borderRadius: 99,
              background: "#ECEAE5",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "0 16px",
              fontFamily: FONTS.latin,
              fontSize: 15,
              fontWeight: 500,
              color: COLORS.inkSoft,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Lock size={14} color={COLORS.muted} style={{ flexShrink: 0 }} />
            <span>{shown}</span>
            {urlTyped < 1 && urlTyped > 0 ? (
              <span style={{ width: 1.5, height: 17, background: COLORS.orange, marginLeft: -6 }} />
            ) : null}
          </div>
          <Share2 size={17} color={COLORS.muted} />
          <MoreHorizontal size={20} color={COLORS.muted} />
        </div>

        {/* page viewport */}
        <div style={{ position: "relative", width: vw, height: vh, overflow: "hidden", background: COLORS.white }}>
          {children(vw, vh)}
          {loadingNow ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 3.5,
                width: `${loading * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.orangeSoft})`,
                boxShadow: `0 0 12px ${COLORS.orange}`,
                zIndex: 50,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
