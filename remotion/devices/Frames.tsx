import type { CSSProperties, ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import { COLORS, FONTS } from "../theme";

/** Screen glare: a soft diagonal highlight that makes the glass read as glass. */
const Glare: React.FC<{ at?: number; opacity?: number }> = ({ at = 0, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity,
      background: `linear-gradient(112deg, rgba(255,255,255,0) ${at - 30}%, rgba(255,255,255,0.16) ${at}%, rgba(255,255,255,0) ${at + 26}%)`,
      zIndex: 60,
    }}
  />
);

const TITANIUM = "linear-gradient(145deg, #F7F6F3 0%, #C9C6BF 34%, #EFEDE9 58%, #B4B1AA 100%)";

export const LAPTOP_CONTENT = { w: 1440, h: 900 } as const;
export const TABLET_CONTENT = { w: 834, h: 1150 } as const;
export const PHONE_CONTENT = { w: 390, h: 794 } as const;
export const PHONE_STATUS_H = 50;

/** Laptop: aluminium lid, thin bezel, camera, and a base with a thumb notch. */
export const Laptop: React.FC<{
  /** On-screen width of the screen area, in px. */
  screenWidth: number;
  children: (w: number, h: number) => ReactNode;
  glare?: number;
  style?: CSSProperties;
}> = ({ screenWidth, children, glare = 30, style }) => {
  const scale = screenWidth / LAPTOP_CONTENT.w;
  const screenH = LAPTOP_CONTENT.h * scale;
  const bezel = Math.max(10, screenWidth * 0.013);
  const lidW = screenWidth + bezel * 2;
  const baseW = lidW * 1.075;

  return (
    <div style={{ width: baseW, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      <div
        style={{
          width: lidW,
          padding: bezel,
          paddingBottom: bezel * 1.1,
          borderRadius: `${bezel * 1.7}px ${bezel * 1.7}px ${bezel * 0.5}px ${bezel * 0.5}px`,
          background: "linear-gradient(180deg, #2A2927, #0C0C0C 22%)",
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.25)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: bezel * 0.46, left: "50%", width: 6, height: 6, marginLeft: -3, borderRadius: 99, background: "#1C2230", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }} />
        <div
          style={{
            width: screenWidth,
            height: screenH,
            position: "relative",
            overflow: "hidden",
            borderRadius: bezel * 0.5,
            background: COLORS.white,
          }}
        >
          <div style={{ width: LAPTOP_CONTENT.w, height: LAPTOP_CONTENT.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
            {children(LAPTOP_CONTENT.w, LAPTOP_CONTENT.h)}
          </div>
          <Glare at={glare} />
        </div>
      </div>
      {/* base */}
      <div
        style={{
          width: baseW,
          height: Math.max(16, screenWidth * 0.024),
          marginTop: -1,
          borderRadius: `0 0 ${screenWidth * 0.05}px ${screenWidth * 0.05}px / 0 0 ${screenWidth * 0.022}px ${screenWidth * 0.022}px`,
          background: "linear-gradient(180deg, #EEEDF0 0%, #CFCED4 55%, #A9A8AE 100%)",
          position: "relative",
          boxShadow: "0 40px 60px -28px rgba(15,15,15,0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: baseW * 0.16,
            height: Math.max(5, screenWidth * 0.008),
            marginLeft: -baseW * 0.08,
            borderRadius: "0 0 99px 99px",
            background: "linear-gradient(180deg, #A5A4AA, #C9C8CE)",
          }}
        />
      </div>
    </div>
  );
};

/** Tablet: slim silver frame, portrait. */
export const Tablet: React.FC<{
  screenWidth: number;
  children: (w: number, h: number) => ReactNode;
  glare?: number;
  style?: CSSProperties;
}> = ({ screenWidth, children, glare = 30, style }) => {
  const scale = screenWidth / TABLET_CONTENT.w;
  const screenH = TABLET_CONTENT.h * scale;
  const bezel = Math.max(10, screenWidth * 0.034);
  return (
    <div
      style={{
        width: screenWidth + bezel * 2,
        padding: bezel,
        borderRadius: bezel * 2.2,
        background: TITANIUM,
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.7), inset 0 0 0 4px rgba(15,15,15,0.06)",
        ...style,
      }}
    >
      <div
        style={{
          width: screenWidth,
          height: screenH,
          position: "relative",
          overflow: "hidden",
          borderRadius: bezel * 1.25,
          background: COLORS.white,
          boxShadow: `0 0 0 ${Math.max(5, bezel * 0.5)}px #0A0A0A`,
        }}
      >
        <div style={{ width: TABLET_CONTENT.w, height: TABLET_CONTENT.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          {children(TABLET_CONTENT.w, TABLET_CONTENT.h)}
        </div>
        <Glare at={glare} />
      </div>
    </div>
  );
};

/** Phone: titanium frame, dynamic island, status bar, side buttons. */
export const Phone: React.FC<{
  screenWidth: number;
  /** Rendered below the status bar; receives the page viewport in CSS px. */
  children: (w: number, h: number) => ReactNode;
  glare?: number;
  statusTint?: string;
  style?: CSSProperties;
}> = ({ screenWidth, children, glare = 30, statusTint = COLORS.white, style }) => {
  const scale = screenWidth / PHONE_CONTENT.w;
  const bezel = Math.max(8, screenWidth * 0.038);
  const screenH = (PHONE_CONTENT.h + PHONE_STATUS_H) * scale;
  return (
    <div
      style={{
        width: screenWidth + bezel * 2,
        padding: bezel,
        borderRadius: bezel * 5.4,
        background: TITANIUM,
        position: "relative",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.75), inset 0 0 0 3.5px rgba(15,15,15,0.07)",
        ...style,
      }}
    >
      {[
        { top: "17%", h: 0.05 },
        { top: "26%", h: 0.085 },
        { top: "36%", h: 0.085 },
      ].map((b, i) => (
        <div key={i} style={{ position: "absolute", left: -2.5, top: b.top, width: 3, height: screenH * b.h, borderRadius: 3, background: "#B7B4AD" }} />
      ))}
      <div style={{ position: "absolute", right: -2.5, top: "30%", width: 3, height: screenH * 0.12, borderRadius: 3, background: "#B7B4AD" }} />
      <div
        style={{
          width: screenWidth,
          height: screenH,
          position: "relative",
          overflow: "hidden",
          borderRadius: bezel * 4.4,
          background: COLORS.white,
          boxShadow: `0 0 0 ${Math.max(3, bezel * 0.34)}px #0A0A0A`,
        }}
      >
        <div style={{ width: PHONE_CONTENT.w, height: PHONE_CONTENT.h + PHONE_STATUS_H, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          {/* status bar */}
          <div
            style={{
              height: PHONE_STATUS_H,
              background: statusTint,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 30px 0 34px",
              fontFamily: FONTS.latin,
              fontWeight: 700,
              fontSize: 15,
              color: COLORS.ink,
              position: "relative",
              zIndex: 40,
            }}
          >
            <span>10:24</span>
            <div style={{ position: "absolute", left: "50%", top: 11, width: 112, height: 31, marginLeft: -56, borderRadius: 99, background: "#0A0A0A" }} />
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Signal size={15} strokeWidth={2.6} />
              <Wifi size={15} strokeWidth={2.6} />
              <BatteryFull size={19} strokeWidth={2.2} />
            </span>
          </div>
          <div style={{ position: "relative", width: PHONE_CONTENT.w, height: PHONE_CONTENT.h, overflow: "hidden" }}>
            {children(PHONE_CONTENT.w, PHONE_CONTENT.h)}
          </div>
        </div>
        <Glare at={glare} />
      </div>
    </div>
  );
};

export { Glare };
