import type { CSSProperties, ReactNode } from "react";
import { COLORS, SHADOWS } from "../theme";

/** A tablet shell: rounded aluminium frame, thin bezel, no browser chrome. */
export const TabletFrame: React.FC<{
  width: number;
  height: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ width, height, children, style }) => {
  const bezel = Math.round(width * 0.028);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.055,
        padding: bezel,
        background: "linear-gradient(150deg, #FFFFFF 0%, #ECEBE6 48%, #FDFDFC 100%)",
        boxShadow: `${SHADOWS.float}, inset 0 0 0 1px rgba(17,17,17,0.08)`,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.038,
          overflow: "hidden",
          background: COLORS.white,
          boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.07)",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** A smartphone shell with notch and side button. */
export const PhoneFrame: React.FC<{
  width: number;
  height: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ width, height, children, style }) => {
  const bezel = Math.round(width * 0.042);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.155,
        padding: bezel,
        background: "linear-gradient(152deg, #FFFFFF 0%, #E9E8E3 46%, #FDFDFC 100%)",
        boxShadow: `${SHADOWS.float}, inset 0 0 0 1px rgba(17,17,17,0.10)`,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -2,
          top: "26%",
          width: 3,
          height: height * 0.09,
          borderRadius: 999,
          background: "#DBDAD4",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.115,
          overflow: "hidden",
          background: COLORS.white,
          boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.07)",
          position: "relative",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.38,
            height: width * 0.085,
            borderRadius: `0 0 ${width * 0.06}px ${width * 0.06}px`,
            background: COLORS.ink,
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

/** Layout helper: positions a device in the 3D showcase with parallax depth. */
export const DeviceSlot: React.FC<{
  children: ReactNode;
  x: number;
  y: number;
  z?: number;
  rotateY?: number;
  rotateX?: number;
  scale?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ children, x, y, z = 0, rotateY = 0, rotateX = 0, scale = 1, opacity = 1, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate3d(-50%, -50%, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      transformStyle: "preserve-3d",
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);
