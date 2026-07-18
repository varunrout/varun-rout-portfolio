import 'server-only';

/**
 * Real shot-level records from the CxG diagnostic model (opponent-adjusted-metrics),
 * benchmarked against StatsBomb's own xG on the same shots. Open StatsBomb data.
 * Stored in Supabase (public-read RLS); fetched server-side and passed to the client demo.
 */
export type Shot = {
  id: string;
  match_id: number;
  match: string;
  team: string;
  x: number;
  y: number;
  cxg: number;
  statsbomb_xg: number;
  goal: 0 | 1;
  distance: number;
  angle: number;
  pressure: boolean;
  game_state: string;
};

/**
 * Reads the shots sample from Supabase at build/revalidate time. Returns [] on any failure
 * so the demo can render a graceful "unavailable" state rather than crash the page.
 */
// Public-safe defaults so any deploy works without env config. The publishable key is designed to ship
// publicly (it is the client-side key), the URL is public, and the shots table is read-only via RLS.
// Set NEXT_PUBLIC_SUPABASE_* env vars to override (e.g. to point at a different project).
const DEFAULT_URL = 'https://uoxmvcbypdjfmekitzdo.supabase.co';
const DEFAULT_KEY = 'sb_publishable_wclTccK2cusDTL3XkSHMDw_eLvn1bUJ';

export async function getShots(): Promise<Shot[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? DEFAULT_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(`${url}/rest/v1/shots?select=*&order=match_id.asc,id.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      // Rebuild the static page from Supabase at most hourly; no per-request DB hit.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as Shot[];
  } catch {
    return [];
  }
}
