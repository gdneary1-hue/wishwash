import { siteConfig } from "@/site.config";
import { Sparkle } from "../icons";
import { Reveal } from "../Reveal";
import { WaitlistForm } from "../waitlist/WaitlistForm";

export function FinalCta() {
  const { finalCta, hero } = siteConfig;
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy px-5 py-20 text-cream sm:rounded-[2.5rem] sm:px-8 sm:py-28">
        <div aria-hidden="true" className="absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-sky/25 blur-3xl" />
        <Sparkle aria-hidden="true" className="absolute top-12 left-[10%] h-6 w-6 animate-twinkle text-gold" />
        <Sparkle aria-hidden="true" className="absolute right-[12%] bottom-16 h-8 w-8 animate-twinkle text-gold [animation-delay:1s]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
          <h2 className="font-display text-[2.5rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            {finalCta.title}
          </h2>
          <p className="mt-5 text-lg text-cream/75">{finalCta.body}</p>
          </Reveal>
          <div className="mx-auto mt-10 max-w-xl text-left">
            <WaitlistForm source="final_cta" variant="dark" />
          </div>
          <p className="mt-5 text-sm text-cream/60">{hero.trustLine}</p>
        </div>
      </div>
    </section>
  );
}
