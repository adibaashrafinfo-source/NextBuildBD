import { COLORS, FONTS } from "../theme";
import { Bar, Label, MediaBlock, MockMark, Pill, Row, Stack } from "./ui";

export const ECOMMERCE_SITE_WIDTH = 1200;
export const ECOMMERCE_SITE_HEIGHT = 1340;

const CATEGORIES = ["New In", "Men", "Women", "Accessories"];

export type EcommerceSiteProps = {
  /** 0..1 — hover raise on one product tile. */
  tileHover?: number;
  /** Index of the tile that reacts to `tileHover`. */
  tileIndex?: number;
};

/** A modern e-commerce storefront with a clean product grid. */
export const EcommerceSite: React.FC<EcommerceSiteProps> = ({
  tileHover = 0,
  tileIndex = 1,
}) => (
  <div
    style={{
      width: ECOMMERCE_SITE_WIDTH,
      height: ECOMMERCE_SITE_HEIGHT,
      background: COLORS.white,
      fontFamily: FONTS.body,
    }}
  >
    <Row
      style={{
        height: 86,
        padding: "0 44px",
        justifyContent: "space-between",
        borderBottom: `1px solid ${COLORS.line}`,
      }}
    >
      <MockMark tone="orange" />
      <Row gap={34}>
        {CATEGORIES.map((c, i) => (
          <Label key={c} size={15.5} weight={i === 0 ? 700 : 500} color={i === 0 ? COLORS.ink : "#6E6E67"}>
            {c}
          </Label>
        ))}
      </Row>
      <Row gap={16}>
        <div
          style={{
            width: 190,
            height: 40,
            borderRadius: 999,
            background: COLORS.warmGray,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              border: `2.5px solid #B4B2AA`,
            }}
          />
          <Bar w={86} h={8} color="#D6D4CC" />
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            background: COLORS.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 15,
              height: 13,
              borderRadius: "3px 3px 5px 5px",
              border: `2.5px solid ${COLORS.white}`,
              borderTop: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 15,
              height: 15,
              borderRadius: 999,
              background: COLORS.orange,
              border: `2px solid ${COLORS.white}`,
            }}
          />
        </div>
      </Row>
    </Row>

    {/* promo strip */}
    <Row
      style={{
        margin: "26px 44px 0",
        padding: "30px 38px",
        borderRadius: 24,
        background: `linear-gradient(112deg, ${COLORS.warmGray} 0%, #FBE6DB 100%)`,
        justifyContent: "space-between",
      }}
    >
      <Stack gap={14}>
        <Label size={12.5} weight={700} color={COLORS.orange} spacing="0.16em">
          NEW COLLECTION
        </Label>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: COLORS.ink,
          }}
        >
          Shop The Season
        </div>
      </Stack>
      <Pill size={15}>Browse All</Pill>
    </Row>

    <Row style={{ padding: "28px 44px 18px", justifyContent: "space-between" }}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 27,
          fontWeight: 800,
          letterSpacing: "-0.018em",
          color: COLORS.ink,
        }}
      >
        Featured Products
      </div>
      <Row gap={10}>
        {["All", "Popular", "Latest"].map((f, i) => (
          <span
            key={f}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 650,
              background: i === 0 ? COLORS.ink : COLORS.warmGray,
              color: i === 0 ? COLORS.white : "#6E6E67",
            }}
          >
            {f}
          </span>
        ))}
      </Row>
    </Row>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 24,
        padding: "0 44px",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const lift = i === tileIndex ? tileHover : 0;
        return (
          <div
            key={i}
            style={{
              borderRadius: 20,
              background: COLORS.white,
              padding: 14,
              boxShadow: `0 ${14 + lift * 24}px ${34 + lift * 26}px -24px rgba(17,17,17,${0.2 + lift * 0.16})`,
              transform: `translateY(${-lift * 10}px)`,
              border: `1px solid ${COLORS.line}`,
            }}
          >
            <div style={{ position: "relative" }}>
              <MediaBlock h={158} radius={14} variant={i} />
              {i % 3 === 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    padding: "5px 11px",
                    borderRadius: 999,
                    background: COLORS.orange,
                    color: COLORS.white,
                    fontSize: 11,
                    fontWeight: 750,
                    letterSpacing: "0.08em",
                  }}
                >
                  NEW
                </span>
              ) : null}
            </div>
            <Stack gap={10} style={{ padding: "16px 6px 6px" }}>
              <Bar w="78%" h={10} color="#D9D7D0" />
              <Bar w="46%" h={9} />
              <Row style={{ justifyContent: "space-between", paddingTop: 8 }}>
                <Bar w={54} h={12} color={COLORS.ink} radius={6} />
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background:
                      lift > 0.2
                        ? COLORS.orange
                        : "rgba(241,89,34,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 13,
                      height: 2.6,
                      borderRadius: 999,
                      background: lift > 0.2 ? COLORS.white : COLORS.orange,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 5.2,
                        top: -5.2,
                        width: 2.6,
                        height: 13,
                        borderRadius: 999,
                        background: lift > 0.2 ? COLORS.white : COLORS.orange,
                      }}
                    />
                  </div>
                </span>
              </Row>
            </Stack>
          </div>
        );
      })}
    </div>
  </div>
);
