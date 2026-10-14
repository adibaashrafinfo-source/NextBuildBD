import { COLORS } from "../theme";

export type ProductKind = "perfume" | "watch" | "bag" | "headphones" | "vase" | "lamp";

const Floor: React.FC = () => (
  <ellipse cx="150" cy="268" rx="82" ry="11" fill="rgba(15,15,15,0.14)" />
);

/**
 * Product renders for the e-commerce mockup. Each is a small piece of
 * studio-lit SVG: gradient materials, a specular edge and a contact shadow,
 * so the store reads as photographed stock rather than icons.
 */
export const ProductArt: React.FC<{ kind: ProductKind }> = ({ kind }) => {
  const k = `p-${kind}`;
  return (
    <svg viewBox="0 0 300 300" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`${k}-ink`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B3937" />
          <stop offset="0.5" stopColor="#161514" />
          <stop offset="1" stopColor="#0A0A0A" />
        </linearGradient>
        <linearGradient id={`${k}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#FFF3EC" />
          <stop offset="1" stopColor="#F4D9CB" />
        </linearGradient>
        <linearGradient id={`${k}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA06E" />
          <stop offset="1" stopColor={COLORS.orange} />
        </linearGradient>
        <linearGradient id={`${k}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.4" stopColor="#D9D6D0" />
          <stop offset="0.7" stopColor="#F3F1ED" />
          <stop offset="1" stopColor="#A9A59D" />
        </linearGradient>
        <linearGradient id={`${k}-orange`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A5C" />
          <stop offset="0.55" stopColor={COLORS.orange} />
          <stop offset="1" stopColor={COLORS.orangeDeep} />
        </linearGradient>
        <linearGradient id={`${k}-cream`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EFD9CB" />
        </linearGradient>
        <radialGradient id={`${k}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFB07F" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFB07F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Floor />

      {kind === "perfume" && (
        <g>
          <rect x="98" y="112" width="104" height="150" rx="20" fill={`url(#${k}-glass)`} />
          <rect x="108" y="150" width="84" height="104" rx="12" fill={`url(#${k}-liquid)`} opacity="0.92" />
          <rect x="120" y="178" width="60" height="38" rx="4" fill="#FFFFFF" opacity="0.94" />
          <rect x="128" y="188" width="44" height="4" rx="2" fill="#0F0F0F" />
          <rect x="136" y="198" width="28" height="3" rx="1.5" fill="#B9B5AD" />
          <rect x="136" y="98" width="28" height="18" fill={`url(#${k}-metal)`} />
          <rect x="122" y="52" width="56" height="52" rx="8" fill={`url(#${k}-ink)`} />
          <rect x="122" y="52" width="56" height="5" rx="2.5" fill="rgba(255,255,255,0.28)" />
          <rect x="108" y="122" width="9" height="124" rx="4.5" fill="#FFFFFF" opacity="0.65" />
        </g>
      )}

      {kind === "watch" && (
        <g>
          <rect x="124" y="22" width="52" height="96" rx="16" fill={`url(#${k}-ink)`} />
          <rect x="124" y="182" width="52" height="96" rx="16" fill={`url(#${k}-ink)`} />
          <rect x="203" y="140" width="14" height="22" rx="4" fill={`url(#${k}-metal)`} />
          <circle cx="150" cy="150" r="62" fill={`url(#${k}-metal)`} />
          <circle cx="150" cy="150" r="52" fill="#161514" />
          <circle cx="150" cy="150" r="48" fill="#FBF7F2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = i % 3 === 0 ? 38 : 41;
            return (
              <line
                key={i}
                x1={150 + Math.sin(a) * r1}
                y1={150 - Math.cos(a) * r1}
                x2={150 + Math.sin(a) * 45}
                y2={150 - Math.cos(a) * 45}
                stroke="#161514"
                strokeWidth={i % 3 === 0 ? 3 : 1.6}
                strokeLinecap="round"
              />
            );
          })}
          <line x1="150" y1="150" x2="150" y2="118" stroke="#161514" strokeWidth="4" strokeLinecap="round" />
          <line x1="150" y1="150" x2="172" y2="160" stroke="#161514" strokeWidth="4" strokeLinecap="round" />
          <line x1="150" y1="158" x2="138" y2="124" stroke={COLORS.orange} strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="150" r="4.5" fill={COLORS.orange} />
          <path d="M104 118 A58 58 0 0 1 150 92" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {kind === "bag" && (
        <g>
          <path d="M104 126 C104 44 196 44 196 126" stroke="#161514" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M66 124 L234 124 L252 250 Q254 266 238 266 L62 266 Q46 266 48 250 Z" fill={`url(#${k}-orange)`} />
          <path d="M66 124 L234 124 L226 166 Q150 198 74 166 Z" fill="rgba(120,36,8,0.34)" />
          <path d="M66 124 L234 124" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
          <circle cx="150" cy="176" r="9" fill={`url(#${k}-metal)`} />
          <rect x="60" y="130" width="12" height="130" rx="6" fill="#FFFFFF" opacity="0.2" />
        </g>
      )}

      {kind === "headphones" && (
        <g>
          <path d="M74 176 C74 54 226 54 226 176" stroke={`url(#${k}-ink)`} strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M82 150 C90 80 210 80 218 150" stroke="rgba(255,255,255,0.22)" strokeWidth="3" fill="none" />
          <rect x="50" y="150" width="52" height="92" rx="26" fill={`url(#${k}-ink)`} />
          <rect x="198" y="150" width="52" height="92" rx="26" fill={`url(#${k}-ink)`} />
          <circle cx="76" cy="196" r="14" fill="none" stroke={COLORS.orange} strokeWidth="4" />
          <circle cx="224" cy="196" r="14" fill="none" stroke={COLORS.orange} strokeWidth="4" />
          <rect x="56" y="156" width="8" height="80" rx="4" fill="#FFFFFF" opacity="0.2" />
          <rect x="206" y="156" width="8" height="80" rx="4" fill="#FFFFFF" opacity="0.2" />
        </g>
      )}

      {kind === "vase" && (
        <g>
          <path d="M140 150 C132 100 110 76 100 52" stroke="#2B2A28" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M152 150 C156 92 168 66 184 40" stroke="#2B2A28" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M162 152 C176 112 206 92 226 84" stroke="#2B2A28" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="52" r="11" fill={COLORS.orange} />
          <circle cx="184" cy="40" r="13" fill={COLORS.orangeSoft} />
          <circle cx="226" cy="84" r="10" fill={COLORS.orange} />
          <circle cx="100" cy="52" r="4" fill="#FFE4D4" />
          <circle cx="184" cy="40" r="5" fill="#FFE4D4" />
          <path
            d="M122 146 L178 146 C178 176 216 192 216 220 C216 252 188 266 150 266 C112 266 84 252 84 220 C84 192 122 176 122 146 Z"
            fill={`url(#${k}-cream)`}
          />
          <path d="M96 212 C96 190 122 178 128 160" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="150" cy="146" rx="28" ry="5" fill="#D9BFAE" />
        </g>
      )}

      {kind === "lamp" && (
        <g>
          <ellipse cx="150" cy="170" rx="96" ry="84" fill={`url(#${k}-glow)`} />
          <rect x="145" y="150" width="10" height="94" fill={`url(#${k}-metal)`} />
          <ellipse cx="150" cy="248" rx="46" ry="11" fill={`url(#${k}-ink)`} />
          <path d="M98 84 L202 84 L232 156 L68 156 Z" fill={`url(#${k}-cream)`} />
          <path d="M98 84 L202 84 L206 94 L94 94 Z" fill="rgba(255,255,255,0.8)" />
          <path d="M112 92 L96 150" stroke="rgba(255,255,255,0.85)" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="150" cy="156" rx="82" ry="9" fill="rgba(241,89,34,0.24)" />
        </g>
      )}
    </svg>
  );
};

export const PRODUCTS: ReadonlyArray<{
  kind: ProductKind;
  name: string;
  price: string;
  tint: string;
}> = [
  { kind: "perfume", name: "প্রিমিয়াম পারফিউম", price: "৳২,৮৫০", tint: "#FFEDE5" },
  { kind: "watch", name: "ক্লাসিক ঘড়ি", price: "৳৪,৫০০", tint: "#F3F2EE" },
  { kind: "bag", name: "লেদার হ্যান্ডব্যাগ", price: "৳৩,২০০", tint: "#F3F2EE" },
  { kind: "headphones", name: "ওয়্যারলেস হেডফোন", price: "৳৩,৯৯০", tint: "#FFEDE5" },
  { kind: "vase", name: "সিরামিক ফুলদানি", price: "৳১,৪৫০", tint: "#FFEDE5" },
  { kind: "lamp", name: "টেবিল ল্যাম্প", price: "৳২,১০০", tint: "#F3F2EE" },
  { kind: "perfume", name: "আতর কালেকশন", price: "৳১,৯৫০", tint: "#F3F2EE" },
  { kind: "watch", name: "স্মার্ট ঘড়ি", price: "৳৬,২০০", tint: "#FFEDE5" },
];
