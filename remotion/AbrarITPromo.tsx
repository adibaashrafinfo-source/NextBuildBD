import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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
 * The Abrar IT promo, cut to the voice-over in public/voiceover.mp3.
 *
 * Scene boundaries sit in the measured pauses between spoken sentences and the
 * text reveals land on measured phrase onsets — see remotion/audioMarkers.ts
 * for the measurements and remotion/timeline.ts for the cues they drive.
 *
 * Remove the <Audio> below to render the silent master again; nothing else
 * depends on the audio file existing.
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
    <Audio src={staticFile("voiceover.mp3")} />

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
