"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createThreadAction(formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect("/forums?error=Supabase غير مفعل");
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/forums");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) redirect("/forums?error=العنوان والمحتوى مطلوبان");

  const { data, error } = await supabase
    .from("threads")
    .insert({ title, body, author_id: user.id })
    .select("id")
    .single();
  if (error) redirect(`/forums?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/forums");
  redirect(`/forums/${data!.id}`);
}

export async function createReplyAction(formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  const thread_id = String(formData.get("thread_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!thread_id || !body) redirect(`/forums/${thread_id}?error=محتوى الرد مطلوب`);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/forums/${thread_id}`);

  const { error } = await supabase
    .from("thread_replies")
    .insert({ thread_id, body, author_id: user.id });
  if (error) redirect(`/forums/${thread_id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/forums/${thread_id}`);
  revalidatePath("/forums");
  redirect(`/forums/${thread_id}`);
}

export async function deleteThreadAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("threads").delete().eq("id", id);
  revalidatePath("/forums");
  revalidatePath("/admin/threads");
  redirect("/admin/threads");
}
