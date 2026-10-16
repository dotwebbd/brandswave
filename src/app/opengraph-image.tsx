import { ImageResponse } from "next/og";

export const config = { runtime: "nodejs" };

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0A1424",
          color: "#EEF3F1",
          fontFamily: "Bricolage Grotesque",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            background: "#86D9C6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg width="64" height="64" fill="none" stroke="#0A1424" strokeWidth="6" strokeLinecap="round">
            <path d="M6 22c8-10 14 10 22 0s14 10 22 0 8-6 8-6" />
            <path d="M6 36c8-10 14 10 22 0s14 10 22 0 8-6 8-6" />
            <path d="M6 50c8-10 14 10 22 0s14 10 22 0 8-6 8-6" />
          </svg>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          BrandsWave
        </div>
        <div style={{ fontSize: 32, color: "#86D9C6", fontWeight: 500 }}>
          Models, films &amp; campaigns that move people
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}