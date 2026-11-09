import { siteConfig } from "@/site.config";
import { Sparkle } from "../icons";
import { PromoVideo, type VideoFiles } from "../PromoVideo";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function VideoFeature({ video }: { video: VideoFiles }) {
  const { video: copy } = siteConfig;
  const vertical = copy.aspect === "vertical";

  const frame = (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-8 rounded-[3rem] bg-sky/20 blur-3xl" />
      <div
        className={`relative overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-2xl shadow-black/40 ${
          vertical ? "mx-auto aspect-[9/16] max-w-[22rem]" : "aspect-video"
        }`}
      >
        <PromoVideo files={video} mode="feature" />
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-navy py-24 text-cream sm:py-32">
      <Sparkle aria-hidden="true" className="absolute top-16 right-[8%] h-10 w-10 animate-twinkle text-gold" />
      <Sparkle aria-hidden="true" className="absolute bottom-24 left-[6%] h-5 w-5 animate-twinkle text-gold [animation-delay:1.5s]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {vertical ? (
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.caption} dark align="left" />
            </div>
            <Reveal delay={0.1}>{frame}</Reveal>
          </div>
        ) : (
          <>
            <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.caption} dark />
            <Reveal delay={0.1} className="mt-14">
              {frame}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
