import { ImageResponse } from "next/og";

export const alt = "SetuHome — The verse, at home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF6EE",
          padding: "72px 80px",
          color: "#1E1B3A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#E8A33D",
            }}
          />
          <div
            style={{
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6B6577",
            }}
          >
            SetuHome · सेतु
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              lineHeight: 1.05,
              fontFamily: "Georgia, serif",
            }}
          >
            <div style={{ display: "flex" }}>The verse,</div>
            <div style={{ display: "flex" }}>at home.</div>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#6B6577", maxWidth: 760 }}>
            Gita, Ramayana, festival days for your city, and stories for children.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6B6577" }}>
          <span>Free. No ads.</span>
          <span>setuhome.xyz</span>
        </div>
      </div>
    ),
    size,
  );
}
