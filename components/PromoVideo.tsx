"use client";

import { useRef } from "react";
import { siteConfig } from "@/site.config";
import { trackEvent } from "@/lib/track";
import { Logo } from "./Logo";
import { Sparkle } from "./icons";

export type VideoFiles = { mp4: boolean; webm: boolean; poster: boolean };

const SRC = { mp4: "/video/promo.mp4", webm: "/video/promo.webm", poster: "/video/promo-poster.jpg" };

/**
 * "hero": autoplays silently on loop (phones allow muted autoplay).
 * "feature": the same video with controls and sound.
 * Shows a branded placeholder until /public/video/promo.mp4 exists.
 */
export function PromoVideo({ files, mode }: { files: VideoFiles; mode: "hero" | "feature" }) {
  const played = useRef(false);

  if (!files.mp4) return <VideoPlaceholder />;

  const sources = (
    <>
      {files.webm && <source src={SRC.webm} type="video/webm" />}
      <source src={SRC.mp4} type="video/mp4" />
    </>
  );
  const poster = files.poster ? SRC.poster : undefined;

  if (mode === "hero") {
    return (
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={`${siteConfig.name} promo video`}
      >
        {sources}
      </video>
    );
  }

  return (
    <video
      className="h-full w-full bg-navy-deep object-cover"
      controls
      playsInline
      preload="metadata"
      poster={poster}
      onPlay={() => {
        if (played.current) return;
        played.current = true;
        trackEvent("video_play", { placement: "feature" });
      }}
    >
      {sources}
    </video>
  );
}

const bubbles = [
  { left: "12%", size: 14, delay: "0s", dur: "7s" },
  { left: "28%", size: 8, delay: "1.4s", dur: "6s" },
  { left: "46%", size: 18, delay: "2.6s", dur: "8s" },
  { left: "63%", size: 10, delay: "0.8s", dur: "6.5s" },
  { left: "80%", size: 13, delay: "3.4s", dur: "7.5s" },
  { left: "90%", size: 7, delay: "1.9s", dur: "5.5s" },
];

function VideoPlaceholder() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-b from-navy-soft via-navy to-navy-deep">
      {/* soft light from above */}
      <div className="absolute -top-1/4 left-1/2 h-2/3 w-[140%] -translate-x-1/2 rounded-full bg-sky/25 blur-3xl" />
      {/* rising suds */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-24px] rounded-full border border-sky-light/50 bg-sky-light/15"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animation: `rise ${b.dur} ease-in ${b.delay} infinite`,
          }}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <Sparkle className="h-8 w-8 animate-twinkle text-gold" />
        <Logo tone="dark" size="lg" />
        <p className="text-sm font-medium tracking-wide text-cream/75">{siteConfig.slogan}</p>
      </div>
      {/* moving shine */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
