import {
  Armchair,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Home,
  MapPin,
  Menu,
} from "lucide-react";
import { BuildingArt } from "../art/Building";
import { COLORS, FONTS, SHADOWS } from "../theme";
import { clamp01 } from "../anim";
import { Reveal, ScrollPage } from "./scroll";
import { BrandMark, Btn, Chip } from "./ui";

export type CorporateSiteProps = {
  /** Viewport size in CSS px. The layout reflows to whatever width it is given. */
  width: number;
  height: number;
  scroll?: number;
  /** 0..1 — staggered page-load entrance of the hero. 1 disables it. */
  intro?: number;
  ctaHover?: number;
  navHover?: number;
  cardHover?: number;
  menuOpen?: number;
};

const NAV = ["হোম", "প্রকল্পসমূহ", "সেবা", "আমাদের সম্পর্কে"];

const SERVICES = [
  {
    icon: Home,
    title: "আবাসিক ভবন",
    text: "পরিবারের প্রয়োজন ও জীবনযাত্রা মাথায় রেখে আধুনিক আবাসিক নকশা ও নির্মাণ।",
  },
  {
    icon: Building2,
    title: "বাণিজ্যিক প্রকল্প",
    text: "অফিস, শোরুম ও বাণিজ্যিক ভবনের জন্য কার্যকর ও দৃষ্টিনন্দন সমাধান।",
  },
  {
    icon: Armchair,
    title: "ইন্টেরিয়র ডিজাইন",
    text: "আপনার রুচি অনুযায়ী প্রতিটি কোণ সাজানোর পূর্ণাঙ্গ ইন্টেরিয়র সেবা।",
  },
];

const PROJECTS = [
  { name: "রিভারভিউ রেসিডেন্স", place: "মিরপুর, ঢাকা" },
  { name: "স্কাই প্লাজা", place: "গুলশান, ঢাকা" },
  { name: "গ্রিন কোর্ট", place: "বসুন্ধরা, ঢাকা" },
];

/** Window of a 0..1 progress that starts at `at` and takes `len`. */
const stage = (p: number, at: number, len = 0.4) => clamp01((p - at) / len);

/** A responsive property-developer website, drawn entirely in CSS/SVG. */
export const CorporateSite: React.FC<CorporateSiteProps> = ({
  width,
  height,
  scroll = 0,
  intro = 1,
  ctaHover = 0,
  navHover = 0,
  cardHover = 0,
  menuOpen = 0,
}) => {
  const bp = width >= 1080 ? "lg" : width >= 620 ? "md" : "sm";
  const pad = bp === "lg" ? 72 : bp === "md" ? 44 : 22;
  const headerH = bp === "lg" ? 84 : bp === "md" ? 76 : 64;
  const pick = <T,>(lg: T, md: T, sm: T) => (bp === "lg" ? lg : bp === "md" ? md : sm);
  const scrolled = clamp01(scroll / 70);

  const introStyle = (i: number) => {
    const p = stage(intro, i * 0.1, 0.45);
    const e = 1 - Math.pow(1 - p, 3);
    return {
      opacity: e,
      transform: `translate3d(0, ${(1 - e) * 26}px, 0)`,
    } as const;
  };

  const h1 = pick(76, 64, 42);
  const sectionPad = pick(104, 80, 56);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        background: COLORS.white,
        fontFamily: FONTS.ui,
        color: COLORS.ink,
      }}
    >
      <ScrollPage scroll={scroll} viewH={height} width={width}>
        {/* ================= HERO ================= */}
        <section
          style={{
            padding: `${headerH + pick(52, 36, 24)}px ${pad}px ${pick(96, 64, 48)}px`,
            display: "flex",
            flexDirection: bp === "lg" ? "row" : "column",
            alignItems: bp === "lg" ? "center" : "stretch",
            gap: pick(64, 44, 32),
          }}
        >
          <div style={{ flex: bp === "lg" ? "0 0 52%" : undefined }}>
            <div style={introStyle(1)}>
              <Chip icon={<span style={{ width: 8, height: 8, borderRadius: 99, background: COLORS.orange }} />}>
                নতুন প্রকল্প উন্মোচন
              </Chip>
            </div>
            <h1
              style={{
                ...introStyle(2),
                margin: `${pick(26, 22, 18)}px 0 0`,
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: h1,
                lineHeight: 1.2,
                color: COLORS.ink,
              }}
            >
              স্বপ্নের ঠিকানা
              <br />
              <span style={{ color: COLORS.orange }}>এখন আরও কাছে</span>
            </h1>
            <p
              style={{
                ...introStyle(3),
                margin: `${pick(26, 22, 18)}px 0 0`,
                maxWidth: 560,
                fontSize: pick(21, 20, 17),
                lineHeight: 1.7,
                color: COLORS.muted,
              }}
            >
              আধুনিক নকশা, মানসম্মত নির্মাণ ও নির্ভরযোগ্য সেবায় গড়ে তুলুন আপনার পছন্দের বাড়ি।
            </p>
            <div
              style={{
                ...introStyle(4),
                marginTop: pick(36, 30, 26),
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <Btn size={pick(18, 17, 16)} hover={ctaHover} icon={<ArrowRight size={pick(20, 19, 18)} />}>
                প্রকল্প দেখুন
              </Btn>
              <Btn tone="ghost" size={pick(18, 17, 16)}>
                ফ্রি পরামর্শ নিন
              </Btn>
            </div>
            <div
              style={{
                ...introStyle(5),
                marginTop: pick(40, 34, 28),
                display: "flex",
                flexWrap: "wrap",
                gap: pick("14px 30px", "12px 26px", "10px 22px"),
              }}
            >
              {["আধুনিক নকশা", "মানসম্মত উপকরণ", "নির্ভরযোগ্য সেবা"].map((t) => (
                <span
                  key={t}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: pick(17, 16, 15), fontWeight: 500, color: COLORS.inkSoft }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 99,
                      background: COLORS.peach,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={13} color={COLORS.orange} strokeWidth={3} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, ...introStyle(3), position: "relative" }}>
            <div
              style={{
                height: pick(620, 460, 340),
                borderRadius: pick(34, 30, 24),
                overflow: "hidden",
                boxShadow: SHADOWS.card,
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", inset: "-6% 0", transform: `translateY(${-scroll * 0.06}px)` }}>
                <BuildingArt variant={0} />
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: pick(-36, -20, 14),
                bottom: pick(36, 26, 16),
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: pick("16px 22px 16px 16px", "14px 18px 14px 14px", "12px 16px 12px 12px"),
                borderRadius: 22,
                background: COLORS.white,
                boxShadow: SHADOWS.chip,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  background: COLORS.peach,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin size={22} color={COLORS.orange} />
              </div>
              <div style={{ lineHeight: 1.35 }}>
                <div style={{ fontSize: pick(18, 17, 15), fontWeight: 700 }}>গুলশান, ঢাকা</div>
                <div style={{ fontSize: pick(14, 13, 12.5), color: COLORS.muted }}>প্রকল্প দেখতে ক্লিক করুন</div>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: COLORS.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8,
                }}
              >
                <ArrowUpRight size={18} color="#fff" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section style={{ background: COLORS.mist, padding: `${sectionPad}px ${pad}px` }}>
          <Reveal>
            <h2
              style={{
                margin: 0,
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: pick(54, 46, 34),
                lineHeight: 1.25,
              }}
            >
              আমাদের সেবাসমূহ
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: pick(20, 18, 16), color: COLORS.muted, maxWidth: 620, lineHeight: 1.7 }}>
              আপনার প্রয়োজন অনুযায়ী সম্পূর্ণ সমাধান — নকশা থেকে হস্তান্তর পর্যন্ত।
            </p>
          </Reveal>
          <div
            style={{
              marginTop: pick(52, 40, 30),
              display: "grid",
              gridTemplateColumns: bp === "sm" ? "1fr" : "repeat(3, 1fr)",
              gap: pick(28, 18, 16),
            }}
          >
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const lift = i === 1 ? cardHover : 0;
              return (
                <Reveal key={s.title} delay={i * 50} y={56}>
                  <div
                    style={{
                      background: COLORS.white,
                      borderRadius: 28,
                      padding: pick("38px 34px 34px", "28px 22px", "26px 24px"),
                      transform: `translateY(${-lift * 12}px)`,
                      boxShadow: `0 ${18 + lift * 26}px ${44 + lift * 24}px -26px rgba(15,15,15,${0.2 + lift * 0.16})`,
                      outline: `2px solid rgba(241,89,34,${lift * 0.9})`,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background: lift > 0.4 ? COLORS.orange : COLORS.peach,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={30} color={lift > 0.4 ? "#fff" : COLORS.orange} strokeWidth={2} />
                    </div>
                    <div style={{ marginTop: 26, fontFamily: FONTS.display, fontWeight: 700, fontSize: pick(28, 24, 24) }}>
                      {s.title}
                    </div>
                    <p style={{ margin: "12px 0 0", fontSize: pick(17, 15.5, 16), lineHeight: 1.75, color: COLORS.muted }}>
                      {s.text}
                    </p>
                    <div
                      style={{
                        marginTop: 22,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        color: COLORS.orange,
                      }}
                    >
                      বিস্তারিত দেখুন <ArrowRight size={17} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section style={{ padding: `${sectionPad}px ${pad}px` }}>
          <Reveal>
            <h2
              style={{
                margin: 0,
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: pick(54, 46, 34),
                lineHeight: 1.25,
              }}
            >
              নির্বাচিত প্রকল্প
            </h2>
          </Reveal>
          <div
            style={{
              marginTop: pick(48, 38, 28),
              display: "grid",
              gridTemplateColumns: bp === "sm" ? "1fr" : "repeat(3, 1fr)",
              gap: pick(28, 18, 20),
            }}
          >
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 60} y={64}>
                <div>
                  <div
                    style={{
                      height: pick(470, 340, 380),
                      borderRadius: 28,
                      overflow: "hidden",
                      boxShadow: SHADOWS.card,
                    }}
                  >
                    <BuildingArt variant={i} />
                  </div>
                  <div style={{ marginTop: 20, fontFamily: FONTS.display, fontWeight: 700, fontSize: pick(26, 22, 24) }}>
                    {p.name}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, fontSize: 16 }}>
                    <MapPin size={16} /> {p.place}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= CTA BAND ================= */}
        <section style={{ padding: `0 ${pad}px ${sectionPad}px` }}>
          <Reveal y={50}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: pick(44, 36, 30),
                padding: pick("76px 72px", "56px 40px", "40px 26px"),
                background: `linear-gradient(120deg, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 100%)`,
                display: "flex",
                flexDirection: bp === "lg" ? "row" : "column",
                alignItems: bp === "lg" ? "center" : "flex-start",
                justifyContent: "space-between",
                gap: 28,
              }}
            >
              <div style={{ position: "absolute", right: -80, top: -140, width: 460, height: 460, borderRadius: 999, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: pick(52, 42, 32), lineHeight: 1.25, color: "#fff" }}>
                  আপনার প্রকল্প নিয়ে
                  <br />
                  কথা বলুন
                </div>
                <p style={{ margin: "14px 0 0", fontSize: pick(20, 18, 16), color: "rgba(255,255,255,0.85)" }}>
                  আজই আমাদের সাথে যোগাযোগ করুন।
                </p>
              </div>
              <Btn tone="white" size={pick(19, 18, 16)} icon={<ArrowRight size={19} />} style={{ position: "relative" }}>
                যোগাযোগ করুন
              </Btn>
            </div>
          </Reveal>
        </section>

        {/* ================= FOOTER ================= */}
        <footer style={{ background: COLORS.ink, padding: `${pick(72, 56, 44)}px ${pad}px ${pick(48, 40, 32)}px`, color: "#fff" }}>
          <div
            style={{
              display: "flex",
              flexDirection: bp === "sm" ? "column" : "row",
              justifyContent: "space-between",
              gap: 36,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <BrandMark />
              <span style={{ fontFamily: FONTS.latin, fontWeight: 800, fontSize: 22 }}>Urban Nest</span>
            </div>
            <div style={{ display: "flex", gap: pick(90, 60, 44) }}>
              {[
                ["কোম্পানি", "আমাদের সম্পর্কে", "প্রকল্পসমূহ", "যোগাযোগ"],
                ["সেবা", "আবাসিক ভবন", "বাণিজ্যিক", "ইন্টেরিয়র"],
              ].map(([head, ...items]) => (
                <div key={head} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{head}</div>
                  {items.map((it) => (
                    <div key={it} style={{ fontSize: 15.5, color: "rgba(255,255,255,0.6)" }}>
                      {it}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 44, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.12)", fontSize: 14.5, color: "rgba(255,255,255,0.5)" }}>
            সর্বস্বত্ব সংরক্ষিত
          </div>
        </footer>
      </ScrollPage>

      {/* ================= HEADER (fixed layer) ================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerH,
          padding: `0 ${pad}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `rgba(255,255,255,${0.78 + scrolled * 0.2})`,
          borderBottom: `1px solid rgba(15,15,15,${scrolled * 0.07})`,
          boxShadow: `0 ${scrolled * 18}px ${scrolled * 36}px -24px rgba(15,15,15,${scrolled * 0.35})`,
          opacity: intro < 1 ? stage(intro, 0, 0.3) : 1,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BrandMark size={pick(38, 36, 34)} />
          <span style={{ fontFamily: FONTS.latin, fontWeight: 800, fontSize: pick(23, 22, 20), letterSpacing: "-0.01em" }}>
            Urban Nest
          </span>
        </div>
        {bp === "lg" ? (
          <div style={{ display: "flex", gap: 40 }}>
            {NAV.map((n, i) => (
              <div key={n} style={{ position: "relative", fontSize: 17, fontWeight: i === 1 ? 700 : 500, color: i === 1 ? COLORS.ink : COLORS.muted }}>
                {n}
                {i === 1 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -8,
                      height: 3,
                      width: `${navHover * 100}%`,
                      borderRadius: 99,
                      background: COLORS.orange,
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        {bp === "sm" ? (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: COLORS.mist,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={22} />
          </div>
        ) : (
          <Btn size={pick(16, 15, 15)} tone="ink">
            যোগাযোগ করুন
          </Btn>
        )}
      </div>
      {menuOpen > 0 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,15,15,${menuOpen * 0.25})`, zIndex: 19 }} />
      ) : null}
    </div>
  );
};
