"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `team-${Date.now()}`;
}

function teamFieldsFromForm(formData: FormData) {
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim() || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name_ar);
  const country_id_raw = String(formData.get("country_id") ?? "");
  const country_id = country_id_raw ? Number(country_id_raw) : null;
  const league_id_raw = String(formData.get("league_id") ?? "");
  const league_id = league_id_raw ? Number(league_id_raw) : null;
  const external_id_raw = String(formData.get("external_id") ?? "");
  const external_id = external_id_raw ? Number(external_id_raw) : null;
  const logo_url_input = String(formData.get("logo_url") ?? "").trim();
  const logo_url =
    logo_url_input ||
    (external_id
      ? `https://media.api-sports.io/football/teams/${external_id}.png`
      : null);
  const is_top = formData.get("is_top") === "on";
  const sort_order = Number(formData.get("sort_order") ?? 0) || 0;
  return { name_ar, name_en, slug, country_id, league_id, external_id, logo_url, is_top, sort_order };
}

export async function createTeamAction(formData: FormData) {
  const fields = teamFieldsFromForm(formData);
  if (!fields.name_ar) redirect("/admin/teams/new?error=الاسم مطلوب");

  const supabase = await createClient();
  const { error } = await supabase.from("teams").insert(fields);
  if (error) redirect(`/admin/teams/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  revalidatePath("/competitions", "layout");
  redirect("/admin/teams");
}

export async function updateTeamAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const fields = teamFieldsFromForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("teams").update(fields).eq("id", id);
  if (error) redirect(`/admin/teams/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  revalidatePath(`/teams/${fields.slug}`);
  revalidatePath("/competitions", "layout");
  redirect("/admin/teams");
}

export async function deleteTeamAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("teams").delete().eq("id", id);
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
  revalidatePath("/competitions", "layout");
  redirect("/admin/teams");
}
