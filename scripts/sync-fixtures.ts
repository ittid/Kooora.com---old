/**
 * Sync upcoming + past fixtures from TheSportsDB into our matches table.
 *
 * Usage:
 *   pnpm sync:fixtures           # only leagues with external_id_sdb set
 *   pnpm sync:fixtures laliga    # restrict to one league by slug
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. Designed to be safe to run
 * on a cron (every few hours) — upserts on matches.external_id.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadDotEnv() {
  try {
    const text = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (!m) continue;
      const v = m[2].replace(/^["']|["']$/g, "");
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  } catch {
    // optional
  }
}

type SDBEvent = {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string | null;          // YYYY-MM-DD
  strTime: string | null;            // HH:MM:SS UTC
  strTimestamp: string | null;       // ISO with TZ
  strStatus: string | null;
  strVenue: string | null;
  intRound: string | null;
};

async function fetchNext(leagueId: number): Promise<SDBEvent[]> {
  const r = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`,
  );
  if (!r.ok) return [];
  const j = (await r.json()) as { events: SDBEvent[] | null };
  return j.events ?? [];
}

async function fetchPast(leagueId: number): Promise<SDBEvent[]> {
  const r = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${leagueId}`,
  );
  if (!r.ok) return [];
  const j = (await r.json()) as { events: SDBEvent[] | null };
  return j.events ?? [];
}

function statusFromSdb(s: string | null): "scheduled" | "live" | "finished" | "postponed" | "cancelled" {
  const v = (s ?? "").toLowerCase();
  if (v.includes("match finished") || v === "ft") return "finished";
  if (v.includes("postponed")) return "postponed";
  if (v.includes("cancelled") || v.includes("canceled")) return "cancelled";
  if (v.includes("live") || v === "1h" || v === "2h" || v === "ht") return "live";
  return "scheduled";
}

function kickoffIso(e: SDBEvent): string | null {
  if (e.strTimestamp) {
    const d = new Date(e.strTimestamp);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (e.dateEvent) {
    const t = e.strTime ?? "00:00:00";
    const d = new Date(`${e.dateEvent}T${t}Z`);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

async function main() {
  loadDotEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const restrictSlug = process.argv[2];

  // Leagues with a SDB id
  let q = sb
    .from("leagues")
    .select("id, slug, name_ar, external_id_sdb")
    .not("external_id_sdb", "is", null);
  if (restrictSlug) q = q.eq("slug", restrictSlug);
  const { data: leagues, error } = await q;
  if (error) {
    console.error("leagues fetch error:", error.message);
    process.exit(1);
  }

  // Build a name → id map across all teams once.
  const { data: teams } = await sb.from("teams").select("id, name_en, name_ar");
  const teamLookup = new Map<string, number>();
  for (const t of (teams ?? []) as { id: number; name_en: string | null; name_ar: string }[]) {
    if (t.name_en) teamLookup.set(t.name_en.toLowerCase(), t.id);
    teamLookup.set(t.name_ar.toLowerCase(), t.id);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const lg of (leagues ?? []) as Array<{ id: number; slug: string; name_ar: string; external_id_sdb: number }>) {
    console.log(`→ ${lg.name_ar} (${lg.slug})`);
    const [next, past] = await Promise.all([
      fetchNext(lg.external_id_sdb),
      fetchPast(lg.external_id_sdb),
    ]);
    const events = [...next, ...past];
    for (const e of events) {
      const ko = kickoffIso(e);
      const home = teamLookup.get(e.strHomeTeam?.toLowerCase() ?? "");
      const away = teamLookup.get(e.strAwayTeam?.toLowerCase() ?? "");
      if (!ko || !home || !away) {
        skipped++;
        continue;
      }
      const status = statusFromSdb(e.strStatus);
      const home_score =
        e.intHomeScore === null || e.intHomeScore === "" ? null : Number(e.intHomeScore);
      const away_score =
        e.intAwayScore === null || e.intAwayScore === "" ? null : Number(e.intAwayScore);
      const round_label = e.intRound ? `الجولة ${e.intRound}` : null;

      const row = {
        external_id: `sdb:${e.idEvent}`,
        league_id: lg.id,
        home_team_id: home,
        away_team_id: away,
        kickoff_at: ko,
        status,
        home_score,
        away_score,
        round_label,
        venue: e.strVenue,
      };

      const { error: upErr, count } = await sb
        .from("matches")
        .upsert(row, { onConflict: "external_id", count: "exact" });
      if (upErr) {
        console.log(`  err ${e.strEvent}: ${upErr.message}`);
        skipped++;
      } else {
        if ((count ?? 0) === 1) inserted++;
        else updated++;
      }
    }
    // Polite throttle between leagues
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nDone. Inserted/updated ~${inserted + updated}, skipped ${skipped}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
