"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { siteConfig } from "@/site.config";
import { trackEvent } from "@/lib/track";
import { PlusIcon } from "../icons";
import { SectionHeading } from "../SectionHeading";

export function Faq() {
  const { faq } = siteConfig;
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />

        <div className="mt-12 divide-y divide-line border-y border-line">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => {
                      setOpen(isOpen ? null : i);
                      if (!isOpen) trackEvent("faq_open", { question: item.q });
                    }}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-navy transition hover:text-sky-ink sm:text-xl"
                  >
                    {item.q}
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition duration-300 ${
                        isOpen ? "rotate-45 border-navy bg-navy text-cream" : "border-line text-navy"
                      }`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a${i}`}
                      role="region"
                      aria-labelledby={`${id}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
