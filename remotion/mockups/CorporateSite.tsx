import { COLORS, FONTS } from "../theme";
import { Bar, CardShell, Label, MediaBlock, MockMark, Pill, Row, Stack } from "./ui";

export const CORPORATE_SITE_WIDTH = 1440;
export const CORPORATE_SITE_HEIGHT = 2460;

const NAV_ITEMS = ["Home", "Services", "Work", "About"];

const SERVICES = [
  { title: "Web Design", variant: 1 },
  { title: "Development", variant: 0 },
  { title: "Support", variant: 3 },
];

const PROCESS = ["Discover", "Design", "Develop"];

export type CorporateSiteProps = {
  /** 0..1 — underline sweep on the active nav item. */
  navHover?: number;
  /** 0..1 — hover lift on the hero's primary call to action. */
  ctaHover?: number;
  /** 0..1 — hover raise on the middle service card. */
  cardHover?: number;
};

/** A clean, premium corporate business website, drawn entirely in CSS. */
export const CorporateSite: React.FC<CorporateSiteProps> = ({
  navHover = 0,
  ctaHover = 0,
  cardHover = 0,
}) => (
  <div
    style={{
      width: CORPORATE_SITE_WIDTH,
      height: CORPORATE_SITE_HEIGHT,
      background: COLORS.white,
      fontFamily: FONTS.body,
      position: "relative",
    }}
  >
    {/* ---------- navigation ---------- */}
    <Row
      style={{
        height: 92,
        padding: "0 64px",
        justifyContent: "space-between",
        borderBottom: `1px solid ${COLORS.line}`,
        background: "rgba(255,255,255,0.92)",
      }}
    >
      <MockMark />
      <Row gap={38}>
        {NAV_ITEMS.map((item, i) => (
          <div key={item} style={{ position: "relative", paddingBottom: 6 }}>
            <Label size={16} weight={i === 1 ? 700 : 500} color={i === 1 ? COLORS.ink : "#6E6E67"}>
              {item}
            </Label>
            {i === 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 3,
                  width: `${navHover * 100}%`,
                  borderRadius: 999,
                  background: COLORS.orange,
                }}
              />
            ) : null}
          </div>
        ))}
      </Row>
      <Row gap={18}>
        <Label size={16} weight={500} color="#6E6E67">
          Contact
        </Label>
        <Pill size={15}>Get Started</Pill>
      </Row>
    </Row>

    {/* ---------- hero ---------- */}
    <Row style={{ padding: "76px 64px 70px", alignItems: "flex-start", gap: 56 }}>
      <Stack gap={26} style={{ width: 620, paddingTop: 24 }}>
        <span
          style={{
            alignSelf: "flex-start",
            padding: "9px 18px",
            borderRadius: 999,
            background: "rgba(241,89,34,0.10)",
            color: COLORS.orange,
            fontSize: 13.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          WEB DESIGN STUDIO
        </span>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 66,
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
        <Stack gap={11} style={{ paddingTop: 4 }}>
          <Bar w={540} h={11} />
          <Bar w={486} h={11} />
          <Bar w={352} h={11} />
        </Stack>
        <Row gap={16} style={{ paddingTop: 12 }}>
          <span
            style={{
              display: "inline-block",
              transform: `translateY(${-ctaHover * 4}px) scale(${1 + ctaHover * 0.035})`,
              filter: `drop-shadow(0 ${10 + ctaHover * 14}px ${18 + ctaHover * 16}px rgba(241,89,34,${0.26 + ctaHover * 0.2}))`,
            }}
          >
            <Pill size={17}>Start a Project</Pill>
          </span>
          <Pill tone="ghost" size={17}>
            View Work
          </Pill>
        </Row>
      </Stack>

      <div style={{ position: "relative", flex: 1 }}>
        <MediaBlock h={430} radius={26} variant={1} />
        <CardShell
          pad={20}
          radius={18}
          style={{ position: "absolute", left: -46, bottom: -40, width: 268 }}
        >
          <Row gap={14}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "rgba(241,89,34,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `3px solid ${COLORS.orange}`,
                }}
              />
            </div>
            <Stack gap={9}>
              <Bar w={132} h={9} color="#D9D7D0" />
              <Bar w={88} h={9} />
            </Stack>
          </Row>
        </CardShell>
      </div>
    </Row>

    {/* ---------- services ---------- */}
    <Stack gap={34} style={{ background: COLORS.warmGray, padding: "68px 64px 76px" }}>
      <Stack gap={14}>
        <Label size={13.5} weight={700} color={COLORS.orange} spacing="0.15em">
          WHAT WE DO
        </Label>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: COLORS.ink,
          }}
        >
          Our Services
        </div>
      </Stack>
      <Row gap={24} style={{ alignItems: "stretch" }}>
        {SERVICES.map((service, i) => {
          const lift = i === 1 ? cardHover : 0;
          return (
            <CardShell
              key={service.title}
              pad={30}
              style={{
                flex: 1,
                transform: `translateY(${-lift * 12}px)`,
                boxShadow: `0 ${18 + lift * 26}px ${40 + lift * 30}px -26px rgba(17,17,17,${0.22 + lift * 0.14})`,
                borderTop: `3px solid ${lift > 0.2 ? COLORS.orange : "transparent"}`,
              }}
            >
              <Stack gap={20}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 17,
                    background:
                      i === 1
                        ? `linear-gradient(145deg, ${COLORS.orangeSoft}, ${COLORS.orange})`
                        : "rgba(17,17,17,0.055)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: i === 2 ? 999 : 6,
                      border: `3px solid ${i === 1 ? COLORS.white : COLORS.inkSoft}`,
                    }}
                  />
                </div>
                <Label size={21} weight={750}>
                  {service.title}
                </Label>
                <Stack gap={10}>
                  <Bar w="100%" h={9} />
                  <Bar w="82%" h={9} />
                  <Bar w="58%" h={9} />
                </Stack>
              </Stack>
            </CardShell>
          );
        })}
      </Row>
    </Stack>

    {/* ---------- process ---------- */}
    <Row gap={60} style={{ padding: "76px 64px", alignItems: "center" }}>
      <MediaBlock w={560} h={360} radius={24} variant={2} />
      <Stack gap={28} style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: COLORS.ink,
          }}
        >
          How We Work
        </div>
        {PROCESS.map((step, i) => (
          <Row key={step} gap={20}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: i === 0 ? COLORS.orange : "rgba(17,17,17,0.06)",
                color: i === 0 ? COLORS.white : COLORS.inkSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 750,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <Stack gap={9} style={{ flex: 1 }}>
              <Label size={19} weight={700}>
                {step}
              </Label>
              <Bar w={`${74 - i * 9}%`} h={9} />
            </Stack>
          </Row>
        ))}
      </Stack>
    </Row>

    {/* ---------- cta band ---------- */}
    <div style={{ padding: "0 64px 70px" }}>
      <div
        style={{
          borderRadius: 30,
          padding: "58px 56px",
          background: `linear-gradient(118deg, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <Stack gap={16} style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: COLORS.white,
            }}
          >
            Start Your Project
          </div>
          <Bar w={340} h={10} color="rgba(255,255,255,0.42)" />
        </Stack>
        <Pill tone="white" size={17} style={{ position: "relative" }}>
          Contact Us
        </Pill>
      </div>
    </div>

    {/* ---------- footer ---------- */}
    <Row
      style={{
        background: COLORS.ink,
        padding: "46px 64px",
        justifyContent: "space-between",
      }}
    >
      <Row gap={10}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: COLORS.orange,
          }}
        />
        <Bar w={92} h={9} color="rgba(255,255,255,0.3)" />
      </Row>
      <Row gap={26}>
        {[70, 58, 64, 50].map((w, i) => (
          <Bar key={i} w={w} h={8} color="rgba(255,255,255,0.22)" />
        ))}
      </Row>
    </Row>
  </div>
);
