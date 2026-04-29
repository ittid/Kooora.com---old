"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function togglePinAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const is_pinned = formData.get("is_pinned") === "true";
  const supabase = await createClient();
  await supabase.from("threads").update({ is_pinned: !is_pinned }).eq("id", id);
  revalidatePath("/admin/threads");
  revalidatePath("/forums");
  redirect("/admin/threads");
}

export async function toggleLockAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const is_locked = formData.get("is_locked") === "true";
  const supabase = await createClient();
  await supabase.from("threads").update({ is_locked: !is_locked }).eq("id", id);
  revalidatePath("/admin/threads");
  revalidatePath("/forums");
  redirect("/admin/threads");
}
