import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { COLORS, EASE, SPRINGS } from "../theme";
import { kf, osc, prog, springAt } from "../anim";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { AnimatedOrangeRibbon } from "../components/AnimatedOrangeRibbon";
import { WebsiteBrowserMockup } from "../components/WebsiteBrowserMockup";
import { CursorPointer } from "../components/Cursor";
import { LogoReveal } from "../components/LogoReveal";
import {
  PHONE_OUTER,
  ResponsiveDeviceShowcase,
  SHOWCASE_BOTTOM,
} from "../components/ResponsiveDeviceShowcase";
import { CorporateSite } from "../site/CorporateSite";

const F = (s: number) => rel("showcase", s);
const C = CUES.showcase;

/** A 1440x900 browser shown at 0.78x, kept centred as it narrows. */
const K = 0.78;
const WIN_H = 900;
const CX = 960;
const CY = 441;
const NARROW_CSS = 442;
const PHONE_FINAL = { x: 1622, y: SHOWCASE_BOTTOM - PHONE_OUTER.h / 2 };

const STREAKS = [
  { y: 150, len: 340, d: 0 },
  { y: 290, len: 240, d: 2 },
  { y: 450, len: 420, d: 4 },
  { y: 610, len: 280, d: 1 },
  { y: 730, len: 360, d: 3 },
];

/**
 * Scene 3 (8.67 - 17.44s): "Abrar IT দিচ্ছে আধুনিক, দ্রুতগতির ও মোবাইল-ফ্রেন্ডলি
 * ওয়েবসাইট, যা আপনার ব্র্যান্ডকে তুলে ধরে আরও প্রফেশনালভাবে।"
 *
 * One site loads, scrolls and reacts; the window is dragged narrow and the
 * layout reflows live into a phone; then desktop, tablet and phone stand side
 * by side showing the same site. The narration runs as a lower-third.
 */
export const Scene03Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winIn = springAt({ frame, fps, delay: F(C.window), config: SPRINGS.soft });
  const float = osc(frame, 260) * 5;

  // --- page state -----------------------------------------------------------
  const intro = prog(frame, F(C.window) + 6, 40, EASE.out);
  const loadStart = F(C.window) + 4;
  const loading =
    frame < F(9.7)
      ? prog(frame, loadStart, F(9.6) - loadStart, EASE.soft)
      : frame >= F(C.fast) && frame <= F(C.fast) + 11
        ? prog(frame, F(C.fast), 10, EASE.out)
        : 0;
  const scroll = kf(frame, [[F(9.85), 0], [F(10.5), 650], [F(11.55), 650], [F(12.0), 0]], EASE.inOut);
  const cardHover = prog(frame, F(C.cardHover), 10, EASE.out) - prog(frame, F(11.08), 10, EASE.out);
  const navHover = prog(frame, F(9.55), 22, EASE.out);

  // --- the drag: window narrows, layout reflows ------------------------------
  const dragStart = F(C.mobile);
  const dragEnd = F(C.dragOut);
  const cssW = kf(frame, [[dragStart, 1440], [dragEnd, NARROW_CSS]], EASE.inOut);
  const halfW = (cssW * K) / 2;
  const handle = prog(frame, F(C.dragIn) + 4, 8, EASE.out) - prog(frame, dragEnd + 2, 8, EASE.out);

  const approach = kf(frame, [[F(C.dragIn), 0], [dragStart, 1]], EASE.camera);
  const curX = frame < dragStart ? 1780 + (CX + 1440 * K * 0.5 + 6 - 1780) * approach : CX + halfW + 6;
  const curY = frame < dragStart ? 900 + (CY + 40 - 900) * approach : CY + 40 + Math.sin((frame - dragStart) / 9) * 4;
  const curOpacity = prog(frame, F(C.dragIn) - 4, 8, EASE.out) - prog(frame, dragEnd + 6, 10, EASE.out);
  const curPress = prog(frame, dragStart - 2, 5, EASE.snap) - prog(frame, dragEnd, 8, EASE.out);

  // --- morph into the trio -----------------------------------------------------
  const morph = prog(frame, F(C.morph), 9, EASE.out);
  const slide = prog(frame, F(13.42), 22, EASE.expo);
  const phoneCx = CX * (1 - slide) + PHONE_FINAL.x * slide;
  const phoneCy = CY * (1 - slide) + PHONE_FINAL.y * slide;

  // --- camera + ambience --------------------------------------------------------
  const push = kf(frame, [[F(13.4), 1], [F(17.44), 1.05]], EASE.camera);
  const glow = prog(frame, F(C.brandLine) - 6, 24, EASE.out);
  const logoOut = prog(frame, F(10.2), 10, EASE.inOut);
  const capAOut = prog(frame, F(13.32), 10, EASE.inOut);
  const fastP = frame - F(C.fast);

  return (
    <AbsoluteFill>
      <AnimatedOrangeRibbon
        gradientId="show-a"
        curve={[
          { x: -300, y: 760 },
          { x: 500, y: 1130 },
          { x: 1300, y: 40 },
          { x: 2240, y: 300 },
        ]}
        delay={F(C.window)}
        duration={48}
        width={16}
        belly={0.5}
        opacity={0.5}
        tipGlow={false}
      />

      <div
        style={{
          position: "absolute",
          left: CX - 800,
          top: CY - 430,
          width: 1600,
          height: 860,
          background: "radial-gradient(50% 50% at 50% 50%, rgba(241,89,34,0.17) 0%, rgba(241,89,34,0) 70%)",
          opacity: glow,
        }}
      />

      {/* everything on the stage shares one slow camera push */}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${CX}px ${CY + 60}px` }}>
        {morph < 0.99 ? (
          <div
            style={{
              position: "absolute",
              left: CX - halfW,
              top: CY - (WIN_H * K) / 2,
              opacity: Math.min(1, winIn * 2) * (1 - morph),
              transform: `perspective(2800px) translateY(${(1 - winIn) * 120 + float}px) rotateX(${2 - winIn * 0.6}deg) scale(${0.93 + winIn * 0.07 - morph * 0.04})`,
              transformOrigin: "50% 60%",
            }}
          >
            <WebsiteBrowserMockup
              width={cssW}
              height={WIN_H}
              scale={K}
              loading={loading}
              title="আর্বান নেস্ট — স্বপ্নের ঠিকানা"
              url="urbannest.com.bd"
            >
              {(w, h) => <CorporateSite width={w} height={h} scroll={scroll} intro={intro} navHover={navHover} cardHover={Math.max(0, cardHover)} />}
            </WebsiteBrowserMockup>
            {handle > 0.02 ? (
              <div
                style={{
                  position: "absolute",
                  left: cssW * K - 4,
                  top: (WIN_H * K) / 2 - 56,
                  width: 8,
                  height: 112,
                  borderRadius: 8,
                  background: COLORS.orange,
                  boxShadow: "0 0 24px rgba(241,89,34,0.8)",
                  opacity: handle,
                }}
              />
            ) : null}
          </div>
        ) : null}

        <ResponsiveDeviceShowcase
          enterAt={F(C.trio)}
          phoneCx={phoneCx}
          phoneCy={phoneCy}
          phoneOpacity={morph}
          glareFrom={F(C.brandLine)}
          glareTo={F(16.6)}
          scrollFrom={F(15.1)}
          scrollTo={F(17.3)}
        />
      </AbsoluteFill>

      {/* speed lines on "দ্রুতগতির" */}
      {fastP > -2 && fastP < 22
        ? STREAKS.map((s, i) => {
            const p = prog(frame, F(C.fast) + s.d, 16, EASE.inOut);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -420 + p * 2600,
                  top: s.y,
                  width: s.len,
                  height: 4,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, rgba(241,89,34,0), ${COLORS.orange})`,
                  opacity: Math.sin(Math.min(1, p) * Math.PI) * 0.7,
                }}
              />
            );
          })
        : null}

      {curOpacity > 0.01 ? <CursorPointer x={curX} y={curY} opacity={curOpacity} press={curPress} /> : null}

      {/* "Abrar IT দিচ্ছে" — the logo, before the qualities start */}
      <div
        style={{
          position: "absolute",
          left: 960 - 220,
          top: 870,
          opacity: 1 - logoOut,
          transform: `translateY(${-logoOut * 34}px)`,
        }}
      >
        <LogoReveal width={440} delay={F(C.logo)} duration={26} />
      </div>

      {/* caption A: "আধুনিক, দ্রুতগতির ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 848,
          opacity: 1 - capAOut,
          transform: `translateY(${capAOut * 36}px)`,
        }}
      >
        <AnimatedHeadline
          align="center"
          fontSize={72}
          lines={[
            line("আধুনিক, দ্রুতগতির", [F(C.modern), F(C.fast)]),
            line("ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট", [F(C.mobile), F(C.mobile) + 6, F(12.6)], 4, [2]),
          ]}
        />
      </div>

      {/* caption B: "যা আপনার ব্র্যান্ডকে তুলে ধরে আরও প্রফেশনালভাবে" */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 850 }}>
        <AnimatedHeadline
          align="center"
          fontSize={54}
          lines={[line(COPY.showcase.brand, [F(14.2), F(14.62), F(15.2), F(15.5)])]}
        />
        <AnimatedHeadline
          align="center"
          fontSize={78}
          style={{ marginTop: 4 }}
          lines={[line(COPY.showcase.pro, [F(C.proLine), F(16.28)], 4, "all")]}
        />
      </div>
    </AbsoluteFill>
  );
};
