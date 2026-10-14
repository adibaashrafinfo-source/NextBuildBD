import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY } from "../brand";
import { CUES, rel } from "../timeline";
import { COLORS, SPRINGS } from "../theme";
import { kf, osc, springAt } from "../anim";
import { AnimatedHeadline, line } from "../components/AnimatedHeadline";
import { Phone } from "../devices/Frames";
import { LogoReveal } from "../components/LogoReveal";
import { ChatScreen } from "../site/ScenePages";

const F = (s: number) => rel("loss", s);
const C = CUES.loss;

/**
 * Scene 2 (3.3 - 8.67s): "তাহলে প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস
 * ও নতুন ব্যবসার সুযোগ!" — a customer asks for the website, gets nothing, leaves.
 */
export const Scene02Loss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phone = springAt({ frame, fps, delay: F(C.phone), config: SPRINGS.soft });
  const float = osc(frame, 230, 0.8) * 8;
  const chatT = (frame - F(C.chat)) / fps;
  const drift = kf(frame, [[0, 0], [rel("loss", 8.67), 1]]);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <LogoReveal width={250} delay={0} duration={1} />
      </div>

      {/* soft orange light behind the phone */}
      <div
        style={{
          position: "absolute",
          left: 1440 - 480,
          top: 560 - 480,
          width: 960,
          height: 960,
          borderRadius: 999,
          background: "radial-gradient(50% 50% at 50% 50%, rgba(241,89,34,0.2) 0%, rgba(241,89,34,0) 70%)",
          opacity: phone,
        }}
      />

      {/* the narration, as type */}
      <div style={{ position: "absolute", left: 120, top: 262 }}>
        <AnimatedHeadline
          fontSize={80}
          lines={[
            line(COPY.loss.line1, C.line1.map(F)),
            line("সম্ভাব্য কাস্টমারের", C.line2.map(F)),
            line("বিশ্বাস", C.line3.map(F), 4, "all"),
          ]}
        />
        <AnimatedHeadline
          fontSize={60}
          style={{ marginTop: 34 }}
          lines={[line(COPY.loss.line3, C.line4.map(F), 4, [3])]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 1440 - 180,
          top: 540 - 372,
          transform: `perspective(2400px) translate3d(${(1 - phone) * 260}px, ${(1 - phone) * 40 + float}px, 0) rotateY(${-13 + drift * 5}deg) rotateZ(${2.4 - drift * 1.2}deg) scale(${0.92 + phone * 0.08})`,
          opacity: Math.min(1, phone * 2),
        }}
      >
        <Phone screenWidth={340}>{(w, h) => <ChatScreen width={w} height={h} t={chatT} />}</Phone>
      </div>
    </AbsoluteFill>
  );
};

export { COLORS };
