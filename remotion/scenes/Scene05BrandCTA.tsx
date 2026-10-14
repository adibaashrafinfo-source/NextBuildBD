import { AbsoluteFill } from "remotion";
import { CUES, rel } from "../timeline";
import { PHONE } from "../brand";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { FinalBrandCTA } from "../components/FinalBrandCTA";
import { WhatsAppFloatingButton } from "../components/WhatsAppFloatingButton";

const F = (s: number) => rel("brand", s);
const C = CUES.brand;

/**
 * Scene 5 (23.59 - 31.8s): "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে আজই যোগাযোগ করুন
 * 01719686459 — Abrar IT — Your Journey to Digital Excellence".
 * Clean white, the original logo behind a mask, the call to action, the spoken
 * number beside the WhatsApp button, and the tagline. Holds to the last frame.
 */
export const Scene05BrandCTA: React.FC = () => (
  <AbsoluteFill>
    <AnimatedOrangeRibbon
      gradientId="brand-a"
      curve={[
        { x: -300, y: 190 },
        { x: 420, y: -140 },
        { x: 1340, y: 230 },
        { x: 2240, y: -20 },
      ]}
      delay={F(C.logo) - 4}
      duration={56}
      width={13}
      belly={0.46}
      opacity={0.26}
      tipGlow={false}
    />
    <AnimatedOrangeRibbon
      gradientId="brand-b"
      curve={[
        { x: -260, y: 1020 },
        { x: 560, y: 1250 },
        { x: 1440, y: 900 },
        { x: 2240, y: 1110 },
      ]}
      delay={F(C.logo) + 6}
      duration={58}
      width={11}
      belly={0.5}
      opacity={0.22}
      tipGlow={false}
    />

    <FinalBrandCTA
      logoDelay={F(C.logo)}
      logoAccentDelay={F(C.logoAccent)}
      lead={C.lead.map(F)}
      headline={C.headline.map(F)}
      ctaDelay={F(C.cta)}
      taglineDelay={F(C.tagline)}
    />

    <WhatsAppFloatingButton
      delay={F(C.whatsapp)}
      labelDelay={F(C.phoneLabel)}
      label={PHONE}
      size={108}
      inset={{ right: 104, bottom: 92 }}
    />
  </AbsoluteFill>
);
