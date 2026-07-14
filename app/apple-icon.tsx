import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141820",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 120,
            height: 64,
            borderRadius: 32,
            border: "12px solid #C8CDD7",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -6,
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: "12px solid #D4621A",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
