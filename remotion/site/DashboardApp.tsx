import {
  Bell,
  BarChart3,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
} from "lucide-react";
import { clamp01 } from "../anim";
import { COLORS, EASE, FONTS } from "../theme";
import { bnNumber, taka, toBn } from "./format";
import { BrandMark } from "./ui";

export type DashboardAppProps = {
  width: number;
  height: number;
  /** 0..1 — everything counts up, draws and staggers in as this advances. */
  p?: number;
  /** 0..1 — chart tooltip. */
  tip?: number;
};

const NAV = [
  { icon: LayoutDashboard, label: "ওভারভিউ" },
  { icon: ShoppingCart, label: "অর্ডার" },
  { icon: Package, label: "পণ্য" },
  { icon: Users, label: "কাস্টমার" },
  { icon: BarChart3, label: "রিপোর্ট" },
  { icon: Settings, label: "সেটিংস" },
];

const KPIS = [
  { icon: TrendingUp, label: "আজকের বিক্রি", value: 45200, money: true, spark: [12, 18, 14, 22, 19, 28, 25, 34] },
  { icon: ShoppingCart, label: "নতুন অর্ডার", value: 38, spark: [8, 11, 9, 14, 16, 15, 21, 24] },
  { icon: UserPlus, label: "নতুন কাস্টমার", value: 12, spark: [4, 6, 5, 9, 7, 8, 11, 10] },
  { icon: Truck, label: "ডেলিভারি বাকি", value: 9, spark: [14, 12, 15, 11, 13, 9, 10, 8] },
];

const SERIES = [22, 31, 27, 38, 34, 46, 41, 53, 49, 61, 57, 72];

const ROWS = [
  { id: 1024, name: "ফাহিমা আক্তার", item: "ক্লাসিক ঘড়ি", status: "ডেলিভারড", amount: 4500 },
  { id: 1025, name: "রাকিবুল ইসলাম", item: "ওয়্যারলেস হেডফোন", status: "প্রক্রিয়াধীন", amount: 3990 },
  { id: 1026, name: "তানজিলা সুলতানা", item: "প্রিমিয়াম পারফিউম", status: "পেন্ডিং", amount: 2850 },
  { id: 1027, name: "মাহমুদ হাসান", item: "লেদার হ্যান্ডব্যাগ", status: "ডেলিভারড", amount: 3200 },
];

const STATUS: Record<string, { bg: string; fg: string }> = {
  ডেলিভারড: { bg: "#E6F4EA", fg: "#1E7B3E" },
  প্রক্রিয়াধীন: { bg: COLORS.peach, fg: COLORS.orangeDeep },
  পেন্ডিং: { bg: "#F1EFEA", fg: "#6C6A63" },
};

const win = (p: number, at: number, len = 0.3) => EASE.out(clamp01((p - at) / len));

const Spark: React.FC<{ pts: number[]; w: number; h: number; draw: number; hot?: boolean }> = ({ pts, w, h, draw, hot }) => {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 8) - 4] as const);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <path d={d} fill="none" stroke={hot ? COLORS.orange : "#BDBAB2"} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    </svg>
  );
};

/** A custom web-app dashboard: counters, a drawn chart, donut and an orders table. */
export const DashboardApp: React.FC<DashboardAppProps> = ({ width, height, p = 1, tip = 0 }) => {
  // Main chart geometry
  const CW = 640;
  const CH = 232;
  const max = 80;
  const pts = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * CW, CH - (v / max) * CH] as const);
  const line = pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      return `C${cx.toFixed(1)},${py.toFixed(1)} ${cx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const drawP = win(p, 0.22, 0.5);
  const tipPt = pts[9];

  return (
    <div style={{ width, height, display: "flex", background: COLORS.mist, fontFamily: FONTS.ui, color: COLORS.ink, overflow: "hidden" }}>
      {/* sidebar */}
      <div style={{ width: 268, background: COLORS.white, padding: "30px 22px", display: "flex", flexDirection: "column", borderRight: `1px solid ${COLORS.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px" }}>
          <BrandMark />
          <span style={{ fontFamily: FONTS.latin, fontWeight: 800, fontSize: 22 }}>Biz Hub</span>
        </div>
        <div style={{ marginTop: 38, display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV.map((n, i) => {
            const Icon = n.icon;
            return (
              <div
                key={n.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 16,
                  fontSize: 17,
                  fontWeight: i === 0 ? 700 : 500,
                  background: i === 0 ? COLORS.peach : "transparent",
                  color: i === 0 ? COLORS.orangeDeep : COLORS.muted,
                }}
              >
                <Icon size={21} />
                {n.label}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, background: COLORS.mist }}>
          <div style={{ width: 42, height: 42, borderRadius: 99, background: `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.display, fontSize: 19 }}>র</div>
          <div style={{ lineHeight: 1.35 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>রাকিব হাসান</div>
            <div style={{ fontSize: 13.5, color: COLORS.muted }}>অ্যাডমিন</div>
          </div>
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, padding: "28px 36px", display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: win(p, 0, 0.2) }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 34, lineHeight: 1.3 }}>স্বাগতম, রাকিব</div>
            <div style={{ fontSize: 16, color: COLORS.muted }}>বুধবার, {toBn(14)} অক্টোবর</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 300, height: 48, borderRadius: 99, background: COLORS.white, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontSize: 16, color: COLORS.muted }}>
              <Search size={19} /> অর্ডার খুঁজুন...
            </div>
            <div style={{ position: "relative", width: 48, height: 48, borderRadius: 99, background: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={21} />
              <span style={{ position: "absolute", top: 11, right: 12, width: 10, height: 10, borderRadius: 99, background: COLORS.orange, border: "2px solid #fff" }} />
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {KPIS.map((k, i) => {
            const Icon = k.icon;
            const e = win(p, 0.06 + i * 0.07, 0.3);
            const v = k.value * win(p, 0.1 + i * 0.07, 0.45);
            return (
              <div key={k.label} style={{ background: COLORS.white, borderRadius: 24, padding: "22px 24px", opacity: e, transform: `translateY(${(1 - e) * 26}px)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: COLORS.muted }}>{k.label}</span>
                  <span style={{ width: 38, height: 38, borderRadius: 12, background: i === 0 ? COLORS.orange : COLORS.peach, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={19} color={i === 0 ? "#fff" : COLORS.orange} />
                  </span>
                </div>
                <div style={{ marginTop: 12, fontFamily: FONTS.display, fontWeight: 800, fontSize: 38, lineHeight: 1.2 }}>
                  {k.money ? taka(v) : bnNumber(v)}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Spark pts={k.spark} w={190} h={38} draw={win(p, 0.2 + i * 0.07, 0.45)} hot={i === 0} />
                </div>
              </div>
            );
          })}
        </div>

        {/* chart + donut */}
        <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: 18 }}>
          <div style={{ background: COLORS.white, borderRadius: 26, padding: "24px 28px", opacity: win(p, 0.2, 0.3) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 22 }}>বিক্রির প্রবণতা</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["সপ্তাহ", "মাস", "বছর"].map((t, i) => (
                  <span key={t} style={{ padding: "6px 16px", borderRadius: 99, fontSize: 14.5, fontWeight: 600, background: i === 1 ? COLORS.ink : "transparent", color: i === 1 ? "#fff" : COLORS.muted }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", marginTop: 22, height: CH + 30 }}>
              {[0, 1, 2, 3].map((g) => (
                <div key={g} style={{ position: "absolute", left: 0, right: 0, top: (g / 3) * CH, borderTop: `1px dashed ${COLORS.line}` }} />
              ))}
              <svg width="100%" height={CH + 30} viewBox={`0 0 ${CW} ${CH + 30}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <defs>
                  <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={COLORS.orange} stopOpacity="0.28" />
                    <stop offset="1" stopColor={COLORS.orange} stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="dash-clip">
                    <rect x="0" y="-20" width={CW * drawP} height={CH + 60} />
                  </clipPath>
                </defs>
                <g clipPath="url(#dash-clip)">
                  <path d={`${line} L${CW},${CH} L0,${CH} Z`} fill="url(#dash-area)" />
                  <path d={line} fill="none" stroke={COLORS.orange} strokeWidth={4} strokeLinecap="round" />
                </g>
                {tip > 0.01 ? (
                  <g opacity={tip}>
                    <line x1={tipPt[0]} y1={tipPt[1]} x2={tipPt[0]} y2={CH} stroke={COLORS.orange} strokeWidth={1.5} strokeDasharray="4 4" />
                    <circle cx={tipPt[0]} cy={tipPt[1]} r={9} fill="#fff" stroke={COLORS.orange} strokeWidth={4} />
                  </g>
                ) : null}
              </svg>
              {tip > 0.01 ? (
                <div style={{ position: "absolute", left: `${(tipPt[0] / CW) * 100}%`, top: tipPt[1] - 66, transform: `translate(-50%, ${(1 - tip) * 8}px)`, opacity: tip, padding: "9px 16px", borderRadius: 14, background: COLORS.ink, color: "#fff", fontSize: 15.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {taka(52400)}
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 26, padding: "24px 26px", opacity: win(p, 0.26, 0.3) }}>
            <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 22 }}>বিক্রির উৎস</span>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 170, height: 170 }}>
                <svg width="170" height="170" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke={COLORS.mist} strokeWidth="6" />
                  {[
                    { len: 46, off: 0, c: COLORS.orange },
                    { len: 30, off: 46, c: COLORS.ink },
                    { len: 24, off: 76, c: "#D9D6CE" },
                  ].map((s, i) => (
                    <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={s.c} strokeWidth="6" strokeDasharray={`${s.len * win(p, 0.3, 0.45)} 100`} strokeDashoffset={-s.off} />
                  ))}
                </svg>
              </div>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["ওয়েবসাইট", COLORS.orange],
                ["ফেসবুক", COLORS.ink],
                ["সরাসরি", "#D9D6CE"],
              ].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15.5, color: COLORS.inkSoft }}>
                  <span style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* orders */}
        <div style={{ background: COLORS.white, borderRadius: 26, padding: "24px 28px", opacity: win(p, 0.34, 0.3) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 22 }}>সাম্প্রতিক অর্ডার</span>
            <span style={{ fontSize: 15.5, fontWeight: 600, color: COLORS.orange }}>সব দেখুন</span>
          </div>
          <div style={{ marginTop: 14 }}>
            {ROWS.map((r, i) => {
              const e = win(p, 0.4 + i * 0.07, 0.25);
              const st = STATUS[r.status];
              return (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.7fr 1.4fr 1.5fr 1fr 0.9fr",
                    alignItems: "center",
                    padding: "14px 0",
                    borderTop: `1px solid ${COLORS.line}`,
                    fontSize: 16,
                    opacity: e,
                    transform: `translateX(${(1 - e) * -24}px)`,
                  }}
                >
                  <span style={{ fontWeight: 700, color: COLORS.inkSoft }}>#{toBn(r.id)}</span>
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: COLORS.muted }}>{r.item}</span>
                  <span>
                    <span style={{ padding: "6px 14px", borderRadius: 99, fontSize: 14, fontWeight: 700, background: st.bg, color: st.fg }}>{r.status}</span>
                  </span>
                  <span style={{ fontWeight: 800, textAlign: "right", fontFamily: FONTS.display, fontSize: 18 }}>{taka(r.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
