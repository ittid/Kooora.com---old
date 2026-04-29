// Tiny client for TheSportsDB free public API. No key required.
// https://www.thesportsdb.com/api.php

export type SDBPlayer = {
  idPlayer: string;
  strPlayer: string;
  strTeam: string | null;
  strSport: string | null;
  strNationality: string | null;
  strThumb: string | null;
  strCutout: string | null;
  dateBorn: string | null;
};

export async function searchPlayers(name: string): Promise<SDBPlayer[]> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { player: SDBPlayer[] | null };
    return json.player ?? [];
  } catch {
    return [];
  }
}

export function pickBestPlayer(
  candidates: SDBPlayer[],
  expectedTeam?: string | null,
): SDBPlayer | null {
  const soccer = candidates.filter(
    (c) => (c.strSport ?? "").toLowerCase() === "soccer",
  );
  if (soccer.length === 0) return null;
  if (expectedTeam) {
    const hit = soccer.find(
      (c) => (c.strTeam ?? "").toLowerCase() === expectedTeam.toLowerCase(),
    );
    if (hit) return hit;
  }
  return soccer.find((c) => c.strThumb || c.strCutout) ?? soccer[0];
}

export type SDBTeam = {
  idTeam: string;
  strTeam: string;
  strSport: string | null;
  strBadge: string | null;
  strLogo: string | null;
  strStadium: string | null;
};

export async function searchTeams(name: string): Promise<SDBTeam[]> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { teams: SDBTeam[] | null };
    return json.teams ?? [];
  } catch {
    return [];
  }
}
