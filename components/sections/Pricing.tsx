"use client";

import { siteConfig } from "@/site.config";
import { trackEvent } from "@/lib/track";
import { CheckIcon, Sparkle } from "../icons";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useWaitlist } from "../waitlist/WaitlistProvider";

export function Pricing() {
  const { pricing, tiers } = siteConfig;
  const { openWaitlist } = useWaitlist();

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={pricing.eyebrow} title={pricing.title} subtitle={pricing.subtitle} />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {tiers.map((tier, i) => {
            const featured = tier.popular;
            return (
              <Reveal key={tier.id} delay={i * 0.1} className="h-full">
                <article
                  className={`relative flex h-full flex-col rounded-3xl p-7 transition duration-300 hover:-translate-y-1 sm:p-8 ${
                    featured
                      ? "bg-navy text-cream shadow-2xl shadow-navy/25"
                      : "border border-line bg-white text-navy hover:shadow-xl hover:shadow-navy/5"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-navy-deep">
                      <Sparkle className="h-2.5 w-2.5" /> Most popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                  <p className={`mt-1.5 text-sm ${featured ? "text-cream/70" : "text-muted"}`}>{tier.blurb}</p>

                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-5xl font-bold tracking-tight">${tier.price}</span>
                    <span className={`text-sm ${featured ? "text-cream/70" : "text-muted"}`}>{tier.unit}</span>
                  </p>
                  <p className={`mt-1 text-xs font-medium ${featured ? "text-sky-light" : "text-sky-ink"}`}>{tier.duration}</p>

                  <ul className="mt-6 space-y-3 text-[0.95rem]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <CheckIcon className={`mt-0.5 h-5 w-5 shrink-0 ${featured ? "text-sky" : "text-sky-ink"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                  <button
                    onClick={() => {
                      trackEvent("tier_click", { tier: tier.id });
                      openWaitlist({ tier: tier.id, source: `tier_${tier.id}` });
                    }}
                    className={`h-12 w-full rounded-2xl font-semibold transition active:scale-[0.99] ${
                      featured
                        ? "bg-sky text-navy-deep hover:bg-sky-light"
                        : "border border-navy/15 bg-cream text-navy hover:border-navy hover:bg-navy hover:text-cream"
                    }`}
                  >
                    {pricing.cta}
                  </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">{pricing.note}</p>
      </div>
    </section>
  );
}
