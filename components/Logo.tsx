import Image from "next/image";
import { siteConfig } from "@/site.config";
import { Sparkle } from "./icons";

/**
 * Uses your logo file if `logoSrc` is set in site.config.ts (light backgrounds
 * only). Otherwise it shows a text wordmark styled after the WishWash logo.
 */
export function Logo({
  tone = "light",
  size = "md",
  className = "",
}: {
  tone?: "light" | "dark";
  size?: "md" | "lg";
  className?: string;
}) {
  if (siteConfig.logoSrc && tone === "light") {
    return (
      <Image
        src={siteConfig.logoSrc}
        alt={siteConfig.name}
        width={siteConfig.logoWidth}
        height={siteConfig.logoHeight}
        priority={size === "md"}
        className={`w-auto ${size === "lg" ? "h-44 sm:h-52" : "h-14 sm:h-16"} ${className}`}
      />
    );
  }

  const [first, second] = splitName(siteConfig.name);
  return (
    <span
      className={`relative inline-flex items-baseline font-display font-bold ${size === "lg" ? "text-5xl" : "text-[1.6rem]"} leading-none tracking-tight ${className}`}
      role="img"
      aria-label={siteConfig.name}
    >
      <span className={tone === "light" ? "text-navy" : "text-cream"}>{first}</span>
      <span className={tone === "light" ? "text-sky" : "text-sky-light"}>{second}</span>
      <Sparkle className="absolute -top-[0.3em] left-[1.05em] h-[0.4em] w-[0.4em] text-gold" />
    </span>
  );
}

/** "WishWash" → ["Wish", "Wash"]: splits at the second capital letter. */
function splitName(name: string): [string, string] {
  const i = name.slice(1).search(/[A-Z ]/) + 1;
  return i > 0 ? [name.slice(0, i), name.slice(i).trim()] : [name, ""];
}
