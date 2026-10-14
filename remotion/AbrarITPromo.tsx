import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, FONTS } from "./theme";
import { sceneSequence } from "./timeline";
import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { OrangeParticles } from "./components/OrangeParticles";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Opportunity } from "./scenes/Scene02Opportunity";
import { Scene03Showcase } from "./scenes/Scene03Showcase";
import { Scene04Solutions } from "./scenes/Scene04Solutions";
import { Scene05BrandCTA } from "./scenes/Scene05BrandCTA";

/**
 * The 30-second Abrar IT promo.
 *
 * Silent by design — there is no <Audio> anywhere in the tree, so the rendered
 * MP4 carries no audio track and the timeline is free to be synced to an
 * external voice-over later (see remotion/timeline.ts and VIDEO.md).
 */
export const AbrarITPromo: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.white,
      fontFamily: FONTS.body,
      // Keeps sub-pixel text rendering consistent across the whole film.
      WebkitFontSmoothing: "antialiased",
    }}
  >
    <BackgroundCanvas />
    <OrangeParticles count={28} seed="abrar-it" intensity={1} />

    <Sequence {...sceneSequence("hook")} name="1 · Hook">
      <Scene01Hook />
    </Sequence>

    <Sequence {...sceneSequence("opportunity")} name="2 · Opportunity">
      <Scene02Opportunity />
    </Sequence>

    <Sequence {...sceneSequence("showcase")} name="3 · Showcase">
      <Scene03Showcase />
    </Sequence>

    <Sequence {...sceneSequence("solutions")} name="4 · Solutions">
      <Scene04Solutions />
    </Sequence>

    <Sequence {...sceneSequence("brand")} name="5 · Brand & CTA">
      <Scene05BrandCTA />
    </Sequence>
  </AbsoluteFill>
);
