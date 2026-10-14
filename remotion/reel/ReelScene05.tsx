import { ArrowUpRight } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COPY, PHONE } from "../brand";
import { CUES, rel } from "../timeline";
import { COLORS, EASE, FONTS, SHADOWS, SPRINGS } from "../theme";
import { osc, prog, springAt } from "../anim";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { LogoReveal } from "../components/LogoReveal";
import { WhatsAppFloatingButton } from "../components/WhatsAppFloatingButton";
import { RH, RW } from "./layout";

const F = (s: number) => rel("brand", s);
const C = CUES.brand;

/** Reel scene 5: logo, call to action, the spoken number, the tagline — held to the end. */
export const ReelScene05: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaDelay = F(C.cta);
  const cta = springAt({ frame, fps, delay: ctaDelay, config: SPRINGS.entrance });
  const label = prog(frame, ctaDelay + 6, 22, EASE.out);
  const hoverStart = ctaDelay + 30;
  const hover = prog(frame, hoverStart, 14, EASE.out) - prog(frame, hoverStart + 34, 20, EASE.out);
  const sheen = prog(frame, hoverStart + 2, 34, EASE.inOut);
  const idle = osc(frame - ctaDelay, 200) * 3 * cta;
  const tag = prog(frame, F(C.tagline), 22, EASE.out);

  return (
    <AbsoluteFill>
      <AnimatedOrangeRibbon
        gradientId="rbrand-a"
        viewW={RW}
        viewH={RH}
        curve={[
          { x: -260, y: 300 },
          { x: 200, y: -120 },
          { x: 820, y: 460 },
          { x: 1340, y: 80 },
        ]}
        delay={F(C.logo) - 4}
        duration={56}
        width={13}
        belly={0.46}
        opacity={0.26}
        tipGlow={false}
      />
      <AnimatedOrangeRibbon
        gradientId="rbrand-b"
        viewW={RW}
        viewH={RH}
        curve={[
          { x: -260, y: 1760 },
          { x: 240, y: 2060 },
          { x: 840, y: 1560 },
          { x: 1340, y: 1900 },
        ]}
        delay={F(C.logo) + 6}
        duration={58}
        width={11}
        belly={0.5}
        opacity={0.22}
        tipGlow={false}
      />

      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
        <LogoReveal width={760} delay={F(C.logo)} duration={30} accentDelay={F(C.logoAccent)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 590 }}>
        <AnimatedHeadline align="center" fontSize={44} weight={600} color={COLORS.inkSoft} lines={[line(COPY.cta.lead, C.lead.map(F))]} />
        <AnimatedHeadline align="center" fontSize={90} style={{ marginTop: 14 }} lines={[line(COPY.cta.headline, C.headline.map(F), 4, "all")]} />
      </div>

      {/* primary CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - cta) * 50 - hover * 6 + idle}px) scale(${(0.92 + cta * 0.08) * (1 + hover * 0.03)})`, opacity: Math.min(1, cta * 1.6) }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 24,
              height: 108,
              padding: "0 26px 0 50px",
              borderRadius: 999,
              background: `linear-gradient(176deg, ${COLORS.orangeSoft} -40%, ${COLORS.orange} 46%, ${COLORS.orangeDeep} 160%)`,
              boxShadow: `${SHADOWS.button}, 0 ${hover * 22}px ${hover * 40}px -18px rgba(241,89,34,0.6)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.latin,
                fontSize: 42,
                fontWeight: 800,
                color: "#fff",
                whiteSpace: "nowrap",
                clipPath: `inset(0 ${(1 - label) * 100}% 0 0)`,
                transform: `translateY(${(1 - label) * 14}%)`,
                opacity: label,
              }}
            >
              {BRAND.url}
            </span>
            <span style={{ width: 68, height: 68, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${hover * 3}px, ${-hover * 3}px)` }}>
              <ArrowUpRight size={34} color={COLORS.orange} strokeWidth={2.8} />
            </span>
            {sheen > 0 && sheen < 1 ? (
              <span
                style={{
                  position: "absolute",
                  top: "-60%",
                  bottom: "-60%",
                  left: `${-30 + sheen * 150}%`,
                  width: "20%",
                  transform: "rotate(18deg)",
                  background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))",
                  opacity: Math.sin(sheen * Math.PI),
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* the number, spoken at 27.58s, beside the WhatsApp button */}
      <WhatsAppFloatingButton delay={F(C.whatsapp)} labelDelay={F(C.phoneLabel)} label={PHONE} size={100} inset={{ right: 296, bottom: RH - 1262 }} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center", fontFamily: FONTS.latin, fontSize: 29, fontWeight: 500, letterSpacing: "0.08em", color: COLORS.muted, clipPath: `inset(0 ${(1 - tag) * 100}% 0 0)`, opacity: tag, transform: `translateY(${(1 - tag) * 12}px)` }}>
        {BRAND.tagline}
      </div>
    </AbsoluteFill>
  );
};
