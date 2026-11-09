import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iPhone home-screen icon (when someone taps "Add to Home Screen"). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e2147" }}>
        <svg width="180" height="180" viewBox="0 0 100 100">
          <path d="M18 78c22 10 48 9 66-6" fill="none" stroke="#6fa8dc" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M20 30 32 66 46 40 60 66 72 30"
            fill="none"
            stroke="#fbf8f3"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M80 8C81 17 82 18 91 19 82 20 81 21 80 30 79 21 78 20 69 19 78 18 79 17 80 8Z" fill="#c9a66b" />
        </svg>
      </div>
    ),
    size,
  );
}
