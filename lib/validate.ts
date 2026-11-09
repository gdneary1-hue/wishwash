import { siteConfig } from "@/site.config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string) {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function isValidZip(zip: string) {
  return /^\d{5}$/.test(zip);
}

export function isInLaunchArea(zip: string) {
  const { zipPrefixes, extraZips } = siteConfig.market;
  return zipPrefixes.some((p) => zip.startsWith(p)) || extraZips.includes(zip);
}

export const tierIds: string[] = siteConfig.tiers.map((t) => t.id);
export const frequencyIds: string[] = siteConfig.waitlist.frequencyOptions.map((f) => f.id);
