import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COPY } from "../brand";
import { EASE } from "../theme";
import { beat, sceneFrames } from "../timeline";
import { prog } from "../anim";
import { WebsiteSolutionPanel } from "../components/WebsiteSolutionPanel";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { LightSweep } from "../components/LightSweep";
import { CorporateSite, CORPORATE_SITE_WIDTH } from "../mockups/CorporateSite";
import { EcommerceSite, ECOMMERCE_SITE_WIDTH } from "../mockups/EcommerceSite";
import { DashboardApp, DASHBOARD_WIDTH } from "../mockups/DashboardApp";

const B = (name: Parameters<typeof beat<"solutions">>[1]) => beat("solutions", name);

const PANEL = { w: 552, h: 552 };

/**
 * Scene 4 (17-24s) — three web solutions under glass.
 * Each panel enters differently, they float in 3D, then align into a clean row
 * as their captions land.
 */
export const Scene04Solutions: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sceneFrames("solutions");

  const outro = prog(frame, B("outro"), total - B("outro"), EASE.inOut);
  const settle = prog(frame, 0, total, EASE.camera);
  const camera = 1.06 - settle * 0.06 - outro * 0.04;

  const panels = [
    {
      key: "business",
      label: COPY.solutions.labels[0],
      delay: B("panel1"),
      labelDelay: B("label1"),
      entrance: "rise" as const,
      restRotateY: 7,
      phase: 0,
      content: <CorporateSite navHover={1} />,
      contentWidth: CORPORATE_SITE_WIDTH,
      scroll: 30,
    },
    {
      key: "ecommerce",
      label: COPY.solutions.labels[1],
      delay: B("panel2"),
      labelDelay: B("label2"),
      entrance: "zoom" as const,
      restRotateY: 0,
      phase: 0.55,
      content: (
        <EcommerceSite
          tileHover={prog(frame, B("align") + 20, 18, EASE.out) - prog(frame, B("align") + 70, 16, EASE.out)}
        />
      ),
      contentWidth: ECOMMERCE_SITE_WIDTH,
      scroll: 0,
    },
    {
      key: "custom",
      label: COPY.solutions.labels[2],
      delay: B("panel3"),
      labelDelay: B("label3"),
      entrance: "swing" as const,
      restRotateY: -7,
      phase: 1.1,
      content: <DashboardApp />,
      contentWidth: DASHBOARD_WIDTH,
      scroll: 0,
    },
  ];

  return (
    <AbsoluteFill style={{ opacity: 1 - outro * 0.9 }}>
      <AnimatedOrangeRibbon
        gradientId="solutions-ribbon"
        curve={[
          { x: -240, y: 880 },
          { x: 540, y: 1220 },
          { x: 1400, y: 140 },
          { x: 2200, y: 430 },
        ]}
        delay={B("panel1")}
        duration={70}
        width={15}
        belly={0.48}
        opacity={0.26}
        tipGlow={false}
        drift={12}
      />

      <AbsoluteFill
        style={{
          perspective: 2800,
          transform: `scale(${camera}) translateY(${outro * -40}px)`,
          transformOrigin: "50% 48%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 58,
            transformStyle: "preserve-3d",
            paddingTop: 36,
          }}
        >
          {panels.map((panel) => (
            <WebsiteSolutionPanel
              key={panel.key}
              width={PANEL.w}
              height={PANEL.h}
              contentWidth={panel.contentWidth}
              scroll={panel.scroll}
              label={panel.label}
              delay={panel.delay}
              labelDelay={panel.labelDelay}
              alignDelay={B("align")}
              entrance={panel.entrance}
              restRotateY={panel.restRotateY}
              phase={panel.phase}
              sweepDelay={B("reflectionSweep")}
            >
              {panel.content}
            </WebsiteSolutionPanel>
          ))}
        </div>
      </AbsoluteFill>

      <LightSweep delay={B("outro") + 2} duration={24} intensity={0.85} />
    </AbsoluteFill>
  );
};
