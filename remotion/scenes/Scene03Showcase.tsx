import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { COLORS, EASE, FONTS, SPRINGS } from "../theme";
import { beat, sceneFrames } from "../timeline";
import { osc, prog, springAt } from "../anim";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { DeviceSlot, PhoneFrame, TabletFrame } from "../components/ResponsiveDeviceShowcase";
import { GlassLabel } from "../components/LiquidGlassCard";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { LightSweep } from "../components/LightSweep";
import { CorporateSite, CORPORATE_SITE_WIDTH } from "../mockups/CorporateSite";
import {
  MOBILE_SITE_WIDTH,
  MobileSite,
  TABLET_SITE_WIDTH,
  TabletSite,
} from "../mockups/ResponsiveSite";

const B = (name: Parameters<typeof beat<"showcase">>[1]) => beat("showcase", name);

/** Hero browser geometry before the split, and the desktop slot after it. */
const BIG = { w: 1380, h: 812, x: 960, y: 548 };
const DESKTOP = { w: 836, h: 522, x: 566, y: 528 };

const LABELS: readonly { text: string; beat: Parameters<typeof beat<"showcase">>[1]; x: number; y: number; phase: number }[] = [
  { text: COPY.showcase.labels[0], beat: "labelUiUx", x: 236, y: 168, phase: 0 },
  { text: COPY.showcase.labels[1], beat: "labelResponsive", x: 1318, y: 166, phase: 0.6 },
  { text: COPY.showcase.labels[2], beat: "labelPerformance", x: 486, y: 918, phase: 1.2 },
];

/**
 * Scene 3 (9-17s) — the website development showcase.
 * A large browser builds itself, scrolls through a finished corporate site with
 * live UI interactions, then separates into desktop, tablet and phone.
 */
export const Scene03Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = sceneFrames("showcase");

  const enter = springAt({ frame, fps, delay: B("browserIn"), config: SPRINGS.entrance });
  const split = springAt({ frame, fps, delay: B("devicesSplit"), config: SPRINGS.soft });
  const outro = prog(frame, B("outro"), total - B("outro"), EASE.inOut);

  // Eased, paused scroll through the page — never a constant crawl.
  const scroll = interpolate(
    frame,
    [
      B("scrollStart"),
      B("scrollStart") + 24,
      B("scrollStart") + 32,
      B("scrollStart") + 54,
      B("scrollEnd"),
      B("devicesSplit") + 8,
      B("devicesSplit") + 44,
    ],
    // Scrolls down through the page, then eases back to the hero so all three
    // devices come to rest on the same section of the same site.
    [0, 600, 640, 1150, 1240, 1240, 250],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut },
  );

  // Micro-interactions inside the page.
  const navHover = prog(frame, B("navDraw"), 26, EASE.out);
  const ctaHover =
    prog(frame, B("hoverCta"), 12, EASE.out) - prog(frame, B("hoverCta") + 26, 14, EASE.out);
  const cardHover =
    prog(frame, B("cardsIn") + 26, 16, EASE.out) - prog(frame, B("scrollStart") + 20, 14, EASE.out);

  // Desktop window morphs from hero size into its slot in the device trio.
  const w = interpolate(split, [0, 1], [BIG.w, DESKTOP.w]);
  const h = interpolate(split, [0, 1], [BIG.h, DESKTOP.h]);
  const cx = interpolate(split, [0, 1], [BIG.x, DESKTOP.x]);
  const cy = interpolate(split, [0, 1], [BIG.y, DESKTOP.y]);

  const camera = 1.04 - prog(frame, 0, total * 0.8, EASE.camera) * 0.04 - outro * 0.05;
  const float = osc(frame, 280) * 5;

  return (
    <AbsoluteFill style={{ opacity: 1 - outro * 0.9 }}>
      <AnimatedOrangeRibbon
        gradientId="showcase-ribbon"
        curve={[
          { x: -220, y: 300 },
          { x: 560, y: -140 },
          { x: 1420, y: 1180 },
          { x: 2180, y: 700 },
        ]}
        delay={B("browserIn")}
        duration={64}
        width={13}
        belly={0.5}
        opacity={0.28}
        tipGlow={false}
        drift={14}
      />

      <AbsoluteFill
        style={{
          perspective: 2600,
          transform: `scale(${camera})`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* ----- desktop / hero browser ----- */}
        <DeviceSlot
          x={cx}
          y={cy + float}
          rotateY={interpolate(split, [0, 1], [-2 + (1 - enter) * 8, 7])}
          rotateX={interpolate(split, [0, 1], [2.5, 2]) * (1 - (1 - enter) * 0.4)}
          scale={0.9 + enter * 0.1}
          opacity={Math.min(1, enter * 1.6)}
          style={{ filter: enter < 0.98 ? `blur(${(1 - enter) * 12}px)` : undefined, zIndex: 3 }}
        >
          <WebsiteBrowserMockup
            width={w}
            height={h}
            contentWidth={CORPORATE_SITE_WIDTH}
            scroll={scroll}
            materialise={Math.max(0, 1 - prog(frame, B("browserIn") + 2, 22, EASE.out))}
          >
            <CorporateSite navHover={navHover} ctaHover={Math.max(0, ctaHover)} cardHover={Math.max(0, cardHover)} />
          </WebsiteBrowserMockup>
        </DeviceSlot>

        {/* ----- tablet ----- */}
        <DeviceSlot
          x={interpolate(split, [0, 1], [1020, 1206])}
          y={interpolate(split, [0, 1], [600, 520]) + osc(frame, 320, 0.9) * 6}
          rotateY={interpolate(split, [0, 1], [-26, -7])}
          rotateX={2}
          scale={interpolate(split, [0, 1], [0.74, 1])}
          opacity={interpolate(split, [0, 0.35, 1], [0, 0.25, 1], { extrapolateRight: "clamp" })}
          style={{ zIndex: 2 }}
        >
          <TabletFrame width={468} height={624}>
            <div
              style={{
                width: TABLET_SITE_WIDTH,
                transform: `scale(${(468 - 26) / TABLET_SITE_WIDTH}) translateY(${-scroll * 0.34}px)`,
                transformOrigin: "top left",
              }}
            >
              <TabletSite />
            </div>
          </TabletFrame>
        </DeviceSlot>

        {/* ----- phone ----- */}
        <DeviceSlot
          x={interpolate(split, [0, 1], [1130, 1636])}
          y={interpolate(split, [0, 1], [620, 544]) + osc(frame, 360, 1.8) * 7}
          rotateY={interpolate(split, [0, 1], [-34, -11])}
          rotateX={2}
          scale={interpolate(split, [0, 1], [0.66, 1])}
          opacity={interpolate(split, [0, 0.45, 1], [0, 0.2, 1], { extrapolateRight: "clamp" })}
          style={{ zIndex: 1 }}
        >
          <PhoneFrame width={300} height={624}>
            <div
              style={{
                width: MOBILE_SITE_WIDTH,
                transform: `scale(${(300 - 25) / MOBILE_SITE_WIDTH}) translateY(${-scroll * 0.18}px)`,
                transformOrigin: "top left",
              }}
            >
              <MobileSite />
            </div>
          </PhoneFrame>
        </DeviceSlot>
      </AbsoluteFill>

      {/* ----- floating glass feature labels ----- */}
      {LABELS.map((label) => {
        const s = springAt({ frame, fps, delay: B(label.beat), config: SPRINGS.entrance });
        if (s <= 0.001) {
          return null;
        }
        const parallax = osc(frame, 240, label.phase) * 9;
        return (
          <div
            key={label.text}
            style={{
              position: "absolute",
              left: label.x,
              top: label.y,
              transform: `translate(-50%, -50%) translateY(${(1 - s) * 44 + parallax}px) scale(${0.9 + s * 0.1})`,
              opacity: Math.min(1, s * 1.5),
              zIndex: 6,
            }}
          >
            <GlassLabel phase={label.phase}>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 27,
                  fontWeight: 800,
                  letterSpacing: "0.095em",
                  color: COLORS.ink,
                }}
              >
                {label.text}
              </span>
            </GlassLabel>
          </div>
        );
      })}

      <LightSweep delay={B("devicesSplit") - 4} duration={26} intensity={0.75} />
      <LightSweep delay={B("outro") + 4} duration={22} intensity={0.8} />
    </AbsoluteFill>
  );
};
