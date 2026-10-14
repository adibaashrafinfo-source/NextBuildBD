import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { COLORS, EASE, SPRINGS } from "../theme";
import { kf, osc, prog, springAt } from "../anim";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { Cursor } from "../components/Cursor";
import { LogoReveal } from "../components/LogoReveal";
import { NotFoundPage } from "../site/ScenePages";

const F = (s: number) => rel("hook", s);
const C = CUES.hook;

/** Window geometry: a 1440x900 browser shown at 0.62x. */
const WIN = { w: 1440, h: 900, k: 0.62, cx: 1440, cy: 552 };

/**
 * Scene 1 (0 - 3.3s): "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?"
 * The question lands word by word while a browser opens on an honest 404.
 */
export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const win = springAt({ frame, fps, delay: F(C.window), config: SPRINGS.soft });
  const float = osc(frame, 250) * 7;
  const hover = prog(frame, F(C.click) - 10, 8, EASE.out) - prog(frame, F(C.click) + 12, 10, EASE.out);
  const shake = prog(frame, F(C.click) + 4, 26, EASE.out);

  // Slow cinematic push across the whole scene.
  const push = kf(frame, [[0, 1.04], [F(3.3), 1]], EASE.camera);

  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "40% 50%" }}>
      <AnimatedOrangeRibbon
        gradientId="hook-a"
        curve={[
          { x: -320, y: 930 },
          { x: 420, y: 1180 },
          { x: 1120, y: -60 },
          { x: 2260, y: 380 },
        ]}
        delay={F(C.ribbon)}
        duration={34}
        width={22}
        belly={0.5}
        opacity={0.95}
      />
      <AnimatedOrangeRibbon
        gradientId="hook-b"
        curve={[
          { x: -260, y: 1010 },
          { x: 560, y: 1250 },
          { x: 1340, y: 420 },
          { x: 2180, y: 820 },
        ]}
        delay={F(C.ribbon) + 8}
        duration={40}
        width={8}
        belly={0.4}
        opacity={0.45}
        tipGlow={false}
      />

      {/* brand presence from the first frame */}
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <LogoReveal width={250} delay={4} duration={20} />
      </div>

      {/* the question */}
      <div style={{ position: "absolute", left: 120, top: 330 }}>
        <AnimatedHeadline
          fontSize={72}
          lines={[
            line(COPY.hook.line1, C.line1.map(F)),
            line(COPY.hook.line2, C.line2.map(F), 4, [1]),
            line(COPY.hook.line3, C.line3.map(F), 4, [0]),
          ]}
        />
      </div>

      {/* browser on a 404 */}
      <div
        style={{
          position: "absolute",
          left: WIN.cx - (WIN.w * WIN.k) / 2,
          top: WIN.cy - (WIN.h * WIN.k) / 2,
          transform: `perspective(2400px) translateY(${(1 - win) * 90 + float}px) rotateY(${-9 + (1 - win) * 8}deg) rotateX(${3 - win * 1}deg) scale(${0.9 + win * 0.1})`,
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
          { f: F(C.cursorIn), x: 1860, y: 930 },
          { f: F(C.click), x: 1478, y: 744, click: true },
          { f: F(C.click) + 18, x: 1490, y: 760 },
        ]}
      />
    </AbsoluteFill>
  );
};

export { COLORS };
