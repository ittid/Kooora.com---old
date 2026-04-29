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
    .slice(0, 80) || `post-${Date.now()}`;
}

function postFieldsFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "");
  const body = String(formData.get("body") ?? "");
  const cover_url = String(formData.get("cover_url") ?? "") || null;
  const video_url = String(formData.get("video_url") ?? "") || null;
  const kind = String(formData.get("kind") ?? "news");
  const is_published = formData.get("is_published") === "on";
  const league_id_raw = String(formData.get("league_id") ?? "");
  const league_id = league_id_raw ? Number(league_id_raw) : null;
  const team_id_raw = String(formData.get("team_id") ?? "");
  const team_id = team_id_raw ? Number(team_id_raw) : null;
  const category = String(formData.get("category") ?? "").trim() || null;
  return { title, excerpt, body, cover_url, video_url, kind, is_published, league_id, team_id, category };
}

function tagIdsFromForm(formData: FormData): number[] {
  return formData
    .getAll("tag_ids[]")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function syncEditorialTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  tagIds: number[],
) {
  // Replace only the editorial ('topic') tags. The team/league relation tags
  // are managed by a DB trigger and should be left alone.
  const { data: topicTags } = await supabase.from("tags").select("id").eq("kind", "topic");
  const topicSet = new Set((topicTags ?? []).map((t) => t.id as number));
  const desired = tagIds.filter((id) => topicSet.has(id));

  // Delete any current topic-tag links for this post.
  if (topicSet.size > 0) {
    await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", postId)
      .in("tag_id", [...topicSet]);
  }
  if (desired.length > 0) {
    await supabase
      .from("post_tags")
      .insert(desired.map((tag_id) => ({ post_id: postId, tag_id })));
  }
}

export async function createPostAction(formData: FormData) {
  const fields = postFieldsFromForm(formData);
  if (!fields.title) redirect("/admin/posts/new?error=العنوان مطلوب");
  const tagIds = tagIdsFromForm(formData);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...fields,
      slug: slugify(fields.title),
      published_at: fields.is_published ? new Date().toISOString() : null,
      author_id: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) redirect(`/admin/posts/new?error=${encodeURIComponent(error.message)}`);
  if (tagIds.length > 0) await syncEditorialTags(supabase, data!.id, tagIds);
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  revalidatePath("/");
  redirect(`/admin/posts/${data!.id}`);
}

export async function updatePostAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fields = postFieldsFromForm(formData);
  const tagIds = tagIdsFromForm(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      ...fields,
      published_at: fields.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) redirect(`/admin/posts/${id}?error=${encodeURIComponent(error.message)}`);
  await syncEditorialTags(supabase, id, tagIds);
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/posts");
}

// =====================================================================
// Cover image upload to Supabase Storage `post-covers` bucket.
// Resizes to max 1200x800 and converts to WebP via sharp before uploading.
// Returns the public URL.
// =====================================================================
export async function uploadCoverAction(formData: FormData): Promise<{
  url?: string;
  error?: string;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: "Supabase غير مفعل" };
  }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "اختر ملفاً" };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "الحد الأقصى 8 ميجا" };
  }

  // Lazy import to keep sharp out of the edge runtime.
  const sharp = (await import("sharp")).default;

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let processed: Buffer;
  try {
    processed = await sharp(inputBuffer)
      .rotate() // honor EXIF orientation
      .resize({ width: 1200, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch (e) {
    return {
      error: e instanceof Error ? `معالجة الصورة فشلت: ${e.message}` : "معالجة الصورة فشلت",
    };
  }

  const supabase = await createClient();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await supabase.storage
    .from("post-covers")
    .upload(path, processed, {
      contentType: "image/webp",
      cacheControl: "31536000",
    });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("post-covers").getPublicUrl(path);
  return { url: data.publicUrl };
}
