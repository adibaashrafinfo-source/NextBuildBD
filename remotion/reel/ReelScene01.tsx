import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { EASE, SPRINGS } from "../theme";
import { kf, osc, prog, springAt } from "../anim";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { Cursor } from "../components/Cursor";
import { LogoReveal } from "../components/LogoReveal";
import { NotFoundPage } from "../site/ScenePages";
import { RH, RW, SAFE_LEFT, SAFE_TOP } from "./layout";

const F = (s: number) => rel("hook", s);
const C = CUES.hook;

/** A 1440x900 browser at 0.62x = 893x558, centred in the lower half. */
const WIN = { w: 1440, h: 900, k: 0.62, cx: RW / 2, cy: 1100 };

/** Reel scene 1: the question, over a browser that opens on a 404. */
export const ReelScene01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const win = springAt({ frame, fps, delay: F(C.window), config: SPRINGS.soft });
  const float = osc(frame, 250) * 7;
  const hover = prog(frame, F(C.click) - 10, 8, EASE.out) - prog(frame, F(C.click) + 12, 10, EASE.out);
  const shake = prog(frame, F(C.click) + 4, 26, EASE.out);
  const push = kf(frame, [[0, 1.04], [F(3.3), 1]], EASE.camera);

  // retry button, in screen px, from its place on the 404 page
  const left = WIN.cx - (WIN.w * WIN.k) / 2;
  const top = WIN.cy - (WIN.h * WIN.k) / 2;
  const target = { x: left + 781 * WIN.k, y: top + 790 * WIN.k };

  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 55%" }}>
      <AnimatedOrangeRibbon
        gradientId="rhook-a"
        viewW={RW}
        viewH={RH}
        curve={[
          { x: -260, y: 1560 },
          { x: 260, y: 1980 },
          { x: 900, y: 420 },
          { x: 1340, y: 820 },
        ]}
        delay={F(C.ribbon)}
        duration={34}
        width={22}
        belly={0.5}
        opacity={0.95}
      />
      <AnimatedOrangeRibbon
        gradientId="rhook-b"
        viewW={RW}
        viewH={RH}
        curve={[
          { x: -220, y: 1700 },
          { x: 360, y: 2060 },
          { x: 960, y: 760 },
          { x: 1300, y: 1180 },
        ]}
        delay={F(C.ribbon) + 8}
        duration={40}
        width={8}
        belly={0.4}
        opacity={0.45}
        tipGlow={false}
      />

      <div style={{ position: "absolute", left: SAFE_LEFT, top: SAFE_TOP }}>
        <LogoReveal width={250} delay={4} duration={20} />
      </div>

      <div style={{ position: "absolute", left: SAFE_LEFT, top: 400 }}>
        <AnimatedHeadline
          fontSize={80}
          lines={[
            line(COPY.hook.line1, C.line1.map(F)),
            line(COPY.hook.line2, C.line2.map(F), 4, [1]),
            line(COPY.hook.line3, C.line3.map(F), 4, [0]),
          ]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left,
          top,
          transform: `perspective(2400px) translateY(${(1 - win) * 110 + float}px) rotateY(${-8 + (1 - win) * 7}deg) rotateX(${2 - win}deg) scale(${0.9 + win * 0.1})`,
          transformOrigin: "50% 60%",
          opacity: Math.min(1, win * 2),
        }}
      >
        <WebsiteBrowserMockup
          width={WIN.w}
          height={WIN.h}
          scale={WIN.k}
          title="পেজ পাওয়া যায়নি"
          url="apnarbusiness.com"
          urlTyped={prog(frame, F(C.url), 26, EASE.out)}
          favicon={<span style={{ width: 18, height: 18, borderRadius: 5, background: "#C9C6BF" }} />}
        >
          {(w, h) => <NotFoundPage width={w} height={h} hover={Math.max(0, hover)} shake={shake} intro={prog(frame, F(C.url) + 14, 14, EASE.out)} />}
        </WebsiteBrowserMockup>
      </div>

      <Cursor
        keys={[
          { f: F(C.cursorIn), x: 980, y: 1560 },
          { f: F(C.click), x: target.x, y: target.y, click: true },
          { f: F(C.click) + 18, x: target.x + 12, y: target.y + 14 },
        ]}
      />
    </AbsoluteFill>
  );
};
