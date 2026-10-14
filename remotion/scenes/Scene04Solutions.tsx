import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { EASE, SPRINGS } from "../theme";
import { clamp01, kf, prog, springAt } from "../anim";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { InkFavicon, WebsiteSolutionPanel } from "../components/WebsiteSolutionPanel";
import { CursorPointer } from "../components/Cursor";
import { CorporateSite } from "../site/CorporateSite";
import { ShopSite } from "../site/ShopSite";
import { DashboardApp } from "../site/DashboardApp";

const F = (s: number) => rel("solutions", s);
const C = CUES.solutions;

const W = 1440;
const H = 900;
const K = 0.62;
const CY = 432;
const SPACING = 1000;
const FOCUS_Z = 1.28;
const PULL_Z = 0.64;
const WX = [0, SPACING, SPACING * 2];

/** Fades a caption in on cue and out just before the next one arrives. */
const useCaption = (outAt: number) => {
  const frame = useCurrentFrame();
  const out = prog(frame, outAt, 9, EASE.inOut);
  return { opacity: 1 - out, transform: `translateY(${out * 34}px)` } as const;
};

/**
 * Scene 4 (17.44 - 23.59s): "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর — আপনার
 * ব্যবসার জন্য পেতে পারেন স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন।"
 *
 * Three live sites side by side; the camera moves to each as it is named,
 * then pulls back to show all three.
 */
export const Scene04Solutions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----- camera -------------------------------------------------------------
  const cam = kf(
    frame,
    [
      [0, 0.22],
      [F(C.shopMove), 0.22],
      [F(C.shopMove) + 17, 1],
      [F(C.customMove), 1],
      [F(C.customMove) + 17, 2],
      [F(C.pullBack), 2],
      [F(C.pullBack) + 18, 1],
    ],
    EASE.inOut,
  );
  const camX = cam * SPACING;
  const zoom = kf(
    frame,
    [
      [0, 1.12],
      [F(17.95), FOCUS_Z],
      [F(C.pullBack), FOCUS_Z],
      [F(C.pullBack) + 18, PULL_Z],
    ],
    EASE.inOut,
  );

  const enters = [
    springAt({ frame, fps, delay: F(17.45), config: SPRINGS.soft }),
    springAt({ frame, fps, delay: F(17.52), config: SPRINGS.soft }),
    springAt({ frame, fps, delay: F(17.6), config: SPRINGS.soft }),
  ];

  const panel = (i: number) => {
    const d = WX[i] - camX;
    const focus = clamp01(1 - Math.abs(d) / SPACING);
    return {
      cx: 960 + d * zoom,
      zoom,
      veil: (1 - focus) * 0.9,
      rotateY: -Math.sign(d) * (1 - focus) * 16,
      enter: enters[i],
    };
  };

  // ----- page state -----------------------------------------------------------
  const bizScroll = kf(frame, [[F(17.8), 0], [F(19.1), 1120]], EASE.inOut);
  const bizHover = prog(frame, F(18.5), 10, EASE.out) - prog(frame, F(18.95), 10, EASE.out);

  const shopScroll = kf(frame, [[F(19.45), 0], [F(20.05), 560]], EASE.inOut);
  const hoverP = prog(frame, F(20.02), 9, EASE.out);
  const click = F(C.addToCart);
  const added = prog(frame, click, 8, EASE.out);
  const cart = frame >= click + 2 ? 1 : 0;
  const toast = prog(frame, click + 2, 10, EASE.out) - prog(frame, click + 40, 12, EASE.inOut);

  const dashP = prog(frame, F(21.55), 40, EASE.out);
  const tip = prog(frame, F(22.75), 10, EASE.out);

  // cursor over the shop window: lives in that window's screen space
  const shopPanel = panel(1);
  const shopLeft = shopPanel.cx - (W * K * shopPanel.zoom) / 2;
  const shopTop = CY - (H * K * shopPanel.zoom) / 2;
  const cursorTarget = { x: 322, y: 640 }; // inside the shop viewport, CSS px
  const curKeyIn = F(19.75);
  const curP = kf(frame, [[curKeyIn, 0], [F(20.02), 1]], EASE.camera);
  const sx = (px: number, py: number) => ({
    x: shopLeft + px * K * shopPanel.zoom,
    y: shopTop + py * K * shopPanel.zoom,
  });
  const from = sx(cursorTarget.x + 520, cursorTarget.y + 180);
  const to = sx(cursorTarget.x + 4, cursorTarget.y + 12);
  const curOpacity = prog(frame, curKeyIn - 4, 8, EASE.out) - prog(frame, click + 24, 10, EASE.out);
  const curPress = prog(frame, click - 1, 4, EASE.snap) - prog(frame, click + 4, 8, EASE.out);

  // ----- captions ---------------------------------------------------------------
  const cap1 = useCaption(F(19.4));
  const cap2 = useCaption(F(21.72));

  return (
    <AbsoluteFill>
      <AnimatedOrangeRibbon
        gradientId="sol-a"
        curve={[
          { x: -300, y: 300 },
          { x: 500, y: -120 },
          { x: 1400, y: 1180 },
          { x: 2240, y: 760 },
        ]}
        delay={0}
        duration={50}
        width={15}
        belly={0.5}
        opacity={0.4}
        tipGlow={false}
      />

      <WebsiteSolutionPanel width={W} height={H} k={K} cy={CY} {...panel(0)} title="আর্বান নেস্ট — স্বপ্নের ঠিকানা" url="urbannest.com.bd">
        {(w, h) => <CorporateSite width={w} height={h} scroll={bizScroll} cardHover={Math.max(0, bizHover)} />}
      </WebsiteSolutionPanel>

      <WebsiteSolutionPanel width={W} height={H} k={K} cy={CY} {...panel(1)} title="লুমি — লাইফস্টাইল স্টোর" url="lumi.com.bd" favicon={<InkFavicon />}>
        {(w, h) => <ShopSite width={w} height={h} scroll={shopScroll} hoverIndex={1} hover={hoverP} added={added} cartCount={cart} toast={Math.max(0, toast)} />}
      </WebsiteSolutionPanel>

      <WebsiteSolutionPanel width={W} height={H} k={K} cy={CY} {...panel(2)} title="বিজ হাব — ড্যাশবোর্ড" url="app.bizhub.com.bd">
        {(w, h) => <DashboardApp width={w} height={h} p={dashP} tip={tip} />}
      </WebsiteSolutionPanel>

      {curOpacity > 0.01 ? (
        <CursorPointer
          x={from.x + (to.x - from.x) * curP}
          y={from.y + (to.y - from.y) * curP}
          opacity={curOpacity}
          press={curPress}
          ripple={frame >= click && frame < click + 24 ? (frame - click) / 24 : undefined}
        />
      ) : null}

      {/* captions: one per window, as named */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, ...cap1 }}>
        <AnimatedHeadline align="center" fontSize={84} lines={[line(COPY.solutions.business, [F(17.7), F(18.12)], 4, [1])]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, ...cap2 }}>
        <AnimatedHeadline align="center" fontSize={84} lines={[line("ই-কমার্স স্টোর", [F(19.5), F(19.95)], 4, [1])]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 838 }}>
        <AnimatedHeadline align="center" fontSize={60} lines={[line("স্মার্ট ও কাস্টমাইজড", [F(21.88), F(22.2), F(22.3)])]} />
        <AnimatedHeadline align="center" fontSize={84} style={{ marginTop: 2 }} lines={[line("ওয়েব সলিউশন", [F(22.86), F(23.02)], 4, "all")]} />
      </div>
    </AbsoluteFill>
  );
};
