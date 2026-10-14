import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { SPRINGS } from "../theme";
import { kf, osc, springAt } from "../anim";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { Phone } from "../devices/Frames";
import { LogoReveal } from "../components/LogoReveal";
import { ChatScreen } from "../site/ScenePages";
import { RW, SAFE_LEFT, SAFE_TOP } from "./layout";

const F = (s: number) => rel("loss", s);
const C = CUES.loss;

const PHONE_W = 322.8;
const PHONE_H = 671.8;
const CY = 1170;

/** Reel scene 2: a customer asks for the website, gets nothing, leaves. */
export const ReelScene02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phone = springAt({ frame, fps, delay: F(C.phone), config: SPRINGS.soft });
  const float = osc(frame, 230, 0.8) * 8;
  const chatT = (frame - F(C.chat)) / fps;
  const drift = kf(frame, [[0, 0], [rel("loss", 8.67), 1]]);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE_LEFT, top: SAFE_TOP }}>
        <LogoReveal width={250} delay={0} duration={1} />
      </div>

      <div
        style={{
          position: "absolute",
          left: RW / 2 - 520,
          top: CY - 520,
          width: 1040,
          height: 1040,
          borderRadius: 999,
          background: "radial-gradient(50% 50% at 50% 50%, rgba(241,89,34,0.2) 0%, rgba(241,89,34,0) 70%)",
          opacity: phone,
        }}
      />

      <div style={{ position: "absolute", left: SAFE_LEFT, top: 390 }}>
        <AnimatedHeadline
          fontSize={80}
          lines={[
            line(COPY.loss.line1, C.line1.map(F)),
            line("সম্ভাব্য কাস্টমারের", C.line2.map(F)),
            line("বিশ্বাস", C.line3.map(F), 4, "all"),
          ]}
        />
        <AnimatedHeadline fontSize={60} style={{ marginTop: 26 }} lines={[line(COPY.loss.line3, C.line4.map(F), 4, [3])]} />
      </div>

      <div
        style={{
          position: "absolute",
          left: RW / 2 - PHONE_W / 2,
          top: CY - PHONE_H / 2,
          transform: `perspective(2400px) translate3d(0, ${(1 - phone) * 260 + float}px, 0) rotateY(${-9 + drift * 4}deg) rotateZ(${1.8 - drift}deg) scale(${0.92 + phone * 0.08})`,
          opacity: Math.min(1, phone * 2),
        }}
      >
        <Phone screenWidth={300}>{(w, h) => <ChatScreen width={w} height={h} t={chatT} />}</Phone>
      </div>
    </AbsoluteFill>
  );
};
