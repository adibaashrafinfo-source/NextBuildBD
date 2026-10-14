import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./remotion/index.ts");

// 1920x1080 H.264 MP4, no audio track.
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Software ANGLE is the reliable renderer for heavy blur/backdrop-filter work
// on a headless Linux box without a GPU.
Config.setChromiumOpenGlRenderer("swangle");
