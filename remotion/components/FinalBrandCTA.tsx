import { useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COPY } from "../brand";
import { COLORS, EASE, FONTS, SPRINGS } from "../theme";
import { osc, prog, springAt } from "../anim";
import { AnimatedHeadline, MaskedLine } from "./AnimatedHeadline";
import { LogoReveal } from "./LogoReveal";

export type FinalBrandCTAProps = {
  logoDelay: number;
  headlineDelay: number;
  /** Frame the orange button rises in. */
  ctaDelay: number;
  /** Frame the URL inside the button reveals. */
  ctaLabelDelay: number;
  /** Frame the logo pulses back to life on a later beat. */
  logoAccentDelay?: number;
  taglineDelay: number;
};

/** Brand lock-up, primary call to action and tagline for the closing frame. */
export const FinalBrandCTA: React.FC<FinalBrandCTAProps> = ({
  logoDelay,
  headlineDelay,
  ctaDelay,
  ctaLabelDelay,
  logoAccentDelay,
  taglineDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaSpring = springAt({ frame, fps, delay: ctaDelay, config: SPRINGS.entrance });
  const labelReveal = prog(frame, ctaLabelDelay, 20, EASE.out);

  // Refined hover-style pass: a lift plus a specular sweep across the button.
  const hoverStart = ctaLabelDelay + 16;
  const hoverIn = prog(frame, hoverStart, 14, EASE.out);
  const hoverOut = prog(frame, hoverStart + 30, 18, EASE.out);
  const hover = hoverIn - hoverOut;
  const sheen = prog(frame, hoverStart + 2, 32, EASE.inOut);

  const idle = osc(frame - ctaDelay, 210) * 2.5 * ctaSpring;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <LogoReveal
        width={660}
        delay={logoDelay}
        duration={32}
        accentDelay={logoAccentDelay}
        style={{ marginBottom: 64 }}
      />

      <AnimatedHeadline
        lines={[{ text: COPY.brand.headline }]}
        lineDelays={[headlineDelay]}
        fontSize={78}
        align="center"
        weight={800}
        letterSpacing="-0.022em"
        wordStagger={3}
        style={{ marginBottom: 52 }}
      />

      {/* Primary CTA */}
      <div
        style={{
          transform: `translateY(${(1 - ctaSpring) * 44 - hover * 6 + idle}px) scale(${(0.9 + ctaSpring * 0.1) * (1 + hover * 0.025)})`,
          opacity: Math.min(1, ctaSpring * 1.5),
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 560,
            height: 116,
            padding: "0 62px",
            borderRadius: 999,
            background: `linear-gradient(176deg, ${COLORS.orangeSoft} -34%, ${COLORS.orange} 46%, ${COLORS.orangeDeep} 150%)`,
            boxShadow: `0 ${26 + hover * 16}px ${56 + hover * 24}px -20px rgba(241,89,34,${0.5 + hover * 0.16}), 0 8px 18px -8px rgba(241,89,34,0.42), inset 0 2px 0 rgba(255,255,255,0.38), inset 0 -3px 0 rgba(120,36,8,0.2)`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontFamily: FONTS.display,
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "0.015em",
                color: COLORS.white,
                whiteSpace: "nowrap",
                clipPath: `inset(0 ${(1 - labelReveal) * 100}% 0 0)`,
                transform: `translateY(${(1 - labelReveal) * 16}%)`,
                opacity: labelReveal,
              }}
            >
              {BRAND.url}
            </span>
          </span>

          {sheen > 0 && sheen < 1 ? (
            <span
              style={{
                position: "absolute",
                top: "-60%",
                bottom: "-60%",
                left: `${-30 + sheen * 150}%`,
                width: "22%",
                transform: "rotate(18deg)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
                filter: "blur(8px)",
                opacity: Math.sin(sheen * Math.PI),
              }}
            />
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 52 }}>
        <MaskedLine
          delay={taglineDelay}
          fontSize={34}
          weight={500}
          color={COLORS.muted}
          letterSpacing="0.085em"
        >
          {BRAND.tagline}
        </MaskedLine>
      </div>
    </div>
  );
};
