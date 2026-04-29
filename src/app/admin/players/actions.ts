"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { searchPlayers, pickBestPlayer } from "@/lib/thesportsdb";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `player-${Date.now()}`;
}

function fieldsFromForm(formData: FormData) {
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim() || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name_ar);
  const team_id_raw = String(formData.get("team_id") ?? "");
  const team_id = team_id_raw ? Number(team_id_raw) : null;
  const country_id_raw = String(formData.get("country_id") ?? "");
  const country_id = country_id_raw ? Number(country_id_raw) : null;
  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;
  const position = String(formData.get("position") ?? "").trim() || null;
  const birth_date_raw = String(formData.get("birth_date") ?? "").trim();
  const birth_date = birth_date_raw || null;
  return { name_ar, name_en, slug, team_id, country_id, photo_url, position, birth_date };
}

export async function createPlayerAction(formData: FormData) {
  const fields = fieldsFromForm(formData);
  if (!fields.name_ar) redirect("/admin/players/new?error=الاسم مطلوب");
  const supabase = await createClient();
  const { error } = await supabase.from("players").insert(fields);
  if (error) redirect(`/admin/players/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/players");
  revalidatePath("/players");
  redirect("/admin/players");
}

export async function updatePlayerAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const fields = fieldsFromForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("players").update(fields).eq("id", id);
  if (error) redirect(`/admin/players/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/players");
  revalidatePath("/players");
  revalidatePath(`/players/${fields.slug}`);
  redirect("/admin/players");
}

export async function deletePlayerAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);
  revalidatePath("/admin/players");
  revalidatePath("/players");
  redirect("/admin/players");
}

// Look up a player photo on TheSportsDB. Used by the "fetch photo" button on
// the admin player form. Returns the chosen photo URL plus a few candidates
// so the admin can pick a different match if the first one is wrong.
export async function fetchSdbPhotoAction(input: {
  name: string;
  teamName?: string;
}): Promise<{
  url?: string;
  candidates: { name: string; team: string | null; photo: string }[];
  error?: string;
}> {
  const name = input.name.trim();
  if (!name) return { candidates: [], error: "أدخل اسم اللاعب أولاً" };
  const all = await searchPlayers(name);
  const soccer = all.filter((c) => (c.strSport ?? "").toLowerCase() === "soccer");
  const candidates = soccer
    .map((p) => ({
      name: p.strPlayer,
      team: p.strTeam,
      photo: p.strCutout ?? p.strThumb ?? "",
    }))
    .filter((c) => c.photo);

  const best = pickBestPlayer(soccer, input.teamName ?? null);
  const url = best?.strCutout ?? best?.strThumb ?? undefined;
  if (!url && candidates.length === 0) {
    return { candidates: [], error: "لم يتم العثور على لاعب مطابق" };
  }
  return { url, candidates };
}
