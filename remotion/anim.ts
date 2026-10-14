import { Easing, interpolate, spring } from "remotion";
import { EASE } from "./theme";

type EasingFn = (t: number) => number;

/** Clamped 0..1 progress for a window starting at `start` lasting `duration` frames. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = EASE.out,
) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Progress that ramps up, holds at 1, then ramps back down. */
export const pulseWindow = (
  frame: number,
  start: number,
  rampIn: number,
  hold: number,
  rampOut: number,
) =>
  interpolate(
    frame,
    [start, start + rampIn, start + rampIn + hold, start + rampIn + hold + rampOut],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut },
  );

/** A spring that starts at `delay` frames. */
export const springAt = ({
  frame,
  fps,
  delay = 0,
  config,
  durationInFrames,
}: {
  frame: number;
  fps: number;
  delay?: number;
  config?: Parameters<typeof spring>[0]["config"];
  durationInFrames?: number;
}) =>
  spring({ frame: frame - delay, fps, config, durationInFrames });

/** Map 0..1 to a value range. */
export const mix = (t: number, from: number, to: number) => from + (to - from) * t;

/** Deterministic looping sine, in frames. */
export const osc = (frame: number, periodFrames: number, phase = 0) =>
  Math.sin(((frame / periodFrames) * Math.PI * 2) + phase);

/** Linear easing re-export so scenes don't import Easing directly. */
export const LINEAR: EasingFn = Easing.linear;
