/**
 * Storage for waitlist signups and interest events.
 *
 * - Production: Supabase (free tier), via its REST API, so no extra library.
 *   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see README).
 * - Local development without those variables: a JSON file in .data/
 *   so you can try the form immediately.
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type Signup = {
  id: string;
  email: string;
  zip: string;
  in_area: boolean;
  tier: string | null;
  frequency: string | null;
  expected_price: number | null;
  source: string | null;
  created_at: string;
};

export type EventRow = {
  type: string;
  value: string | null;
  created_at: string;
};

export type NewSignup = Pick<Signup, "email" | "zip" | "in_area" | "tier" | "source">;
export type SignupDetails = Partial<Pick<Signup, "tier" | "frequency" | "expected_price">>;

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

export class DbNotConfiguredError extends Error {}

// ── Supabase (PostgREST) ─────────────────────────────────────────────────────

async function sb(pathAndQuery: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  return res;
}

async function sbJson<T>(pathAndQuery: string, init: RequestInit = {}): Promise<T> {
  const res = await sb(pathAndQuery, init);
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function sbPosition(createdAt: string) {
  const res = await sb(`signups?select=id&created_at=lte.${encodeURIComponent(createdAt)}`, {
    method: "HEAD",
    headers: { Prefer: "count=exact" },
  });
  const range = res.headers.get("content-range"); // e.g. "*/42"
  return Number(range?.split("/")[1] ?? 0);
}

async function sbAll<T>(table: string): Promise<T[]> {
  const rows: T[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const batch = await sbJson<T[]>(`${table}?select=*&order=created_at.asc`, {
      headers: { Range: `${from}-${from + page - 1}` },
    });
    rows.push(...batch);
    if (batch.length < page) return rows;
  }
}

// ── Local JSON file (dev only) ───────────────────────────────────────────────

type LocalStore = { signups: Signup[]; events: EventRow[] };
const LOCAL_FILE = path.join(process.cwd(), ".data", "wishwash-db.json");

async function readLocal(): Promise<LocalStore> {
  if (process.env.VERCEL) {
    throw new DbNotConfiguredError(
      "Database not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    );
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return { signups: [], events: [] };
  }
}

async function writeLocal(store: LocalStore) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(store, null, 2));
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Saves a signup. If the email already exists, returns the original spot. */
export async function addSignup(
  input: NewSignup,
): Promise<{ id: string; position: number; existing: boolean }> {
  if (usingSupabase) {
    const res = await sb("signups", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    });
    let row: Signup;
    let existing = false;
    if (res.status === 409) {
      const found = await sbJson<Signup[]>(
        `signups?select=*&email=eq.${encodeURIComponent(input.email)}`,
      );
      row = found[0];
      existing = true;
    } else if (!res.ok) {
      throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    } else {
      row = ((await res.json()) as Signup[])[0];
    }
    return { id: row.id, position: await sbPosition(row.created_at), existing };
  }

  const store = await readLocal();
  const index = store.signups.findIndex((s) => s.email === input.email);
  if (index >= 0) return { id: store.signups[index].id, position: index + 1, existing: true };
  const row: Signup = {
    id: randomUUID(),
    frequency: null,
    expected_price: null,
    created_at: new Date().toISOString(),
    ...input,
  };
  store.signups.push(row);
  await writeLocal(store);
  return { id: row.id, position: store.signups.length, existing: false };
}

/** Adds the optional step-two answers to an existing signup. */
export async function updateSignup(id: string, details: SignupDetails) {
  if (usingSupabase) {
    const res = await sb(`signups?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(details),
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    return;
  }
  const store = await readLocal();
  const row = store.signups.find((s) => s.id === id);
  if (row) Object.assign(row, details);
  await writeLocal(store);
}

export async function addEvent(type: string, value: string | null) {
  if (usingSupabase) {
    const res = await sb("events", { method: "POST", body: JSON.stringify({ type, value }) });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    return;
  }
  const store = await readLocal();
  store.events.push({ type, value, created_at: new Date().toISOString() });
  await writeLocal(store);
}

export async function getAll(): Promise<LocalStore> {
  if (usingSupabase) {
    const [signups, events] = await Promise.all([
      sbAll<Signup>("signups"),
      sbAll<EventRow>("events"),
    ]);
    return { signups, events };
  }
  return readLocal();
}
