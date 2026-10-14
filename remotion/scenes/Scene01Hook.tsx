import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { COLORS, EASE, SAFE, SPRINGS } from "../theme";
import { beat, sceneFrames } from "../timeline";
import { osc, prog, springAt } from "../anim";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { AnimatedHeadline } from "../components/AnimatedHeadline";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { LiquidGlassCard } from "../components/LiquidGlassCard";
import { Cursor } from "../components/Cursor";
import { LightSweep } from "../components/LightSweep";
import { CorporateSite, CORPORATE_SITE_WIDTH } from "../mockups/CorporateSite";
import { Bar, MediaBlock, Row, Stack } from "../mockups/ui";

const B = (name: Parameters<typeof beat<"hook">>[1]) => beat("hook", name);

/**
 * Scene 1 (0-5s) — the hook.
 * A single orange line sweeps in, a browser window materialises out of the
 * reflection it leaves, and the headline lands word by word.
 */
export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = sceneFrames("hook");

  // Cinematic push-in across the whole scene, plus a hand-off push at the end.
  const push = prog(frame, 0, total, EASE.camera);
  const outro = prog(frame, B("outro"), total - B("outro"), EASE.inOut);
  const cameraScale = 1.075 - push * 0.075 + outro * 0.14;
  const cameraY = 18 - push * 18 - outro * 26;

  const browserSpring = springAt({
    frame,
    fps,
    delay: B("browserIn"),
    config: SPRINGS.entrance,
  });
  const materialise = 1 - prog(frame, B("browserIn") + 6, 26, EASE.out);
  const browserFloat = osc(frame, 260) * 6;

  const cardSpring = springAt({
    frame,
    fps,
    delay: B("floatingCard"),
    config: SPRINGS.soft,
  });

  // The cursor presses the hero CTA just as the headline finishes.
  const press = prog(frame, B("cursorClick"), 6, EASE.snap) - prog(frame, B("cursorClick") + 6, 12, EASE.out);

  return (
    <AbsoluteFill style={{ opacity: 1 - outro * 0.85 }}>
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          transformOrigin: "52% 50%",
        }}
      >
        {/* The opening gesture: one thin orange line that becomes a swash. */}
        <AnimatedOrangeRibbon
          gradientId="hook-ribbon-a"
          curve={[
            { x: -260, y: 840 },
            { x: 440, y: 1120 },
            { x: 1180, y: 180 },
            { x: 2180, y: 470 },
          ]}
          delay={B("ribbonIn")}
          duration={34}
          width={22}
          belly={0.52}
          opacity={0.95}
        />
        <AnimatedOrangeRibbon
          gradientId="hook-ribbon-b"
          curve={[
            { x: -200, y: 1000 },
            { x: 560, y: 1230 },
            { x: 1340, y: 470 },
            { x: 2120, y: 800 },
          ]}
          delay={B("ribbonSecond")}
          duration={40}
          width={9}
          belly={0.4}
          opacity={0.5}
          tipGlow={false}
          drift={16}
        />

        {/* Floating browser window. */}
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 210,
            transform: `perspective(2200px) rotateY(${-9 + (1 - browserSpring) * 7}deg) rotateX(${3 - browserSpring * 1.5}deg) scale(${0.84 + browserSpring * 0.16}) translateY(${(1 - browserSpring) * 46 + browserFloat}px)`,
            transformOrigin: "60% 50%",
            opacity: Math.min(1, browserSpring * 1.8),
            filter: `blur(${(1 - browserSpring) * 14}px)`,
          }}
        >
          <WebsiteBrowserMockup
            width={884}
            height={542}
            contentWidth={CORPORATE_SITE_WIDTH}
            scroll={0}
            materialise={Math.max(0, materialise)}
          >
            <CorporateSite ctaHover={press * 0.9} navHover={prog(frame, B("cursorIn"), 22, EASE.out)} />
          </WebsiteBrowserMockup>
        </div>

        {/* Small website card drifting in front of the window. */}
        <div
          style={{
            position: "absolute",
            right: 806,
            bottom: 74,
            transform: `translateY(${(1 - cardSpring) * 80 + osc(frame, 210, 1.4) * 7}px) rotate(${-3 + (1 - cardSpring) * 4}deg) scale(${0.9 + cardSpring * 0.1})`,
            opacity: Math.min(1, cardSpring * 1.5),
          }}
        >
          <LiquidGlassCard radius={24} style={{ width: 318, padding: 20 }} phase={0.5}>
            <Stack gap={16}>
              <MediaBlock h={132} radius={14} variant={1} />
              <Stack gap={10}>
                <Bar w="72%" h={11} color="#D9D7D0" />
                <Bar w="48%" h={9} />
              </Stack>
              <Row style={{ justifyContent: "space-between", paddingTop: 2 }}>
                <Bar w={64} h={10} color={COLORS.orange} radius={6} />
                <Bar w={34} h={10} />
              </Row>
            </Stack>
          </LiquidGlassCard>
        </div>

        <Cursor
          from={{ x: 1520, y: 960 }}
          to={{ x: 1150, y: 596 }}
          delay={B("cursorIn")}
          duration={30}
          clickAt={B("cursorClick")}
        />

        {/* Headline */}
        <div
          style={{
            position: "absolute",
            left: SAFE,
            top: 312,
            width: 840,
          }}
        >
          <AnimatedHeadline
            lines={[
              { text: COPY.hook.line1 },
              { text: COPY.hook.line2, accent: true },
            ]}
            lineDelays={[B("headlineLine1"), B("headlineLine2")]}
            fontSize={80}
            lineHeight={1.06}
            wordStagger={3.4}
            accentSweep={{ line: 1, delay: B("headlineLine2") + 16, duration: 30, width: 360 }}
          />
        </div>
      </AbsoluteFill>

      <LightSweep delay={B("outro")} duration={total - B("outro")} intensity={0.85} />
    </AbsoluteFill>
  );
};
