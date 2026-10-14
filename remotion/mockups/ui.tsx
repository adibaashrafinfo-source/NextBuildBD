import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONTS } from "../theme";

/**
 * Shared primitives for the website mockups rendered inside the browser and
 * device frames. Body copy is represented as skeleton bars (the way a real
 * design mockup reads) while navigation, buttons and section titles use real,
 * legible labels.
 */

export const Bar: React.FC<{
  w: number | string;
  h?: number;
  color?: string;
  radius?: number;
  style?: CSSProperties;
}> = ({ w, h = 10, color = "#DFDED8", radius = 999, style }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      background: color,
      flexShrink: 0,
      ...style,
    }}
  />
);

export const Stack: React.FC<{
  gap?: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ gap = 12, children, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
    {children}
  </div>
);

export const Row: React.FC<{
  gap?: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ gap = 12, children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap, ...style }}>
    {children}
  </div>
);

export const Label: React.FC<{
  children: ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  spacing?: string;
  style?: CSSProperties;
}> = ({
  children,
  size = 15,
  weight = 600,
  color = COLORS.inkSoft,
  spacing = "0",
  style,
}) => (
  <span
    style={{
      fontFamily: FONTS.body,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: spacing,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

export const Pill: React.FC<{
  children: ReactNode;
  tone?: "orange" | "ink" | "ghost" | "white";
  size?: number;
  style?: CSSProperties;
}> = ({ children, tone = "orange", size = 15, style }) => {
  const tones: Record<string, CSSProperties> = {
    orange: {
      background: `linear-gradient(180deg, ${COLORS.orangeSoft} -40%, ${COLORS.orange} 55%, ${COLORS.orangeDeep} 170%)`,
      color: COLORS.white,
      boxShadow: "0 8px 18px -8px rgba(241,89,34,0.6)",
    },
    ink: { background: COLORS.ink, color: COLORS.white },
    ghost: {
      background: "transparent",
      color: COLORS.inkSoft,
      boxShadow: `inset 0 0 0 1.5px ${COLORS.line}`,
    },
    white: {
      background: COLORS.white,
      color: COLORS.ink,
      boxShadow: "0 8px 18px -10px rgba(17,17,17,0.35)",
    },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${size * 0.72}px ${size * 1.5}px`,
        borderRadius: 999,
        fontFamily: FONTS.body,
        fontSize: size,
        fontWeight: 650,
        letterSpacing: "0.005em",
        whiteSpace: "nowrap",
        ...tones[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Abstract product / media block — a soft gradient with a geometric motif. */
export const MediaBlock: React.FC<{
  w?: number | string;
  h: number;
  radius?: number;
  variant?: number;
  style?: CSSProperties;
}> = ({ w = "100%", h, radius = 18, variant = 0, style }) => {
  const palettes = [
    ["#F6F5F1", "#E7E5DD"],
    ["#FDEDE6", "#F9D6C6"],
    ["#F1F1EE", "#E2E1DA"],
    ["#FFF2EB", "#FAD9C9"],
  ];
  const [a, b] = palettes[variant % palettes.length];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${a} 0%, ${b} 100%)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "16%",
          bottom: "-18%",
          width: "58%",
          height: "72%",
          borderRadius: "50% 50% 44% 44%",
          background: "rgba(255,255,255,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "14%",
          top: "16%",
          width: "22%",
          height: "22%",
          borderRadius: 999,
          background:
            variant % 2 === 0 ? "rgba(241,89,34,0.22)" : "rgba(17,17,17,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 46%)",
        }}
      />
    </div>
  );
};

export const CardShell: React.FC<{
  children: ReactNode;
  pad?: number;
  radius?: number;
  style?: CSSProperties;
}> = ({ children, pad = 26, radius = 22, style }) => (
  <div
    style={{
      background: COLORS.white,
      borderRadius: radius,
      padding: pad,
      boxShadow:
        "0 18px 40px -26px rgba(17,17,17,0.22), 0 1px 0 rgba(17,17,17,0.035)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Neutral placeholder brand mark for the mockup sites (not the Abrar IT logo). */
export const MockMark: React.FC<{ size?: number; tone?: "ink" | "orange" }> = ({
  size = 30,
  tone = "ink",
}) => (
  <Row gap={10}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: tone === "ink" ? COLORS.ink : COLORS.orange,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: size * 0.26,
          top: -size * 0.2,
          width: size * 0.2,
          height: size * 1.5,
          background: COLORS.white,
          transform: "rotate(22deg)",
        }}
      />
    </div>
    <Bar w={size * 2.1} h={size * 0.3} color="#DAD8D1" />
  </Row>
);

/** Simple polyline chart used in the web-app dashboard mockup. */
export const LineChart: React.FC<{
  w: number;
  h: number;
  points: readonly number[];
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}> = ({ w, h, points, color = COLORS.orange, fill = true, strokeWidth = 3 }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h * 0.82) - h * 0.09;
    return [x, y] as const;
  });
  const d = coords
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const [px, py] = coords[i - 1];
      const cx = (px + x) / 2;
      return `C${cx.toFixed(1)},${py.toFixed(1)} ${cx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const id = `chart-${color.replace("#", "")}-${points.length}`;
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.26" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? (
        <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BarChart: React.FC<{
  w: number;
  h: number;
  values: readonly number[];
  color?: string;
}> = ({ w, h, values, color = COLORS.ink }) => {
  const max = Math.max(...values);
  const gap = w * 0.028;
  const bw = (w - gap * (values.length - 1)) / values.length;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {values.map((v, i) => {
        const bh = (v / max) * h;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={h - bh}
            width={bw}
            height={bh}
            rx={Math.min(6, bw / 2)}
            fill={i === values.length - 2 ? COLORS.orange : color}
            opacity={i === values.length - 2 ? 1 : 0.16}
          />
        );
      })}
    </svg>
  );
};
