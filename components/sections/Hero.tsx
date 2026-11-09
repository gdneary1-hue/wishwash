import { siteConfig } from "@/site.config";
import { Sparkle } from "../icons";
import { PromoVideo, type VideoFiles } from "../PromoVideo";
import { WaitlistForm } from "../waitlist/WaitlistForm";

export function Hero({ video }: { video: VideoFiles }) {
  const { hero } = siteConfig;
  return (
    <section id="top" className={`relative overflow-hidden ${siteConfig.logoSrc ? "-mt-18 pt-18 sm:-mt-20 sm:pt-20" : "-mt-16 pt-16 sm:-mt-18 sm:pt-18"}`}>
      {/* background wash */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-20%] h-[38rem] w-[38rem] rounded-full bg-sky-wash blur-3xl sm:right-[-5%]" />
        <div className="absolute top-1/2 left-[-25%] h-[26rem] w-[26rem] rounded-full bg-sand blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-8 pb-20 sm:px-8 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-navy">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky" />
            </span>
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-[3.6rem] leading-[1] font-bold tracking-tight text-navy sm:text-7xl lg:text-[5.5rem]">
            {hero.headline}
            <br />
            <span className="relative whitespace-nowrap text-sky-ink italic">
              {hero.headlineAccent}
              <Sparkle className="absolute top-1 -right-7 h-6 w-6 animate-twinkle text-gold sm:-right-10 sm:h-8 sm:w-8" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{hero.subhead}</p>

          <div className="mt-8 max-w-xl">
            <WaitlistForm source="hero" />
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <Sparkle className="h-3 w-3 shrink-0 text-gold" />
              {hero.trustLine}
            </p>
          </div>
        </div>

        {/* phone mockup */}
        <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem]">
          <WaterSwoosh />
          <Sparkle className="absolute -top-6 right-2 h-10 w-10 animate-twinkle text-gold" />
          <Sparkle className="absolute top-1/3 -left-8 h-5 w-5 animate-twinkle text-gold [animation-delay:1.2s]" />
          <Sparkle className="absolute -right-6 bottom-16 h-4 w-4 animate-twinkle text-gold [animation-delay:2s]" />
          <div className="relative animate-float rounded-[3rem] bg-navy-deep p-2.5 shadow-[0_40px_80px_-20px_rgba(14,33,71,0.45)] ring-1 ring-navy/10">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem]">
              <PromoVideo files={video} mode="hero" />
              <div className="absolute top-2.5 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The sweeping water arcs from the logo, behind the phone. */
function WaterSwoosh() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className="absolute top-1/2 left-1/2 w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2 text-sky"
      fill="none"
    >
      <path d="M28 300C40 150 200 40 380 70" stroke="currentColor" strokeOpacity=".5" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 330C90 210 230 120 385 115" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
