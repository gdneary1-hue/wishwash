import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, passwordMatches } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const attempt = String(form.get("password") ?? "");
  const token = adminToken();

  if (!token || !passwordMatches(attempt)) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
