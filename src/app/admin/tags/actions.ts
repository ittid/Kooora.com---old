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
    .slice(0, 60) || `tag-${Date.now()}`;
}

export async function createTagAction(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) redirect("/admin/tags?error=الاسم مطلوب");
  const slug = String(formData.get("slug") ?? "").trim() || slugify(label);
  const supabase = await createClient();
  const { error } = await supabase.from("tags").insert({ label, slug });
  if (error) redirect(`/admin/tags?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function deleteTagAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}
