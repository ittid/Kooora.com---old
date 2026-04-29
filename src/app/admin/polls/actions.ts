"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPollAction(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const optionsRaw = String(formData.get("options") ?? "");
  const options = optionsRaw.split("\n").map((s) => s.trim()).filter(Boolean);
  const is_active = formData.get("is_active") === "on";

  if (!question || options.length < 2) {
    redirect("/admin/polls?error=السؤال وخياران على الأقل مطلوبان");
  }

  const supabase = await createClient();
  const { data: poll, error } = await supabase
    .from("polls")
    .insert({ question, is_active })
    .select("id")
    .single();

  if (error) redirect(`/admin/polls?error=${encodeURIComponent(error.message)}`);

  await supabase.from("poll_options").insert(
    options.map((label, i) => ({ poll_id: poll!.id, label, sort_order: i })),
  );

  revalidatePath("/admin/polls");
  redirect("/admin/polls");
}

export async function deletePollAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("polls").delete().eq("id", id);
  revalidatePath("/admin/polls");
  redirect("/admin/polls");
}

export async function togglePollAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const is_active = formData.get("is_active") === "true";
  const supabase = await createClient();
  await supabase.from("polls").update({ is_active: !is_active }).eq("id", id);
  revalidatePath("/admin/polls");
  redirect("/admin/polls");
}
