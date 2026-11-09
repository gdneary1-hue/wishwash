import { siteConfig } from "@/site.config";
import { iconMap, type IconName } from "../icons";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Benefits() {
  const { benefits } = siteConfig;
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={benefits.eyebrow} title={benefits.title} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {benefits.items.map((item, i) => {
            const Icon = iconMap[item.icon as IconName];
            return (
              <Reveal key={item.title} delay={(i % 2) * 0.1}>
                <div className="group h-full rounded-3xl border border-line bg-cream p-7 transition duration-300 hover:border-sky-light hover:bg-white hover:shadow-xl hover:shadow-navy/5 sm:p-9">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-wash text-sky-ink transition duration-300 group-hover:bg-navy group-hover:text-cream">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
