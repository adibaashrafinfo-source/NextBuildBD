import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS, FONTS } from "./theme";
import { SCENES, sceneSequence, sec } from "./timeline";
import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { SceneWipe } from "./components/SceneWipe";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Loss } from "./scenes/Scene02Loss";
import { Scene03Showcase } from "./scenes/Scene03Showcase";
import { Scene04Solutions } from "./scenes/Scene04Solutions";
import { Scene05BrandCTA } from "./scenes/Scene05BrandCTA";

/**
 * The Abrar IT promo, cut to the voice-over in public/voiceover.mp3.
 *
 * Scene boundaries sit in the measured pauses between spoken sentences, and the
 * orange swash that joins the scenes plays inside those pauses — see
 * remotion/audioMarkers.ts for the measurements and remotion/timeline.ts for
 * the cue sheet that drives every reveal.
 *
 * Remove the <Audio> below to render the silent master again; nothing else
 * depends on the audio file existing.
 */
export const AbrarITPromo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.white, fontFamily: FONTS.ui, WebkitFontSmoothing: "antialiased" }}>
    <Audio src={staticFile("voiceover.mp3")} />
    <BackgroundCanvas />

    <Sequence {...sceneSequence("hook")} name="1 · প্রশ্ন">
      <Scene01Hook />
    </Sequence>
    <Sequence {...sceneSequence("loss")} name="2 · ক্ষতি">
      <Scene02Loss />
    </Sequence>

    <Sequence {...sceneSequence("showcase")} name="3 · সমাধান">
      <Scene03Showcase />
    </Sequence>

    <Sequence {...sceneSequence("solutions")} name="4 · সলিউশন">
      <Scene04Solutions />
    </Sequence>

    <Sequence {...sceneSequence("brand")} name="5 · যোগাযোগ">
      <Scene05BrandCTA />
    </Sequence>

    <SceneWipe
      cuts={[SCENES.loss.start, SCENES.showcase.start, SCENES.solutions.start, SCENES.brand.start].map(sec)}
    />
  </AbsoluteFill>
);
