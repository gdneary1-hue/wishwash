"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { TierId } from "@/site.config";
import { CloseIcon } from "../icons";
import { WaitlistForm } from "./WaitlistForm";

export type SignupResult = { id: string; position: number; inArea: boolean; zip: string };
export type Step = "start" | "details" | "done";

type WaitlistState = {
  /** Shared across every form on the page, so signing up once updates them all. */
  signup: SignupResult | null;
  step: Step;
  setSignup: (s: SignupResult) => void;
  setStep: (s: Step) => void;
  /** Tier chosen via an "I'd book this" button. */
  tier: TierId | null;
  openWaitlist: (opts?: { tier?: TierId; source?: string }) => void;
};

const WaitlistContext = createContext<WaitlistState | null>(null);
const STORAGE_KEY = "wishwash-signup";

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used inside <WaitlistProvider>");
  return ctx;
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [signup, setSignupState] = useState<SignupResult | null>(null);
  const [step, setStep] = useState<Step>("start");
  const [tier, setTier] = useState<TierId | null>(null);
  const [modal, setModal] = useState<{ source: string } | null>(null);

  // Remember returning visitors so they see their spot instead of the form.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage
        setSignupState(JSON.parse(saved));
        setStep("done");
      }
    } catch {}
  }, []);

  const setSignup = useCallback((s: SignupResult) => {
    setSignupState(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }, []);

  const openWaitlist = useCallback((opts?: { tier?: TierId; source?: string }) => {
    if (opts?.tier) setTier(opts.tier);
    setModal({ source: opts?.source ?? "nav" });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <WaitlistContext.Provider value={{ signup, step, setSignup, setStep, tier, openWaitlist }}>
        {children}
        <AnimatePresence>
          {modal && <WaitlistModal source={modal.source} onClose={() => setModal(null)} />}
        </AnimatePresence>
      </WaitlistContext.Provider>
    </MotionConfig>
  );
}

function WaitlistModal({ source, onClose }: { source: string; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstField = panel.current?.querySelector<HTMLElement>("input:not([tabindex='-1']), button");
    firstField?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Join the waitlist"
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-cream p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-muted transition hover:bg-sand hover:text-navy"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <WaitlistForm source={source} variant="modal" />
      </motion.div>
    </motion.div>
  );
}
