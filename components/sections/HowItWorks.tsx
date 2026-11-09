import { siteConfig } from "@/site.config";
import { iconMap, type IconName } from "../icons";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function HowItWorks() {
  const { howItWorks } = siteConfig;
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <div className="relative mt-16">
          {/* connecting line on desktop */}
          <div aria-hidden="true" className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-line via-sky-light to-line md:block" />
        <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          {howItWorks.steps.map((step, i) => {
            const Icon = iconMap[step.icon as IconName];
            return (
              <Reveal key={step.title} delay={i * 0.12} as="li" className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-navy text-cream shadow-lg shadow-navy/15">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-sky text-xs font-bold text-navy-deep ring-4 ring-white">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-navy md:mt-6">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted md:mx-auto md:max-w-xs">{step.body}</p>
                  </div>
              </Reveal>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
}
