import { COLORS, FONTS } from "../theme";
import { Bar, Label, MediaBlock, Pill, Row, Stack } from "./ui";

/**
 * Tablet and phone renderings of the *same* corporate site used on desktop —
 * same brand mark, same hero line, same services — reflowed for each breakpoint.
 */

export const TABLET_SITE_WIDTH = 834;
export const TABLET_SITE_HEIGHT = 1400;
export const MOBILE_SITE_WIDTH = 390;
export const MOBILE_SITE_HEIGHT = 1180;

const Mark: React.FC<{ size: number }> = ({ size }) => (
  <Row gap={size * 0.33}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: COLORS.ink,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: size * 0.26,
          top: -size * 0.2,
          width: size * 0.2,
          height: size * 1.5,
          background: COLORS.white,
          transform: "rotate(22deg)",
        }}
      />
    </div>
    <Bar w={size * 2} h={size * 0.3} color="#DAD8D1" />
  </Row>
);

export const TabletSite: React.FC = () => (
  <div
    style={{
      width: TABLET_SITE_WIDTH,
      height: TABLET_SITE_HEIGHT,
      background: COLORS.white,
      fontFamily: FONTS.body,
    }}
  >
    <Row
      style={{
        height: 78,
        padding: "0 34px",
        justifyContent: "space-between",
        borderBottom: `1px solid ${COLORS.line}`,
      }}
    >
      <Mark size={28} />
      <Row gap={26}>
        {["Home", "Services", "Work"].map((n, i) => (
          <Label key={n} size={17} weight={i === 1 ? 700 : 500} color={i === 1 ? COLORS.ink : "#6E6E67"}>
            {n}
          </Label>
        ))}
        <Pill size={15}>Get Started</Pill>
      </Row>
    </Row>

    <Stack gap={30} style={{ padding: "52px 34px 44px" }}>
      <span
        style={{
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: 999,
          background: "rgba(241,89,34,0.10)",
          color: COLORS.orange,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.14em",
        }}
      >
        WEB DESIGN STUDIO
      </span>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: "-0.028em",
          color: COLORS.ink,
        }}
      >
        Design. Build.
        <br />
        <span style={{ color: COLORS.orange }}>Launch.</span>
      </div>
      <Stack gap={12}>
        <Bar w="88%" h={13} />
        <Bar w="72%" h={13} />
      </Stack>
      <Row gap={16}>
        <Pill size={18}>Start a Project</Pill>
        <Pill tone="ghost" size={18}>
          View Work
        </Pill>
      </Row>
      <MediaBlock h={320} radius={22} variant={1} />
    </Stack>

    <Stack gap={26} style={{ background: COLORS.warmGray, padding: "44px 34px 52px" }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        Our Services
      </div>
      <Row gap={18} style={{ alignItems: "stretch" }}>
        {["Web Design", "Development", "Support"].map((title, i) => (
          <div
            key={title}
            style={{
              flex: 1,
              background: COLORS.white,
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 16px 36px -26px rgba(17,17,17,0.25)",
            }}
          >
            <Stack gap={16}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  background:
                    i === 1
                      ? `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`
                      : "rgba(17,17,17,0.055)",
                }}
              />
              <Label size={19} weight={750}>
                {title}
              </Label>
              <Stack gap={9}>
                <Bar w="100%" h={10} />
                <Bar w="66%" h={10} />
              </Stack>
            </Stack>
          </div>
        ))}
      </Row>
    </Stack>

    <div style={{ padding: "40px 34px" }}>
      <Row
        style={{
          borderRadius: 24,
          padding: "38px 34px",
          background: `linear-gradient(118deg, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 100%)`,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: COLORS.white,
          }}
        >
          Start Your Project
        </div>
        <Pill tone="white" size={16}>
          Contact Us
        </Pill>
      </Row>
    </div>
  </div>
);

export const MobileSite: React.FC = () => (
  <div
    style={{
      width: MOBILE_SITE_WIDTH,
      height: MOBILE_SITE_HEIGHT,
      background: COLORS.white,
      fontFamily: FONTS.body,
    }}
  >
    <Row
      style={{
        height: 96,
        padding: "40px 22px 0",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Mark size={26} />
      <Stack gap={5}>
        {[20, 20, 13].map((w, i) => (
          <Bar key={i} w={w} h={2.6} color={COLORS.ink} />
        ))}
      </Stack>
    </Row>

    <Stack gap={20} style={{ padding: "28px 22px 32px" }}>
      <span
        style={{
          alignSelf: "flex-start",
          padding: "7px 14px",
          borderRadius: 999,
          background: "rgba(241,89,34,0.10)",
          color: COLORS.orange,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: "0.14em",
        }}
      >
        WEB DESIGN STUDIO
      </span>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 42,
          fontWeight: 800,
          lineHeight: 1.03,
          letterSpacing: "-0.03em",
          color: COLORS.ink,
        }}
      >
        Design.
        <br />
        Build.
        <br />
        <span style={{ color: COLORS.orange }}>Launch.</span>
      </div>
      <Stack gap={10}>
        <Bar w="92%" h={11} />
        <Bar w="70%" h={11} />
      </Stack>
      <Pill size={17} style={{ alignSelf: "stretch" }}>
        Start a Project
      </Pill>
      <MediaBlock h={212} radius={20} variant={1} />
    </Stack>

    <Stack gap={18} style={{ background: COLORS.warmGray, padding: "30px 22px 34px" }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        Our Services
      </div>
      {["Web Design", "Development"].map((title, i) => (
        <Row
          key={title}
          gap={16}
          style={{
            background: COLORS.white,
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 14px 30px -24px rgba(17,17,17,0.3)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              flexShrink: 0,
              background:
                i === 0
                  ? `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`
                  : "rgba(17,17,17,0.055)",
            }}
          />
          <Stack gap={9} style={{ flex: 1 }}>
            <Label size={17} weight={750}>
              {title}
            </Label>
            <Bar w="76%" h={9} />
          </Stack>
        </Row>
      ))}
    </Stack>

    <div style={{ padding: "26px 22px" }}>
      <Stack
        gap={18}
        style={{
          borderRadius: 22,
          padding: "28px 24px",
          background: `linear-gradient(118deg, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 100%)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: COLORS.white,
            lineHeight: 1.1,
          }}
        >
          Start Your
          <br />
          Project
        </div>
        <Pill tone="white" size={15} style={{ alignSelf: "flex-start" }}>
          Contact Us
        </Pill>
      </Stack>
    </div>
  </div>
);
