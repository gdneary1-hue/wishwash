"use client";

import { track } from "@vercel/analytics";

type EventName = "waitlist_signup" | "tier_click" | "video_play" | "faq_open" | "share_click";

/**
 * Sends an event to Vercel Analytics. Tier clicks and video plays are also
 * saved to our own database so they show up on the /admin page.
 */
export function trackEvent(name: EventName, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {
    // analytics must never break the page
  }

  if (name === "tier_click" || name === "video_play") {
    const body = JSON.stringify({ type: name, value: props?.tier ?? null });
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}
