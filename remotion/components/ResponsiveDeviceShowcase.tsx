import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, SPRINGS } from "../theme";
import { kf, springAt } from "../anim";
import { Laptop, Phone, Tablet } from "../devices/Frames";
import { CorporateSite } from "../site/CorporateSite";

export const SHOWCASE_BOTTOM = 800;
export const PHONE_SCREEN_W = 320;
export const PHONE_OUTER = { w: 344.4, h: 716.9 } as const;

const LAPTOP = { cx: 545, screen: 760, w: 838.5 };
const TABLET = { cx: 1190, screen: 360, w: 384.4 };

export type ResponsiveDeviceShowcaseProps = {
  /** Frame (in the surrounding Sequence) the laptop and tablet start arriving. */
  enterAt: number;
  /** Phone centre, which slides out of the narrowing browser window. */
  phoneCx: number;
  phoneCy: number;
  phoneOpacity: number;
  /** Glare sweep and slow scroll windows, in frames. */
  glareFrom: number;
  glareTo: number;
  scrollFrom: number;
  scrollTo: number;
};

/** A soft contact shadow so each device sits on a surface instead of floating on white. */
const Ground: React.FC<{ cx: number; w: number; opacity: number }> = ({ cx, w, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: cx - w * 0.55,
      top: SHOWCASE_BOTTOM - 20,
      width: w * 1.1,
      height: 64,
      background: "radial-gradient(50% 50% at 50% 50%, rgba(15,15,15,0.30) 0%, rgba(15,15,15,0) 72%)",
      opacity,
    }}
  />
);

/**
 * Desktop, tablet and phone showing the *same* site, each reflowed natively to
 * its own width — the payoff of the "মোবাইল-ফ্রেন্ডলি" line.
 */
export const ResponsiveDeviceShowcase: React.FC<ResponsiveDeviceShowcaseProps> = ({
  enterAt,
  phoneCx,
  phoneCy,
  phoneOpacity,
  glareFrom,
  glareTo,
  scrollFrom,
  scrollTo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const laptopIn = springAt({ frame, fps, delay: enterAt, config: SPRINGS.soft });
  const tabletIn = springAt({ frame, fps, delay: enterAt + 7, config: SPRINGS.soft });
  const glare = kf(frame, [[glareFrom, -45], [glareTo, 150]], EASE.inOut);
  const sc = kf(frame, [[scrollFrom, 0], [scrollTo, 1]], EASE.inOut);

  return (
    <>
      <Ground cx={LAPTOP.cx} w={LAPTOP.w} opacity={laptopIn} />
      <Ground cx={TABLET.cx} w={TABLET.w} opacity={tabletIn} />
      <Ground cx={1622} w={PHONE_OUTER.w} opacity={phoneOpacity * Math.min(1, Math.max(0, (phoneCx - 1000) / 400))} />

      {/* desktop */}
      <div
        style={{
          position: "absolute",
          left: LAPTOP.cx,
          bottom: 1080 - SHOWCASE_BOTTOM,
          transform: `translateX(-50%) translateX(${(1 - laptopIn) * -420}px) perspective(2600px) rotateY(${(1 - laptopIn) * 22}deg)`,
          opacity: Math.min(1, laptopIn * 2),
        }}
      >
        <Laptop screenWidth={LAPTOP.screen} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 560} />}
        </Laptop>
      </div>

      {/* tablet */}
      <div
        style={{
          position: "absolute",
          left: TABLET.cx,
          bottom: 1080 - SHOWCASE_BOTTOM,
          transform: `translateX(-50%) translateY(${(1 - tabletIn) * 320}px)`,
          opacity: Math.min(1, tabletIn * 2),
        }}
      >
        <Tablet screenWidth={TABLET.screen} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 420} />}
        </Tablet>
      </div>

      {/* phone: emerges from the narrowing browser window */}
      <div
        style={{
          position: "absolute",
          left: phoneCx - PHONE_OUTER.w / 2,
          top: phoneCy - PHONE_OUTER.h / 2,
          opacity: phoneOpacity,
        }}
      >
        <Phone screenWidth={PHONE_SCREEN_W} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 380} />}
        </Phone>
      </div>
    </>
  );
};
