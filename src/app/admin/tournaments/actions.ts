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
    .slice(0, 80) || `tournament-${Date.now()}`;
}

function fieldsFromForm(formData: FormData) {
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim() || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name_ar);
  const logo_url = String(formData.get("logo_url") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";
  const sort_order = Number(formData.get("sort_order") ?? 0) || 0;
  const starts_at = String(formData.get("starts_at") ?? "").trim() || null;
  const ends_at = String(formData.get("ends_at") ?? "").trim() || null;
  return { name_ar, name_en, slug, logo_url, description, is_active, sort_order, starts_at, ends_at };
}

export async function createTournamentAction(formData: FormData) {
  const fields = fieldsFromForm(formData);
  if (!fields.name_ar) redirect("/admin/tournaments/new?error=الاسم مطلوب");
  const supabase = await createClient();
  const { error } = await supabase.from("tournaments").insert(fields);
  if (error) redirect(`/admin/tournaments/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  redirect("/admin/tournaments");
}

export async function updateTournamentAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const fields = fieldsFromForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("tournaments").update(fields).eq("id", id);
  if (error) redirect(`/admin/tournaments/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  revalidatePath(`/tournaments/${fields.slug}`);
  redirect("/admin/tournaments");
}

export async function deleteTournamentAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("tournaments").delete().eq("id", id);
  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
  redirect("/admin/tournaments");
}
