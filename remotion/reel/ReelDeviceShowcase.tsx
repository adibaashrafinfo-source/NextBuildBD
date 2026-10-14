import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, SPRINGS } from "../theme";
import { kf, springAt } from "../anim";
import { Laptop, Phone, Tablet } from "../devices/Frames";
import { CorporateSite } from "../site/CorporateSite";
import { RW } from "./layout";

/** Layered stack: desktop above, tablet and phone below, phone overlapping the desktop. */
export const REEL_BOTTOM = 1300;
export const REEL_PHONE_SCREEN = 300;
export const REEL_PHONE = { w: 322.8, h: 671.8 } as const;
export const REEL_PHONE_FINAL = { x: 703, y: REEL_BOTTOM - REEL_PHONE.h / 2 };

const LAPTOP = { cx: RW / 2, bottom: 780, screen: 560, w: 623.5 };
const TABLET = { cx: 363, screen: 250, w: 270 };

const Ground: React.FC<{ cx: number; bottom: number; w: number; opacity: number }> = ({ cx, bottom, w, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: cx - w * 0.55,
      top: bottom - 20,
      width: w * 1.1,
      height: 56,
      background: "radial-gradient(50% 50% at 50% 50%, rgba(15,15,15,0.30) 0%, rgba(15,15,15,0) 72%)",
      opacity,
    }}
  />
);

export type ReelDeviceShowcaseProps = {
  enterAt: number;
  phoneCx: number;
  phoneCy: number;
  phoneOpacity: number;
  glareFrom: number;
  glareTo: number;
  scrollFrom: number;
  scrollTo: number;
};

/** Desktop, tablet and phone showing the same site, arranged for a 9:16 frame. */
export const ReelDeviceShowcase: React.FC<ReelDeviceShowcaseProps> = ({
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
      <Ground cx={LAPTOP.cx} bottom={LAPTOP.bottom} w={LAPTOP.w} opacity={laptopIn} />
      <Ground cx={TABLET.cx} bottom={REEL_BOTTOM} w={TABLET.w} opacity={tabletIn} />
      <Ground cx={REEL_PHONE_FINAL.x} bottom={REEL_BOTTOM} w={REEL_PHONE.w} opacity={phoneOpacity * Math.min(1, Math.max(0, (phoneCy - 780) / 160))} />

      <div
        style={{
          position: "absolute",
          left: LAPTOP.cx,
          bottom: 1920 - LAPTOP.bottom,
          transform: `translateX(-50%) translateY(${(1 - laptopIn) * -340}px)`,
          opacity: Math.min(1, laptopIn * 2),
        }}
      >
        <Laptop screenWidth={LAPTOP.screen} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 560} />}
        </Laptop>
      </div>

      <div
        style={{
          position: "absolute",
          left: TABLET.cx,
          bottom: 1920 - REEL_BOTTOM,
          transform: `translateX(-50%) translateY(${(1 - tabletIn) * 340}px)`,
          opacity: Math.min(1, tabletIn * 2),
        }}
      >
        <Tablet screenWidth={TABLET.screen} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 420} />}
        </Tablet>
      </div>

      <div
        style={{
          position: "absolute",
          left: phoneCx - REEL_PHONE.w / 2,
          top: phoneCy - REEL_PHONE.h / 2,
          opacity: phoneOpacity,
        }}
      >
        <Phone screenWidth={REEL_PHONE_SCREEN} glare={glare}>
          {(w, h) => <CorporateSite width={w} height={h} scroll={sc * 380} />}
        </Phone>
      </div>
    </>
  );
};
