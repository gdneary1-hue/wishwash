import { NextResponse } from "next/server";
import { addEvent } from "@/lib/db";
import { tierIds } from "@/lib/validate";

/**
 * Records interest events in our own database so the /admin page can show
 * them. (Vercel Analytics tracks them too, but its data can't be queried here.)
 */
const ALLOWED = new Set(["tier_click", "video_play"]);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const type = body?.type;
  if (!ALLOWED.has(type)) return NextResponse.json({ ok: false }, { status: 400 });

  let value: string | null = null;
  if (type === "tier_click") {
    if (!tierIds.includes(body.value)) return NextResponse.json({ ok: false }, { status: 400 });
    value = body.value;
  }

  try {
    await addEvent(type, value);
  } catch (err) {
    console.error("[event]", err);
  }
  return NextResponse.json({ ok: true });
}
