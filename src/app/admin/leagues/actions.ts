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
    .slice(0, 80) || `league-${Date.now()}`;
}

function leagueFieldsFromForm(formData: FormData) {
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim() || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name_ar);
  const country_id_raw = String(formData.get("country_id") ?? "");
  const country_id = country_id_raw ? Number(country_id_raw) : null;
  const logo_url = String(formData.get("logo_url") ?? "").trim() || null;
  const is_top = formData.get("is_top") === "on";
  const sort_order = Number(formData.get("sort_order") ?? 0) || 0;
  return { name_ar, name_en, slug, country_id, logo_url, is_top, sort_order };
}

export async function createLeagueAction(formData: FormData) {
  const fields = leagueFieldsFromForm(formData);
  if (!fields.name_ar) redirect("/admin/leagues/new?error=الاسم مطلوب");
  const supabase = await createClient();
  const { error } = await supabase.from("leagues").insert(fields);
  if (error) redirect(`/admin/leagues/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/leagues");
  revalidatePath("/competitions");
  redirect("/admin/leagues");
}

export async function updateLeagueAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const fields = leagueFieldsFromForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("leagues").update(fields).eq("id", id);
  if (error) redirect(`/admin/leagues/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/leagues");
  revalidatePath("/competitions");
  revalidatePath(`/competitions/${fields.slug}`);
  redirect("/admin/leagues");
}

export async function deleteLeagueAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("leagues").delete().eq("id", id);
  revalidatePath("/admin/leagues");
  revalidatePath("/competitions");
  redirect("/admin/leagues");
}
