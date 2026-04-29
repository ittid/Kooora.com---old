import { notFound } from "next/navigation";
import PostForm from "../PostForm";
import { updatePostAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const [
    { data: post },
    { data: leagues },
    { data: teams },
    { data: tags },
    { data: postTagLinks },
  ] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("leagues").select("id, name_ar").order("sort_order"),
    supabase.from("teams").select("id, name_ar").order("sort_order"),
    supabase
      .from("tags")
      .select("id, slug, label, kind")
      .eq("kind", "topic")
      .order("label"),
    supabase.from("post_tags").select("tag_id").eq("post_id", id),
  ]);

  if (!post) notFound();

  const selectedTagIds = ((postTagLinks ?? []) as { tag_id: number }[]).map(
    (l) => l.tag_id,
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل: {post.title}</h1>
      <PostForm
        action={updatePostAction}
        post={post}
        leagues={leagues ?? []}
        teams={teams ?? []}
        tags={tags ?? []}
        selectedTagIds={selectedTagIds}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
