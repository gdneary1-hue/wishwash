import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ww_admin";

/** The cookie value is derived from the password, so changing it logs everyone out. */
export function adminToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("wishwash-admin-v1").digest("hex");
}

export function passwordMatches(attempt: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(attempt);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const token = adminToken();
  if (!token) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  return value.length === token.length && timingSafeEqual(Buffer.from(value), Buffer.from(token));
}
