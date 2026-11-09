"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { Logo } from "./Logo";
import { useWaitlist } from "./waitlist/WaitlistProvider";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { openWaitlist, signup } = useWaitlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-cream/0"
      }`}
    >
      <nav className={`mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8 ${siteConfig.logoSrc ? "h-18 sm:h-20" : "h-16 sm:h-18"}`} aria-label="Main">
        <a href="#top" className="shrink-0" aria-label="WishWash home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-navy">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => openWaitlist({ source: "nav" })}
          className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-navy-soft active:scale-[0.98] sm:px-5"
        >
          {signup ? "You're on the list" : "Join the Waitlist"}
        </button>
      </nav>
    </header>
  );
}
