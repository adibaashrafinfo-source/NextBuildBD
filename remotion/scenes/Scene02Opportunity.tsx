import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { COLORS, EASE, SAFE, SPRINGS } from "../theme";
import { beat, sceneFrames } from "../timeline";
import { osc, prog, springAt } from "../anim";
import { AnimatedHeadline } from "../components/AnimatedHeadline";
import { LiquidGlassCard } from "../components/LiquidGlassCard";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { LightSweep } from "../components/LightSweep";
import { CorporateSite, CORPORATE_SITE_WIDTH } from "../mockups/CorporateSite";
import { Bar, Label, MediaBlock, Row, Stack } from "../mockups/ui";

const B = (name: Parameters<typeof beat<"opportunity">>[1]) => beat("opportunity", name);

/**
 * Scene 2 (5-9s) — digital opportunity.
 * The camera flies through the browser from scene 1 and lands on a clean
 * business website, framed by glass panels, with the BUILD TRUST line on
 * untouched white so it stays perfectly legible.
 */
export const Scene02Opportunity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = sceneFrames("opportunity");

  // Arrive big (continuing scene 1's push) and settle into the resting frame.
  const land = prog(frame, 0, 46, EASE.camera);
  const slowPush = prog(frame, 0, total, EASE.camera);
  const outro = prog(frame, B("lightSweep"), total - B("lightSweep"), EASE.inOut);

  const arrive = interpolate(land, [0, 1], [1.62, 1]);
  const siteBlur = (1 - land) * 9;

  // The page keeps moving so it never reads as a screenshot.
  const scroll = interpolate(
    frame,
    [0, 22, 48, 104, total],
    [6, 14, 110, 450, 500],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut },
  );

  const panelsSpring = springAt({
    frame,
    fps,
    delay: B("glassPanels"),
    config: SPRINGS.soft,
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - outro * 0.55 }}>
      {/* ---- the website, in a large window bleeding off the right edge ---- */}
      <div
        style={{
          position: "absolute",
          left: 762,
          top: 146,
          transform: `scale(${arrive + slowPush * 0.03}) translate(${(1 - land) * -300}px, ${(1 - land) * 40}px)`,
          transformOrigin: "26% 50%",
          filter: siteBlur > 0.4 ? `blur(${siteBlur}px)` : undefined,
        }}
      >
        <WebsiteBrowserMockup
          width={1136}
          height={788}
          contentWidth={CORPORATE_SITE_WIDTH}
          scroll={scroll}
          radius={24}
        >
          <CorporateSite
            navHover={prog(frame, 8, 26, EASE.out)}
            cardHover={prog(frame, 52, 30, EASE.out)}
          />
        </WebsiteBrowserMockup>
      </div>

      {/* ---- glass panels floating over the interface ---- */}
      <div
        style={{
          position: "absolute",
          left: 1430,
          top: 236,
          transform: `translateY(${(1 - panelsSpring) * 70 + osc(frame, 250) * 6}px) rotate(2deg)`,
          opacity: Math.min(1, panelsSpring * 1.4),
        }}
      >
        <LiquidGlassCard radius={26} style={{ width: 344, padding: 24 }} phase={0.2}>
          <Stack gap={18}>
            <Row style={{ justifyContent: "space-between" }}>
              <Label size={15} weight={700} color={COLORS.ink}>
                Live Preview
              </Label>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: COLORS.orange }} />
            </Row>
            <MediaBlock h={148} radius={14} variant={3} />
            <Stack gap={9}>
              <Bar w="78%" h={10} color="#D4D2CB" />
              <Bar w="52%" h={9} />
            </Stack>
          </Stack>
        </LiquidGlassCard>
      </div>

      <div
        style={{
          position: "absolute",
          left: 636,
          bottom: 152,
          transform: `translateY(${(1 - panelsSpring) * 104 + osc(frame, 300, 2.1) * 8}px) rotate(-2deg)`,
          opacity: Math.min(1, panelsSpring * 1.2),
        }}
      >
        <LiquidGlassCard radius={22} style={{ width: 288, padding: 20 }} phase={0.9}>
          <Row gap={16}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: `linear-gradient(145deg, rgba(241,89,34,0.22), rgba(241,89,34,0.08))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: `3px solid ${COLORS.orange}`,
                }}
              />
            </div>
            <Stack gap={10} style={{ flex: 1 }}>
              <Bar w="82%" h={10} color="#D4D2CB" />
              <Bar w="56%" h={9} />
            </Stack>
          </Row>
        </LiquidGlassCard>
      </div>

      {/* ---- headline on clean white ---- */}
      <div style={{ position: "absolute", left: SAFE, top: 392, width: 650 }}>
        <AnimatedHeadline
          lines={[
            { text: COPY.opportunity.line1 },
            { text: COPY.opportunity.line2, accent: true },
          ]}
          lineDelays={[B("headlineLine1"), B("headlineLine2")]}
          fontSize={72}
          lineHeight={1.09}
          wordStagger={3.6}
          accentSweep={{ line: 1, delay: B("headlineLine2") + 18, duration: 28, width: 620 }}
        />
      </div>

      <LightSweep delay={B("lightSweep")} duration={30} intensity={1} warm />
    </AbsoluteFill>
  );
};
