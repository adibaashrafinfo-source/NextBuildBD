import { Composition } from "remotion";
import { AbrarITPromo } from "./AbrarITPromo";
import { AbrarITReel } from "./reel/AbrarITReel";
import { RH, RW } from "./reel/layout";
import { loadBrandFonts } from "./fonts";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";

loadBrandFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AbrarITPromo"
      component={AbrarITPromo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition id="AbrarITReel" component={AbrarITReel} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={RW} height={RH} />
  </>
);
