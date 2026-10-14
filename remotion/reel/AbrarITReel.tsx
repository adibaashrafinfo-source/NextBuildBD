import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS, FONTS } from "../theme";
import { SCENES, sceneSequence, sec } from "../timeline";
import { BackgroundCanvas } from "../components/BackgroundCanvas";
import { SceneWipe } from "../components/SceneWipe";
import { RH, RW } from "./layout";
import { ReelScene01 } from "./ReelScene01";
import { ReelScene02 } from "./ReelScene02";
import { ReelScene03 } from "./ReelScene03";
import { ReelScene04 } from "./ReelScene04";
import { ReelScene05 } from "./ReelScene05";

/**
 * The 9:16 cut (1080x1920) for Reels, Shorts and Stories.
 *
 * Same narration, same cue sheet (remotion/timeline.ts), same components as the
 * landscape film; only the layout is rebuilt for a tall frame and kept inside
 * the platforms' safe areas (see ./layout.ts).
 */
export const AbrarITReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.white, fontFamily: FONTS.ui, WebkitFontSmoothing: "antialiased" }}>
    <Audio src={staticFile("voiceover.mp3")} />
    <BackgroundCanvas />

    <Sequence {...sceneSequence("hook")} name="1 · প্রশ্ন">
      <ReelScene01 />
    </Sequence>
    <Sequence {...sceneSequence("loss")} name="2 · ক্ষতি">
      <ReelScene02 />
    </Sequence>
    <Sequence {...sceneSequence("showcase")} name="3 · সমাধান">
      <ReelScene03 />
    </Sequence>
    <Sequence {...sceneSequence("solutions")} name="4 · সলিউশন">
      <ReelScene04 />
    </Sequence>
    <Sequence {...sceneSequence("brand")} name="5 · যোগাযোগ">
      <ReelScene05 />
    </Sequence>

    <SceneWipe
      width={RW}
      height={RH}
      cuts={[SCENES.loss.start, SCENES.showcase.start, SCENES.solutions.start, SCENES.brand.start].map(sec)}
    />
  </AbsoluteFill>
);
