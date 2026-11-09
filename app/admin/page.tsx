import type { Metadata } from "next";
import { connection } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getAll, usingSupabase, type Signup } from "@/lib/db";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Admin · ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await connection(); // always render fresh, never cache signups
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <Shell>
        <Card>
          <h1 className="font-display text-2xl font-bold">Admin isn&apos;t set up yet</h1>
          <p className="mt-2 text-muted">
            Add an <code className="rounded bg-sand px-1.5 py-0.5">ADMIN_PASSWORD</code> environment variable (see the
            README), then reload this page.
          </p>
        </Card>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <Shell>
        <Card className="mx-auto max-w-sm">
          <h1 className="font-display text-2xl font-bold">{siteConfig.name} admin</h1>
          <form action="/api/admin/login" method="post" className="mt-5 space-y-3">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-sky focus:ring-4 focus:ring-sky/20"
            />
            {error && <p className="text-sm font-medium text-[#b42318]">Wrong password. Try again.</p>}
            <button className="h-12 w-full rounded-xl bg-navy font-semibold text-cream hover:bg-navy-soft">Sign in</button>
          </form>
        </Card>
      </Shell>
    );
  }

  let data: Awaited<ReturnType<typeof getAll>>;
  try {
    data = await getAll();
  } catch (err) {
    return (
      <Shell>
        <Card>
          <h1 className="font-display text-2xl font-bold">Couldn&apos;t load signups</h1>
          <p className="mt-2 text-muted">{err instanceof Error ? err.message : String(err)}</p>
        </Card>
      </Shell>
    );
  }

  const { signups, events } = data;
  const stats = summarize(signups, events);

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Waitlist dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            {usingSupabase ? "Live from Supabase." : "Local test data (.data/wishwash-db.json)."} Refresh for the latest.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/api/admin/export" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-navy">
            Download CSV
          </a>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-muted hover:text-navy">Sign out</button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total signups" value={stats.total} />
        <Stat label="In launch area" value={stats.inArea} sub={`${pct(stats.inArea, stats.total)} of signups`} />
        <Stat label="Last 7 days" value={stats.last7} />
        <Stat
          label="Avg. expected price"
          value={stats.avgPrice == null ? "–" : `$${stats.avgPrice.toFixed(0)}`}
          sub={`${stats.priceAnswers} ${stats.priceAnswers === 1 ? "answer" : "answers"}`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Tier interest</h2>
          <p className="text-sm text-muted">&ldquo;I&apos;d book this&rdquo; clicks, and tier picked by signups.</p>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-2 font-medium">Tier</th>
                <th className="py-2 text-right font-medium">Clicks</th>
                <th className="py-2 text-right font-medium">Signups</th>
              </tr>
            </thead>
            <tbody>
              {stats.tiers.map((t) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="py-2.5">
                    {t.name} <span className="text-muted">${t.price}</span>
                  </td>
                  <td className="py-2.5 text-right font-semibold">{t.clicks}</td>
                  <td className="py-2.5 text-right font-semibold">{t.signups}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">Video plays: {stats.videoPlays}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">How often they&apos;d wash</h2>
          <div className="mt-4 space-y-3">
            {stats.frequency.map((f) => (
              <Bar key={f.label} label={f.label} count={f.count} max={stats.frequencyMax} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Signups by zip code</h2>
          <p className="text-sm text-muted">Outside-area zips show where to expand next.</p>
          <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
            {stats.zips.length === 0 && <p className="text-sm text-muted">No signups yet.</p>}
            {stats.zips.map((z) => (
              <Bar
                key={z.zip}
                label={z.zip}
                tag={z.inArea ? undefined : "outside"}
                count={z.count}
                max={stats.zips[0]?.count ?? 1}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Expected price per wash</h2>
          <div className="mt-4 space-y-3">
            {stats.prices.map((p) => (
              <Bar key={p.label} label={p.label} count={p.count} max={stats.pricesMax} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <h2 className="text-lg font-bold">Latest signups</h2>
        <table className="mt-4 w-full min-w-[640px] text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="py-2 font-medium">When</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Zip</th>
              <th className="py-2 font-medium">Tier</th>
              <th className="py-2 font-medium">Frequency</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {signups
              .slice(-25)
              .reverse()
              .map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="py-2.5 whitespace-nowrap text-muted">
                    {new Date(s.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </td>
                  <td className="py-2.5">{s.email}</td>
                  <td className="py-2.5">
                    {s.zip} {!s.in_area && <span className="text-xs text-muted">(outside)</span>}
                  </td>
                  <td className="py-2.5">{tierName(s.tier) ?? "–"}</td>
                  <td className="py-2.5">{freqLabel(s.frequency) ?? "–"}</td>
                  <td className="py-2.5">{s.expected_price ? `$${s.expected_price}` : "–"}</td>
                  <td className="py-2.5 text-muted">{s.source ?? "–"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

function summarize(signups: Signup[], events: { type: string; value: string | null }[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const prices = signups.map((s) => s.expected_price).filter((p): p is number => p != null);

  const zipCounts = new Map<string, { count: number; inArea: boolean }>();
  for (const s of signups) {
    const z = zipCounts.get(s.zip) ?? { count: 0, inArea: s.in_area };
    z.count++;
    zipCounts.set(s.zip, z);
  }

  const frequency = siteConfig.waitlist.frequencyOptions.map((f) => ({
    label: f.label,
    count: signups.filter((s) => s.frequency === f.id).length,
  }));
  const options = siteConfig.waitlist.priceOptions;
  const priceBuckets = options.map((p, i) => ({
    label: i === options.length - 1 ? `$${p}+` : `$${p}`,
    count: prices.filter((x) => x === p).length,
  }));

  return {
    total: signups.length,
    inArea: signups.filter((s) => s.in_area).length,
    last7: signups.filter((s) => new Date(s.created_at).getTime() > weekAgo).length,
    avgPrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
    priceAnswers: prices.length,
    videoPlays: events.filter((e) => e.type === "video_play").length,
    tiers: siteConfig.tiers.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      clicks: events.filter((e) => e.type === "tier_click" && e.value === t.id).length,
      signups: signups.filter((s) => s.tier === t.id).length,
    })),
    zips: [...zipCounts.entries()]
      .map(([zip, v]) => ({ zip, ...v }))
      .sort((a, b) => b.count - a.count || a.zip.localeCompare(b.zip)),
    frequency,
    frequencyMax: Math.max(1, ...frequency.map((f) => f.count)),
    prices: priceBuckets,
    pricesMax: Math.max(1, ...priceBuckets.map((p) => p.count)),
  };
}

const tierName = (id: string | null) => siteConfig.tiers.find((t) => t.id === id)?.name;
const freqLabel = (id: string | null) => siteConfig.waitlist.frequencyOptions.find((f) => f.id === id)?.label;
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "0%");

// ── UI bits ──────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-dvh max-w-6xl px-5 py-12 text-navy sm:px-8">{children}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-line bg-white p-6 ${className}`}>{children}</section>;
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-4xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </Card>
  );
}

function Bar({ label, count, max, tag }: { label: string; count: number; max: number; tag?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0">
        {label} {tag && <span className="text-xs text-muted">({tag})</span>}
      </span>
      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand">
        <span className="block h-full rounded-full bg-sky" style={{ width: `${(count / max) * 100}%` }} />
      </span>
      <span className="w-8 text-right font-semibold tabular-nums">{count}</span>
    </div>
  );
}
