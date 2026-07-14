import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 24,
            height: 13,
            borderRadius: 7,
            border: "2.5px solid #C8CDD7",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -1,
              width: 9,
              height: 9,
              borderRadius: "50%",
              border: "2.5px solid #D4621A",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
