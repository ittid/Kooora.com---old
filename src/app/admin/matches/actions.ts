"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function fieldsFromForm(formData: FormData) {
  const league_id_raw = String(formData.get("league_id") ?? "");
  const league_id = league_id_raw ? Number(league_id_raw) : null;

  const home_team_id = Number(formData.get("home_team_id"));
  const away_team_id = Number(formData.get("away_team_id"));
  const kickoff_at = String(formData.get("kickoff_at") ?? "");

  const status = String(formData.get("status") ?? "scheduled");

  const home_score_raw = String(formData.get("home_score") ?? "");
  const away_score_raw = String(formData.get("away_score") ?? "");
  const home_score = home_score_raw === "" ? null : Number(home_score_raw);
  const away_score = away_score_raw === "" ? null : Number(away_score_raw);

  const round_label = String(formData.get("round_label") ?? "").trim() || null;
  const venue = String(formData.get("venue") ?? "").trim() || null;

  return {
    league_id,
    home_team_id,
    away_team_id,
    kickoff_at: new Date(kickoff_at).toISOString(),
    status,
    home_score,
    away_score,
    round_label,
    venue,
  };
}

export async function createMatchAction(formData: FormData) {
  const fields = fieldsFromForm(formData);
  if (!fields.home_team_id || !fields.away_team_id) {
    redirect("/admin/matches/new?error=الفريقان مطلوبان");
  }
  if (fields.home_team_id === fields.away_team_id) {
    redirect("/admin/matches/new?error=لا يمكن أن يكون الفريق ضد نفسه");
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .insert(fields)
    .select("id")
    .single();
  if (error) redirect(`/admin/matches/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/matches");
  redirect(`/admin/matches/${data!.id}`);
}

export async function updateMatchAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const fields = fieldsFromForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("matches").update(fields).eq("id", id);
  if (error) redirect(`/admin/matches/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/matches");
  revalidatePath(`/admin/matches/${id}`);
  revalidatePath(`/matches/${id}`);
  revalidatePath("/");
  revalidatePath("/matches");
  redirect("/admin/matches");
}

export async function deleteMatchAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", id);
  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/matches");
  redirect("/admin/matches");
}
