import { Sparkle } from "./icons";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p
        className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-sky-light" : "text-sky-ink"
        }`}
      >
        <Sparkle className="h-2.5 w-2.5 text-gold" />
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-[2.4rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl ${
          dark ? "text-cream" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-lg text-pretty ${dark ? "text-cream/70" : "text-muted"}`}>{subtitle}</p>}
    </Reveal>
  );
}
