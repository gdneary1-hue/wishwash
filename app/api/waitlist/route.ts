import { NextResponse } from "next/server";
import { addSignup, updateSignup, DbNotConfiguredError } from "@/lib/db";
import {
  frequencyIds,
  isInLaunchArea,
  isValidEmail,
  isValidZip,
  tierIds,
} from "@/lib/validate";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function serverError(err: unknown) {
  console.error("[waitlist]", err);
  if (err instanceof DbNotConfiguredError) return fail(err.message, 503);
  return fail("Something went wrong on our end. Please try again.", 500);
}

/** Step 1: email + zip. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Invalid request.");

  // Honeypot: real people never see or fill the "company" field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, id: "", position: 0, inArea: true, existing: false });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const zip = String(body.zip ?? "").trim();
  const tier = tierIds.includes(body.tier) ? (body.tier as string) : null;
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : null;

  if (!isValidEmail(email)) return fail("Please enter a valid email address.");
  if (!isValidZip(zip)) return fail("Please enter a 5-digit zip code.");

  const inArea = isInLaunchArea(zip);
  try {
    const { id, position, existing } = await addSignup({ email, zip, in_area: inArea, tier, source });
    return NextResponse.json({ ok: true, id, position, inArea, existing });
  } catch (err) {
    return serverError(err);
  }
}

/** Step 2: optional tier, wash frequency, and expected price. */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) {
    return fail("Invalid request.");
  }

  const details: Record<string, string | number> = {};
  if (tierIds.includes(body.tier)) details.tier = body.tier;
  if (frequencyIds.includes(body.frequency)) details.frequency = body.frequency;
  const price = Number(body.expectedPrice);
  if (Number.isFinite(price) && price > 0 && price <= 1000) details.expected_price = price;

  if (Object.keys(details).length === 0) return NextResponse.json({ ok: true });
  try {
    await updateSignup(body.id, details);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}
