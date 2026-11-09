import { isAdmin } from "@/lib/admin-auth";
import { getAll } from "@/lib/db";

/** Downloads every signup as a CSV (opens in Excel / Google Sheets). */
export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const { signups } = await getAll();
  const cols = ["created_at", "email", "zip", "in_area", "tier", "frequency", "expected_price", "source"] as const;
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...signups.map((s) => cols.map((c) => escape(s[c])).join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wishwash-signups.csv"`,
    },
  });
}
