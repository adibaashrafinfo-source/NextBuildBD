import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, EASE } from "../theme";
import { beat } from "../timeline";
import { prog } from "../anim";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { FinalBrandCTA } from "../components/FinalBrandCTA";
import { WhatsAppFloatingButton } from "../components/WhatsAppFloatingButton";
import { OrangeParticles } from "../components/OrangeParticles";

const B = (name: Parameters<typeof beat<"brand">>[1]) => beat("brand", name);

/**
 * Scene 5 (24-30s) — brand reveal and conversion.
 * Clean white, the original logo behind a mask, the primary CTA, the tagline,
 * and the floating WhatsApp button. Holds long enough to read comfortably.
 */
export const Scene05BrandCTA: React.FC = () => {
  const frame = useCurrentFrame();

  // A clean white wipe hands off from scene 4.
  const wipe = 1 - prog(frame, B("whiteWipe"), 16, EASE.out);

  return (
    <AbsoluteFill>
      {/* Pure white ground — nothing competes with the lock-up. */}
      <AbsoluteFill style={{ background: COLORS.white }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(54% 62% at 50% 44%, rgba(245,245,243,0.9) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Two quiet swashes echoing the logo, kept well clear of the type. */}
      <AnimatedOrangeRibbon
        gradientId="brand-ribbon-a"
        curve={[
          { x: -300, y: 120 },
          { x: 440, y: -110 },
          { x: 1340, y: 160 },
          { x: 2220, y: -30 },
        ]}
        delay={B("logoIn") - 6}
        duration={54}
        width={12}
        belly={0.44}
        opacity={0.19}
        tipGlow={false}
        drift={9}
      />
      <AnimatedOrangeRibbon
        gradientId="brand-ribbon-b"
        curve={[
          { x: -260, y: 1030 },
          { x: 560, y: 1240 },
          { x: 1440, y: 905 },
          { x: 2220, y: 1105 },
        ]}
        delay={B("logoIn") + 4}
        duration={58}
        width={10}
        belly={0.5}
        opacity={0.15}
        tipGlow={false}
        drift={11}
      />

      <OrangeParticles count={20} seed="brand" intensity={0.8} speed={0.7} />

      <FinalBrandCTA
        logoDelay={B("logoIn")}
        headlineDelay={B("headline")}
        ctaDelay={B("ctaButton")}
        ctaLabelDelay={B("ctaLabel")}
        taglineDelay={B("tagline")}
      />

      <WhatsAppFloatingButton delay={B("whatsapp")} size={108} inset={{ right: 104, bottom: 92 }} />

      {wipe > 0.001 ? (
        <AbsoluteFill style={{ background: COLORS.white, opacity: wipe, pointerEvents: "none" }} />
      ) : null}
    </AbsoluteFill>
  );
};
