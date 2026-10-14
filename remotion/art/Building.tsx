import { COLORS } from "../theme";

/**
 * Stylised architectural render used as the hero and project imagery in the
 * property-developer mockup. Pure SVG: layered glass towers on a warm sky, with
 * ribbon-window facades so it reads as a finished render, not a placeholder.
 */
const SKY: Array<[string, string, string]> = [
  ["#FFE3D4", "#FFF4EC", "#FFFFFF"],
  ["#E9E7E2", "#F6F5F1", "#FFFFFF"],
  ["#FFCDB4", "#FFEBDF", "#FFFFFF"],
];

const Tower: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  floors: number;
  tint?: string;
  bands?: boolean;
  accent?: boolean;
}> = ({ id, x, y, w, floors, bands = true, accent = false }) => {
  const floorH = 26;
  const h = floors * floorH + 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-body)`} />
      <rect x={x + w - 14} y={y} width={14} height={h} fill="rgba(15,15,15,0.07)" />
      {/* Rooftop plant room */}
      <rect x={x + w * 0.2} y={y - 14} width={w * 0.34} height={14} fill={`url(#${id}-body)`} />
      <rect x={x + w * 0.2} y={y - 14} width={w * 0.34} height={3} fill="rgba(255,255,255,0.9)" />
      {Array.from({ length: floors }).map((_, i) => {
        const fy = y + 12 + i * floorH;
        return (
          <g key={i}>
            {bands ? (
              <rect x={x + 10} y={fy} width={w - 34} height={15} rx={1.5} fill={`url(#${id}-glass)`} />
            ) : (
              Array.from({ length: Math.max(2, Math.floor((w - 30) / 30)) }).map((__, c) => (
                <rect
                  key={c}
                  x={x + 12 + c * 30}
                  y={fy}
                  width={20}
                  height={15}
                  rx={1.5}
                  fill={`url(#${id}-glass)`}
                />
              ))
            )}
            <rect x={x} y={fy + 17} width={w} height={2.4} fill="rgba(255,255,255,0.85)" />
          </g>
        );
      })}
      {/* Mullions */}
      {bands
        ? Array.from({ length: Math.floor((w - 30) / 46) }).map((_, i) => (
            <rect
              key={i}
              x={x + 40 + i * 46}
              y={y + 10}
              width={2.2}
              height={h - 14}
              fill="rgba(247,245,241,0.95)"
            />
          ))
        : null}
      {accent ? (
        <rect x={x + w - 26} y={y} width={12} height={h} fill={COLORS.orange} opacity={0.92} />
      ) : null}
    </g>
  );
};

export const BuildingArt: React.FC<{ variant?: number; style?: React.CSSProperties }> = ({
  variant = 0,
  style,
}) => {
  const id = `bld${variant}`;
  const [s0, s1, s2] = SKY[variant % SKY.length];
  const shift = variant === 1 ? 26 : variant === 2 ? -22 : 0;

  return (
    <svg
      viewBox="0 0 640 720"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s0} />
          <stop offset="0.55" stopColor={s1} />
          <stop offset="1" stopColor={s2} />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF7A3D" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FF9A66" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FF9A66" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#F1EEE9" />
          <stop offset="1" stopColor="#DAD6CE" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A3836" />
          <stop offset="0.55" stopColor="#1B1A19" />
          <stop offset="1" stopColor="#7A3A22" />
        </linearGradient>
        <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EADFD6" />
          <stop offset="1" stopColor="#F6F0EA" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7E2D9" />
          <stop offset="1" stopColor="#F8F6F2" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="640" height="720" fill={`url(#${id}-sky)`} />
      <circle cx={470 + shift} cy={190} r={190} fill={`url(#${id}-sun)`} />

      {/* distant skyline */}
      <g fill={`url(#${id}-far)`}>
        {[
          [0, 430, 70],
          [64, 400, 54],
          [112, 450, 80],
          [196, 380, 46],
          [430, 410, 60],
          [486, 360, 52],
          [534, 420, 70],
          [596, 390, 60],
        ].map(([x, y, w], i) => (
          <rect key={i} x={x} y={y} width={w} height={600 - y} />
        ))}
      </g>

      <Tower id={id} x={72} y={300} w={128} floors={11} bands={false} accent />
      <Tower id={id} x={398} y={350} w={164} floors={9} />
      <Tower id={id} x={198} y={104 + (variant === 1 ? 40 : 0)} w={206} floors={variant === 1 ? 17 : 19} />

      {/* ground */}
      <rect x="0" y="600" width="640" height="120" fill={`url(#${id}-ground)`} />
      <rect x="0" y="600" width="640" height="3" fill="rgba(255,255,255,0.9)" />
      <ellipse cx="300" cy="606" rx="300" ry="14" fill="rgba(15,15,15,0.10)" />
      <rect x="0" y="656" width="640" height="2" fill="rgba(15,15,15,0.05)" />

      {/* trees */}
      {[
        [48, 612],
        [96, 618],
        [546, 614],
        [598, 620],
        [372, 622],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 2} y={y} width="4" height="22" fill="#5B5750" />
          <circle cx={x} cy={y - 6} r={20} fill="#D9D3C8" />
          <circle cx={x - 9} cy={y + 2} r={14} fill="#CFC8BB" />
          <circle cx={x + 10} cy={y - 2} r={15} fill="#E3DED4" />
        </g>
      ))}

      {/* warm window glow on the lower floors */}
      <rect x="198" y="470" width="206" height="120" fill="#FF7A3D" opacity="0.05" />

      <rect width="640" height="720" fill={`url(#${id}-sheen)`} />
    </svg>
  );
};
