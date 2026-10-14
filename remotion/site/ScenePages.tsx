import { CheckCheck, Frown, Send, SearchX } from "lucide-react";
import { clamp01, kf } from "../anim";
import { COLORS, EASE, FONTS, SHADOWS } from "../theme";
import { Btn } from "./ui";

/** The page shown when a business has no website: a plain, honest 404. */
export const NotFoundPage: React.FC<{
  width: number;
  height: number;
  /** 0..1 — hover on the retry button. */
  hover?: number;
  /** 0..1 — a dull "nothing happened" shake after the click. */
  shake?: number;
  /** 0..1 — the page content fades in. */
  intro?: number;
}> = ({ width, height, hover = 0, shake = 0, intro = 1 }) => {
  const dx = Math.sin(shake * Math.PI * 6) * (1 - shake) * 9;
  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #FFFFFF, #FAF9F7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.ui,
        textAlign: "center",
        opacity: intro,
      }}
    >
      <div style={{ position: "relative", width: 196, height: 196, transform: `translateX(${dx}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: COLORS.mist }} />
        <div style={{ position: "absolute", inset: 22, borderRadius: 999, background: "#fff", boxShadow: SHADOWS.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SearchX size={68} color="#B5B2AA" strokeWidth={1.6} />
        </div>
      </div>
      <div style={{ marginTop: 26, fontFamily: FONTS.latin, fontWeight: 800, fontSize: 124, lineHeight: 1.05, color: "#E7E4DD", letterSpacing: "0.02em" }}>
        404
      </div>
      <div style={{ marginTop: 6, fontFamily: FONTS.display, fontWeight: 700, fontSize: 36, color: COLORS.inkSoft }}>
        এই পেজটি খুঁজে পাওয়া যায়নি
      </div>
      <div style={{ marginTop: 12, fontSize: 20, color: COLORS.muted, lineHeight: 1.7 }}>
        আপনার ব্যবসার কোনো ওয়েবসাইট নেই।
      </div>
      <div style={{ marginTop: 32 }}>
        <Btn tone="ghost" size={19} hover={hover}>
          আবার চেষ্টা করুন
        </Btn>
      </div>
    </div>
  );
};

type Msg = { side: "them" | "us"; text: string; at: number };

/**
 * A messaging screen in which a potential customer asks about the website,
 * gets no answer worth having, and leaves. `t` is seconds since the scene start.
 */
export const ChatScreen: React.FC<{ width: number; height: number; t: number }> = ({ width, height, t }) => {
  const msgs: Msg[] = [
    { side: "them", text: "আপনাদের ওয়েবসাইট আছে?", at: 0.5 },
    { side: "them", text: "প্রোডাক্ট দেখতে চাই", at: 1.3 },
    { side: "us", text: "দুঃখিত, এখনো নেই", at: 2.3 },
    { side: "them", text: "ঠিক আছে, অন্য কোথাও দেখি", at: 3.3 },
  ];
  const offline = clamp01((t - 4.0) / 0.5);
  const typing = kf(t, [[1.7, 0], [1.85, 1], [2.25, 1], [2.35, 0]], EASE.out);

  return (
    <div style={{ width, height, background: "#FAF9F6", fontFamily: FONTS.ui, display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, background: "#fff", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 48, height: 48, borderRadius: 99, background: `linear-gradient(145deg, #D9D6CE, #B9B6AE)`, color: "#fff", fontFamily: FONTS.display, fontWeight: 800, fontSize: 21, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - offline * 0.35 }}>স</div>
          <span style={{ position: "absolute", right: -1, bottom: -1, width: 14, height: 14, borderRadius: 99, border: "2.5px solid #fff", background: offline > 0.5 ? "#C9C6BF" : "#34C759" }} />
        </div>
        <div style={{ lineHeight: 1.35 }}>
          <div style={{ fontWeight: 700, fontSize: 19 }}>সম্ভাব্য কাস্টমার</div>
          <div style={{ fontSize: 13.5, color: offline > 0.5 ? COLORS.muted : "#1E7B3E", fontWeight: 500 }}>
            {offline > 0.5 ? "অফলাইন" : "অনলাইন"}
          </div>
        </div>
      </div>

      {/* thread */}
      <div style={{ flex: 1, padding: "26px 20px", display: "flex", flexDirection: "column", gap: 18, overflow: "hidden", opacity: 1 - offline * 0.45 }}>
        <div style={{ alignSelf: "center", fontSize: 12.5, color: COLORS.muted, padding: "4px 12px", background: COLORS.mist, borderRadius: 99 }}>আজ</div>
        {msgs.map((m, i) => {
          const e = EASE.out(clamp01((t - m.at) / 0.4));
          if (e <= 0) return null;
          const us = m.side === "us";
          return (
            <div
              key={i}
              style={{
                alignSelf: us ? "flex-end" : "flex-start",
                maxWidth: "78%",
                padding: "16px 22px",
                borderRadius: us ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
                background: us ? `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})` : "#fff",
                color: us ? "#fff" : COLORS.ink,
                fontSize: 20.5,
                fontWeight: 500,
                lineHeight: 1.5,
                boxShadow: us ? "0 10px 20px -12px rgba(241,89,34,0.6)" : SHADOWS.card,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px) scale(${0.94 + e * 0.06})`,
                transformOrigin: us ? "100% 100%" : "0 100%",
              }}
            >
              {m.text}
              {us ? <CheckCheck size={15} style={{ marginLeft: 8, verticalAlign: "-2px", opacity: 0.85 }} /> : null}
            </div>
          );
        })}
        {typing > 0.02 ? (
          <div style={{ alignSelf: "flex-end", padding: "14px 18px", borderRadius: "22px 22px 6px 22px", background: "#EFEDE8", display: "flex", gap: 6, opacity: typing }}>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{ width: 8, height: 8, borderRadius: 99, background: "#9A978F", opacity: 0.5 + 0.5 * Math.sin(t * 9 - d * 0.9) }} />
            ))}
          </div>
        ) : null}
        {offline > 0.5 ? (
          <div style={{ alignSelf: "center", marginTop: 6, display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: COLORS.muted, opacity: clamp01((offline - 0.5) * 2) }}>
            <Frown size={16} /> কাস্টমার চলে গেছে
          </div>
        ) : null}
      </div>

      {/* composer */}
      <div style={{ padding: "12px 16px 16px", background: "#fff", display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${COLORS.line}` }}>
        <div style={{ flex: 1, height: 46, borderRadius: 99, background: COLORS.mist, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 16, color: COLORS.muted }}>মেসেজ লিখুন...</div>
        <div style={{ width: 46, height: 46, borderRadius: 99, background: COLORS.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={20} color="#fff" />
        </div>
      </div>
    </div>
  );
};
