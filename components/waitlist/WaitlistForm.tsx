"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { siteConfig, type TierId } from "@/site.config";
import { trackEvent } from "@/lib/track";
import { CheckIcon, Sparkle } from "../icons";
import { useWaitlist } from "./WaitlistProvider";

type Variant = "light" | "dark" | "modal";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3 },
};

export function WaitlistForm({ source, variant = "light" }: { source: string; variant?: Variant }) {
  const { step } = useWaitlist();
  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {step === "start" && (
          <motion.div key="start" {...fade}>
            <StartStep source={source} variant={variant} />
          </motion.div>
        )}
        {step === "details" && (
          <motion.div key="details" {...fade}>
            <DetailsStep variant={variant} />
          </motion.div>
        )}
        {step === "done" && (
          <motion.div key="done" {...fade}>
            <DoneStep variant={variant} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 1: email + zip ──────────────────────────────────────────────────────

function StartStep({ source, variant }: { source: string; variant: Variant }) {
  const { setSignup, setStep, tier } = useWaitlist();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const id = useId();
  const dark = variant === "dark";
  const tierName = siteConfig.tiers.find((t) => t.id === tier)?.name;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const zip = String(form.get("zip") ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError("Please enter a valid email address.");
    if (!/^\d{5}$/.test(zip)) return setError("Please enter a 5-digit zip code.");

    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zip, tier, source, company: form.get("company") }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      setSignup({ id: data.id, position: data.position, inArea: data.inArea, zip });
      if (!data.existing) trackEvent("waitlist_signup", { source, inArea: data.inArea, tier: tier ?? "none" });
      setStep(data.existing ? "done" : "details");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const input = `h-13 w-full rounded-2xl border px-4 text-base outline-none transition focus:ring-4 ${
    dark
      ? "border-white/15 bg-white/10 text-cream placeholder:text-cream/55 focus:border-sky focus:ring-sky/25"
      : "border-line bg-white text-navy placeholder:text-muted/80 focus:border-sky focus:ring-sky/20"
  }`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      {variant === "modal" && (
        <div className="mb-5 pr-8">
          <h2 className="font-display text-3xl font-bold">Get on the list.</h2>
          <p className="mt-2 text-muted">
            Be first to book when we launch in {siteConfig.market.label}. It takes ten seconds.
          </p>
        </div>
      )}

      {tierName && (
        <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${dark ? "bg-white/10 text-cream" : "bg-sky-wash text-navy"}`}>
          <Sparkle className="h-3 w-3 text-gold" />
          You picked: {tierName}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          className={`${input} sm:flex-[1.6]`}
        />
        <label htmlFor={`${id}-zip`} className="sr-only">Zip code</label>
        <input
          id={`${id}-zip`}
          name="zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Zip code"
          maxLength={5}
          pattern="\d{5}"
          required
          className={`${input} sm:flex-1`}
        />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={`group relative h-13 w-full overflow-hidden rounded-2xl text-base font-semibold transition active:scale-[0.99] disabled:opacity-70 ${
          dark ? "bg-sky text-navy-deep hover:bg-sky-light" : "bg-navy text-cream hover:bg-navy-soft"
        }`}
      >
        <span className="relative z-10">{status === "loading" ? "Saving your spot…" : "Join the waitlist"}</span>
        <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition group-hover:animate-sheen group-hover:opacity-100" />
      </button>

      {error && (
        <p role="alert" className={`text-sm font-medium ${dark ? "text-[#ffb4a8]" : "text-[#b42318]"}`}>
          {error}
        </p>
      )}
    </form>
  );
}

// ── Step 2: optional questions ───────────────────────────────────────────────

function DetailsStep({ variant }: { variant: Variant }) {
  const { signup, setStep, tier: preselected } = useWaitlist();
  const [tier, setTier] = useState<TierId | null>(preselected);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const dark = variant === "dark";
  const { frequencyOptions, priceOptions } = siteConfig.waitlist;
  const maxPrice = priceOptions[priceOptions.length - 1];

  async function save() {
    setSaving(true);
    if (signup?.id && (tier || frequency || price)) {
      await fetch("/api/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: signup.id, tier, frequency, expectedPrice: price }),
      }).catch(() => {});
    }
    setStep("done");
  }

  return (
    <div>
      <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${dark ? "text-sky-light" : "text-sky-ink"}`}>
        You&apos;re #{signup?.position} in line
      </p>
      <h3 className="mt-1 font-display text-2xl font-bold">Help us build it right.</h3>
      <p className={`mt-1 text-sm ${dark ? "text-cream/70" : "text-muted"}`}>Three quick taps. All optional.</p>

      <ChipGroup
        label="Which service sounds best?"
        dark={dark}
        options={siteConfig.tiers.map((t) => ({ value: t.id, label: t.name }))}
        value={tier}
        onChange={(v) => setTier(v as TierId | null)}
      />
      <ChipGroup
        label="How often would you wash your car?"
        dark={dark}
        options={frequencyOptions.map((f) => ({ value: f.id, label: f.label }))}
        value={frequency}
        onChange={setFrequency}
      />
      <ChipGroup
        label="What would you expect to pay per wash?"
        dark={dark}
        options={priceOptions.map((p) => ({ value: String(p), label: p === maxPrice ? `$${p}+` : `$${p}` }))}
        value={price == null ? null : String(price)}
        onChange={(v) => setPrice(v == null ? null : Number(v))}
      />

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className={`h-12 flex-1 rounded-2xl font-semibold transition active:scale-[0.99] disabled:opacity-70 ${
            dark ? "bg-sky text-navy-deep hover:bg-sky-light" : "bg-navy text-cream hover:bg-navy-soft"
          }`}
        >
          {saving ? "Saving…" : "Finish"}
        </button>
        <button
          onClick={() => setStep("done")}
          className={`h-12 rounded-2xl px-5 font-medium transition ${dark ? "text-cream/70 hover:text-cream" : "text-muted hover:text-navy"}`}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
  dark,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
  dark: boolean;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : o.value)}
              className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? dark
                    ? "border-sky bg-sky text-navy-deep"
                    : "border-navy bg-navy text-cream"
                  : dark
                    ? "border-white/15 bg-white/5 text-cream hover:border-white/35"
                    : "border-line bg-white text-navy hover:border-sky"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Step 3: success + share ──────────────────────────────────────────────────

function DoneStep({ variant }: { variant: Variant }) {
  const { signup } = useWaitlist();
  const dark = variant === "dark";
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(siteConfig.url);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values
    setUrl(window.location.origin);
    setCanShare(typeof navigator.share === "function");
  }, []);

  const text = siteConfig.waitlist.shareText;
  const message = `${text} ${url}`;

  async function nativeShare() {
    trackEvent("share_click", { method: "native" });
    try {
      await navigator.share({ title: siteConfig.name, text, url });
    } catch {}
  }

  async function copy() {
    trackEvent("share_click", { method: "copy" });
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const shareBtn = `inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
    dark ? "border-white/15 bg-white/5 text-cream hover:bg-white/10" : "border-line bg-white text-navy hover:border-sky"
  }`;

  return (
    <div className="text-left">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${dark ? "bg-sky text-navy-deep" : "bg-navy text-cream"}`}>
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold leading-tight">You&apos;re on the list!</h3>
          {signup && signup.position > 0 && (
            <p className={dark ? "text-cream/80" : "text-muted"}>
              You&apos;re <strong className={dark ? "text-sky-light" : "text-navy"}>#{signup.position}</strong> in line.
            </p>
          )}
        </div>
      </div>

      {signup && !signup.inArea && (
        <p className={`mt-4 rounded-2xl p-3 text-sm ${dark ? "bg-white/5 text-cream/80" : "bg-sand text-muted"}`}>
          Heads up: we&apos;re starting in {siteConfig.market.label}. We saved your zip ({signup.zip}). The more
          signups an area gets, the sooner we come to it.
        </p>
      )}

      <p className="mt-5 text-sm font-semibold">Tell a friend. Every share moves your city up the list.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {canShare && (
          <button onClick={nativeShare} className={shareBtn}>
            Share
          </button>
        )}
        <a
          href={`sms:?&body=${encodeURIComponent(message)}`}
          onClick={() => trackEvent("share_click", { method: "sms" })}
          className={shareBtn}
        >
          Text a friend
        </a>
        <button onClick={copy} className={shareBtn}>
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" /> Copied
            </>
          ) : (
            "Copy link"
          )}
        </button>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("share_click", { method: "facebook" })}
          className={shareBtn}
        >
          Facebook
        </a>
        <a
          href={`https://x.com/intent/post?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("share_click", { method: "x" })}
          className={shareBtn}
        >
          X
        </a>
      </div>
    </div>
  );
}

