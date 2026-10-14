import { Check, Heart, Plus, Search, ShoppingBag, User } from "lucide-react";
import { ProductArt, PRODUCTS } from "../art/Products";
import { clamp01 } from "../anim";
import { COLORS, FONTS, SHADOWS } from "../theme";
import { Reveal, ScrollPage } from "./scroll";
import { BrandMark, Btn, Chip } from "./ui";
import { toBn } from "./format";

export type ShopSiteProps = {
  width: number;
  height: number;
  scroll?: number;
  /** Index of the product card being hovered, and how far (0..1). */
  hoverIndex?: number;
  hover?: number;
  /** 0..1 — the hovered card's add-to-cart button has been pressed. */
  added?: number;
  cartCount?: number;
  /** 0..1 — mini-cart toast. */
  toast?: number;
};

const CATS = ["সব পণ্য", "পারফিউম", "ঘড়ি", "ব্যাগ", "ইলেকট্রনিক্স", "হোম ডেকর"];

/** A modern lifestyle e-commerce storefront with a live product grid. */
export const ShopSite: React.FC<ShopSiteProps> = ({
  width,
  height,
  scroll = 0,
  hoverIndex = -1,
  hover = 0,
  added = 0,
  cartCount = 0,
  toast = 0,
}) => {
  const pad = 72;
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
        <div style={{ height: 150 }} />

        {/* hero banner */}
        <section style={{ padding: `0 ${pad}px` }}>
          <div
            style={{
              position: "relative",
              height: 470,
              borderRadius: 40,
              overflow: "hidden",
              background: `linear-gradient(115deg, ${COLORS.peach} 0%, #FFD9C6 100%)`,
              display: "flex",
              alignItems: "center",
              padding: "0 76px",
            }}
          >
            <div style={{ position: "absolute", right: 70, top: 40, width: 430, height: 430, borderRadius: 999, background: `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`, boxShadow: "0 40px 80px -30px rgba(201,62,15,0.6)" }} />
            <div style={{ position: "absolute", right: 70, top: 40, width: 430, height: 430, borderRadius: 999, background: "radial-gradient(60% 60% at 30% 25%, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <Chip tone="white" icon={<span style={{ width: 8, height: 8, borderRadius: 99, background: COLORS.orange }} />}>
                নতুন কালেকশন
              </Chip>
              <div style={{ marginTop: 22, fontFamily: FONTS.display, fontWeight: 800, fontSize: 72, lineHeight: 1.2 }}>
                আপনার স্টাইলে
                <br />
                আনুন নতুনত্ব
              </div>
              <p style={{ margin: "16px 0 0", fontSize: 20, color: COLORS.inkSoft, maxWidth: 440, lineHeight: 1.7 }}>
                বাছাই করা পণ্যের সংগ্রহ, এক জায়গায়।
              </p>
              <div style={{ marginTop: 30 }}>
                <Btn tone="ink" size={18} icon={<ShoppingBag size={19} />}>
                  এখনই কিনুন
                </Btn>
              </div>
            </div>
            <div style={{ position: "absolute", right: 70, top: 40, width: 430, height: 430, zIndex: 2 }}>
              <div style={{ position: "absolute", left: 50, top: 40, width: 330, height: 330, transform: `translateY(${-scroll * 0.04}px)` }}>
                <ProductArt kind="watch" />
              </div>
              <div style={{ position: "absolute", left: -70, top: 190, width: 210, height: 210, transform: `translateY(${-scroll * 0.08}px)` }}>
                <ProductArt kind="perfume" />
              </div>
              <div style={{ position: "absolute", left: 270, top: 220, width: 190, height: 190, transform: `translateY(${-scroll * 0.07}px)` }}>
                <ProductArt kind="headphones" />
              </div>
            </div>
          </div>
        </section>

        {/* grid */}
        <section style={{ padding: `76px ${pad}px 100px` }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 48, lineHeight: 1.25 }}>জনপ্রিয় পণ্য</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["সব", "নতুন", "সেরা বিক্রি"].map((f, i) => (
                  <span
                    key={f}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 99,
                      fontSize: 16,
                      fontWeight: 600,
                      background: i === 0 ? COLORS.ink : COLORS.mist,
                      color: i === 0 ? "#fff" : COLORS.inkSoft,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
            {PRODUCTS.map((p, i) => {
              const hot = i === hoverIndex ? hover : 0;
              const done = i === hoverIndex ? added : 0;
              return (
                <Reveal key={i} delay={(i % 4) * 40} y={50}>
                  <div
                    style={{
                      borderRadius: 28,
                      background: COLORS.white,
                      padding: 14,
                      transform: `translateY(${-hot * 10}px)`,
                      boxShadow: `0 ${14 + hot * 26}px ${34 + hot * 26}px -24px rgba(15,15,15,${0.18 + hot * 0.2})`,
                      outline: `1.5px solid ${hot > 0.3 ? "rgba(241,89,34,0.5)" : COLORS.line}`,
                    }}
                  >
                    <div style={{ height: 270, borderRadius: 20, background: p.tint, overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", inset: 18, transform: `scale(${1 + hot * 0.07})` }}>
                        <ProductArt kind={p.kind} />
                      </div>
                      <div style={{ position: "absolute", top: 14, right: 14, width: 38, height: 38, borderRadius: 99, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOWS.card }}>
                        <Heart size={18} color={COLORS.inkSoft} />
                      </div>
                    </div>
                    <div style={{ padding: "18px 8px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 21, lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ marginTop: 4, fontFamily: FONTS.display, fontWeight: 800, fontSize: 24, color: COLORS.orange }}>{p.price}</div>
                      </div>
                      <div
                        style={{
                          height: 48,
                          minWidth: 48,
                          borderRadius: 99,
                          padding: `0 ${14 + hot * 8}px`,
                          background: done > 0.5 ? COLORS.ink : hot > 0.3 ? COLORS.orange : COLORS.peach,
                          color: hot > 0.3 || done > 0.5 ? "#fff" : COLORS.orange,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 15,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          transform: `scale(${1 - done * 0.06 * (1 - done)})`,
                        }}
                      >
                        {done > 0.5 ? <Check size={20} strokeWidth={3} /> : <Plus size={22} strokeWidth={2.6} />}
                        {hot > 0.5 ? (done > 0.5 ? "যোগ হয়েছে" : "কার্টে যোগ") : null}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </ScrollPage>

      {/* header (fixed layer) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, background: `rgba(255,255,255,${0.82 + clamp01(scroll / 80) * 0.16})`, boxShadow: `0 ${clamp01(scroll / 80) * 16}px 34px -24px rgba(15,15,15,${clamp01(scroll / 80) * 0.3})` }}>
        <div style={{ height: 84, padding: `0 ${pad}px`, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BrandMark ink />
            <span style={{ fontFamily: FONTS.latin, fontWeight: 800, fontSize: 25, letterSpacing: "-0.01em" }}>Lumi</span>
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: 560,
              height: 50,
              borderRadius: 99,
              background: COLORS.mist,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 22px",
              fontSize: 17,
              color: COLORS.muted,
            }}
          >
            <Search size={20} /> পণ্য খুঁজুন...
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 22 }}>
            <Heart size={24} />
            <User size={24} />
            <div style={{ position: "relative", width: 50, height: 50, borderRadius: 99, background: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + toast * 0.06 * (1 - toast)})` }}>
              <ShoppingBag size={22} color="#fff" />
              <div style={{ position: "absolute", top: -4, right: -4, minWidth: 24, height: 24, borderRadius: 99, background: COLORS.orange, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                {toBn(cartCount)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 54, padding: `0 ${pad}px`, display: "flex", alignItems: "center", gap: 38, borderTop: `1px solid ${COLORS.line}`, fontSize: 16.5 }}>
          {CATS.map((c, i) => (
            <span key={c} style={{ position: "relative", fontWeight: i === 0 ? 700 : 500, color: i === 0 ? COLORS.ink : COLORS.muted }}>
              {c}
              {i === 0 ? <span style={{ position: "absolute", left: 0, right: 0, bottom: -17, height: 3, borderRadius: 99, background: COLORS.orange }} /> : null}
            </span>
          ))}
        </div>
      </div>

      {/* add-to-cart toast */}
      {toast > 0.01 ? (
        <div
          style={{
            position: "absolute",
            top: 162,
            right: 56,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 24px 14px 14px",
            borderRadius: 22,
            background: COLORS.white,
            boxShadow: SHADOWS.chip,
            transform: `translateY(${(1 - toast) * -24}px)`,
            opacity: toast,
          }}
        >
          <div style={{ width: 58, height: 58, borderRadius: 16, background: COLORS.mist, padding: 6 }}>
            <ProductArt kind={PRODUCTS[Math.max(0, hoverIndex)].kind} />
          </div>
          <div style={{ lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>কার্টে যোগ হয়েছে</div>
            <div style={{ fontSize: 14.5, color: COLORS.muted }}>{PRODUCTS[Math.max(0, hoverIndex)].name}</div>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: COLORS.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={17} color="#fff" strokeWidth={3} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
