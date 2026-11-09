import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const alt = `${siteConfig.name}: ${siteConfig.slogan} The car wash that comes to you.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const sparkle = "M0 -1C.1 -.1 .1 -.1 1 0C.1 .1 .1 .1 0 1C-.1 .1 -.1 .1 -1 0C-.1 -.1 -.1 -.1 0 -1Z";

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="-1 -1 2 2"
      style={{ position: "absolute", left: x, top: y }}
    >
      <path d={sparkle} fill="#c9a66b" />
    </svg>
  );
}

/** The preview card shown when the link is shared in texts, iMessage, Instagram, etc. */
export default async function OpenGraphImage() {
  const font = (f: string) => readFile(path.join(process.cwd(), "assets", f));
  const [bold, italic, inter] = await Promise.all([
    font("PlayfairDisplay-Bold.ttf"),
    font("PlayfairDisplay-BoldItalic.ttf"),
    font("Inter-Medium.ttf"),
  ]);
  const split = siteConfig.name.slice(1).search(/[A-Z ]/) + 1;
  const [first, second] = split > 0 ? [siteConfig.name.slice(0, split), siteConfig.name.slice(split).trim()] : [siteConfig.name, ""];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#fbf8f3",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* water swoosh */}
        <svg width="760" height="630" viewBox="0 0 760 630" style={{ position: "absolute", right: -260, top: 0 }}>
          <path d="M60 520C140 260 380 110 740 120" stroke="#6fa8dc" strokeOpacity="0.5" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d="M140 590C230 380 420 250 760 240" stroke="#6fa8dc" strokeOpacity="0.25" strokeWidth="12" fill="none" strokeLinecap="round" />
        </svg>
        <Star x={960} y={70} s={90} />
        <Star x={1080} y={210} s={34} />
        <Star x={880} y={190} s={26} />

        <div style={{ display: "flex", fontFamily: "Playfair", fontSize: 128, fontWeight: 700, letterSpacing: -3 }}>
          <span style={{ color: "#0e2147" }}>{first}</span>
          <span style={{ color: "#6fa8dc" }}>{second}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Playfair",
            fontStyle: "italic",
            fontSize: 60,
            fontWeight: 700,
            color: "#0e2147",
          }}
        >
          {siteConfig.slogan}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 44, gap: 16 }}>
          <div
            style={{
              display: "flex",
              background: "#0e2147",
              color: "#fbf8f3",
              fontSize: 30,
              padding: "16px 30px",
              borderRadius: 999,
            }}
          >
            Join the waitlist
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#55627a" }}>
            The car wash that comes to you
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: bold, weight: 700, style: "normal" },
        { name: "Playfair", data: italic, weight: 700, style: "italic" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}
