import { ArrowUpRight } from "lucide-react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COPY } from "../brand";
import { COLORS, EASE, FONTS, SHADOWS, SPRINGS } from "../theme";
import { osc, prog, springAt } from "../anim";
import { AnimatedHeadline, line } from "./AnimatedHeadline";
import { LogoReveal } from "./LogoReveal";

export type FinalBrandCTAProps = {
  logoDelay: number;
  logoAccentDelay: number;
  lead: ReadonlyArray<number>;
  headline: ReadonlyArray<number>;
  ctaDelay: number;
  taglineDelay: number;
};

/** Brand lock-up, the call to action and the tagline for the closing frame. */
export const FinalBrandCTA: React.FC<FinalBrandCTAProps> = ({
  logoDelay,
  logoAccentDelay,
  lead,
  headline,
  ctaDelay,
  taglineDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cta = springAt({ frame, fps, delay: ctaDelay, config: SPRINGS.entrance });
  const label = prog(frame, ctaDelay + 6, 22, EASE.out);
  const hoverStart = ctaDelay + 30;
  const hover = prog(frame, hoverStart, 14, EASE.out) - prog(frame, hoverStart + 34, 20, EASE.out);
  const sheen = prog(frame, hoverStart + 2, 34, EASE.inOut);
  const idle = osc(frame - ctaDelay, 200) * 3 * cta;
  const tag = prog(frame, taglineDelay, 22, EASE.out);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 92 }}>
        <LogoReveal width={620} delay={logoDelay} duration={30} accentDelay={logoAccentDelay} />
      </div>

      <div style={{ marginTop: 52 }}>
        <AnimatedHeadline
          align="center"
          fontSize={50}
          weight={600}
          color={COLORS.inkSoft}
          lines={[line(COPY.cta.lead, lead.slice())]}
        />
      </div>
      <div style={{ marginTop: 6 }}>
        <AnimatedHeadline
          align="center"
          fontSize={124}
          lines={[line(COPY.cta.headline, headline.slice(), 4, "all")]}
        />
      </div>

      {/* primary CTA */}
      <div
        style={{
          marginTop: 56,
          transform: `translateY(${(1 - cta) * 50 - hover * 6 + idle}px) scale(${(0.92 + cta * 0.08) * (1 + hover * 0.03)})`,
          opacity: Math.min(1, cta * 1.6),
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 30,
            height: 116,
            padding: "0 30px 0 60px",
            borderRadius: 999,
            background: `linear-gradient(176deg, ${COLORS.orangeSoft} -40%, ${COLORS.orange} 46%, ${COLORS.orangeDeep} 160%)`,
            boxShadow: `${SHADOWS.button}, 0 ${hover * 22}px ${hover * 40}px -18px rgba(241,89,34,0.6)`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.latin,
              fontSize: 46,
              fontWeight: 800,
              letterSpacing: "0.005em",
              color: "#fff",
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${(1 - label) * 100}% 0 0)`,
              transform: `translateY(${(1 - label) * 14}%)`,
              opacity: label,
            }}
          >
            {BRAND.url}
          </span>
          <span
            style={{
              width: 74,
              height: 74,
              borderRadius: 999,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(${hover * 3}px, ${-hover * 3}px)`,
            }}
          >
            <ArrowUpRight size={38} color={COLORS.orange} strokeWidth={2.8} />
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

      <div
        style={{
          marginTop: 48,
          fontFamily: FONTS.latin,
          fontSize: 31,
          fontWeight: 500,
          letterSpacing: "0.09em",
          color: COLORS.muted,
          clipPath: `inset(0 ${(1 - tag) * 100}% 0 0)`,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 12}px)`,
        }}
      >
        {BRAND.tagline}
      </div>
    </div>
  );
};
