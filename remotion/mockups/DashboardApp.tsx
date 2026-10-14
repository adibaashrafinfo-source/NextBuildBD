import { COLORS, FONTS } from "../theme";
import { BarChart, Bar, Label, LineChart, Row, Stack } from "./ui";

export const DASHBOARD_WIDTH = 1200;
export const DASHBOARD_HEIGHT = 1200;

const NAV = ["Overview", "Projects", "Clients", "Reports", "Settings"];
const STATS = ["Visitors", "Sessions", "Orders"];

const SERIES = [
  [18, 26, 21, 34, 29, 41, 37, 52, 46, 61, 57, 72],
  [24, 19, 31, 27, 38, 33, 44, 39, 50, 45, 56, 63],
  [12, 22, 17, 29, 24, 36, 31, 43, 38, 49, 44, 58],
];

/** A sophisticated custom web-application dashboard. Charts carry the story; no figures are invented. */
export const DashboardApp: React.FC<{ accentRow?: number }> = ({
  accentRow = 1,
}) => (
  <Row
    style={{
      width: DASHBOARD_WIDTH,
      height: DASHBOARD_HEIGHT,
      background: COLORS.warmGray,
      fontFamily: FONTS.body,
      alignItems: "stretch",
    }}
  >
    {/* sidebar */}
    <Stack
      gap={34}
      style={{ width: 252, background: COLORS.white, padding: "32px 24px", borderRight: `1px solid ${COLORS.line}` }}
    >
      <Row gap={11}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.orange }} />
        <Bar w={76} h={10} color="#D9D7D0" />
      </Row>
      <Stack gap={8}>
        {NAV.map((item, i) => (
          <Row
            key={item}
            gap={13}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: i === 0 ? "rgba(241,89,34,0.10)" : "transparent",
            }}
          >
            <div
              style={{
                width: 17,
                height: 17,
                borderRadius: 5,
                background: i === 0 ? COLORS.orange : "#D9D7D0",
              }}
            />
            <Label size={14.5} weight={i === 0 ? 700 : 500} color={i === 0 ? COLORS.orange : "#75746D"}>
              {item}
            </Label>
          </Row>
        ))}
      </Stack>
      <div
        style={{
          marginTop: "auto",
          borderRadius: 16,
          padding: 18,
          background: `linear-gradient(140deg, ${COLORS.ink} 0%, #30302C 100%)`,
        }}
      >
        <Stack gap={10}>
          <Bar w="74%" h={9} color="rgba(255,255,255,0.4)" />
          <Bar w="50%" h={8} color="rgba(255,255,255,0.2)" />
        </Stack>
      </div>
    </Stack>

    {/* main */}
    <Stack gap={22} style={{ flex: 1, padding: "28px 34px" }}>
      <Row style={{ justifyContent: "space-between" }}>
        <Stack gap={9}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: "-0.018em",
              color: COLORS.ink,
            }}
          >
            Overview
          </div>
          <Bar w={168} h={9} />
        </Stack>
        <Row gap={12}>
          <div
            style={{
              height: 40,
              borderRadius: 999,
              background: COLORS.white,
              border: `1px solid ${COLORS.line}`,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 10,
            }}
          >
            <Bar w={62} h={8} />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: `5px solid #9A998F`,
              }}
            />
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: COLORS.ink }} />
        </Row>
      </Row>

      {/* stat cards */}
      <Row gap={18} style={{ alignItems: "stretch" }}>
        {STATS.map((stat, i) => (
          <div
            key={stat}
            style={{
              flex: 1,
              background: COLORS.white,
              borderRadius: 18,
              padding: 22,
              border: `1px solid ${COLORS.line}`,
            }}
          >
            <Stack gap={16}>
              <Row style={{ justifyContent: "space-between" }}>
                <Label size={14} weight={600} color="#75746D">
                  {stat}
                </Label>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: i === accentRow ? "rgba(241,89,34,0.14)" : "rgba(17,17,17,0.05)",
                  }}
                />
              </Row>
              <Bar w={i === accentRow ? "62%" : "48%"} h={16} color={COLORS.ink} radius={8} />
              <LineChart
                w={214}
                h={54}
                points={SERIES[i]}
                color={i === accentRow ? COLORS.orange : "#B9B8B0"}
                strokeWidth={2.6}
              />
            </Stack>
          </div>
        ))}
      </Row>

      {/* main chart + donut */}
      <Row gap={18} style={{ alignItems: "stretch" }}>
        <div
          style={{
            flex: 2,
            background: COLORS.white,
            borderRadius: 20,
            padding: 26,
            border: `1px solid ${COLORS.line}`,
          }}
        >
          <Stack gap={22}>
            <Row style={{ justifyContent: "space-between" }}>
              <Label size={17} weight={750}>
                Performance
              </Label>
              <Row gap={14}>
                {["Week", "Month", "Year"].map((t, i) => (
                  <span
                    key={t}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: 650,
                      background: i === 1 ? COLORS.warmGray : "transparent",
                      color: i === 1 ? COLORS.ink : "#9A998F",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </Row>
            </Row>
            <BarChart w={452} h={186} values={[32, 48, 38, 59, 44, 66, 52, 74, 61, 83, 70, 92]} />
          </Stack>
        </div>

        <div
          style={{
            flex: 1,
            background: COLORS.white,
            borderRadius: 20,
            padding: 26,
            border: `1px solid ${COLORS.line}`,
          }}
        >
          <Stack gap={24}>
            <Label size={17} weight={750}>
              Channels
            </Label>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 158,
                  height: 158,
                  borderRadius: 999,
                  background: `conic-gradient(${COLORS.orange} 0turn 0.46turn, ${COLORS.ink} 0.46turn 0.72turn, #DEDDD6 0.72turn 1turn)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 96, height: 96, borderRadius: 999, background: COLORS.white }} />
              </div>
            </div>
            <Stack gap={12}>
              {[COLORS.orange, COLORS.ink, "#DEDDD6"].map((c, i) => (
                <Row key={i} gap={10}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: c }} />
                  <Bar w={i === 0 ? 108 : 84} h={8} />
                </Row>
              ))}
            </Stack>
          </Stack>
        </div>
      </Row>

      {/* table */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${COLORS.line}`,
          flex: 1,
        }}
      >
        <Stack gap={18}>
          <Row style={{ justifyContent: "space-between" }}>
            <Label size={17} weight={750}>
              Recent Activity
            </Label>
            <Label size={13.5} weight={650} color={COLORS.orange}>
              View all
            </Label>
          </Row>
          <Stack gap={0}>
            {[0, 1, 2, 3].map((r) => (
              <Row
                key={r}
                gap={18}
                style={{
                  padding: "15px 0",
                  borderTop: r === 0 ? "none" : `1px solid ${COLORS.line}`,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 11,
                    background: r === accentRow ? "rgba(241,89,34,0.14)" : COLORS.warmGray,
                    flexShrink: 0,
                  }}
                />
                <Bar w={184} h={9} color="#D9D7D0" />
                <Bar w={116} h={9} />
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    background: r === accentRow ? "rgba(241,89,34,0.12)" : "rgba(17,17,17,0.05)",
                    color: r === accentRow ? COLORS.orange : "#8A8982",
                  }}
                >
                  {r === accentRow ? "ACTIVE" : "DONE"}
                </span>
              </Row>
            ))}
          </Stack>
        </Stack>
      </div>
    </Stack>
  </Row>
);
