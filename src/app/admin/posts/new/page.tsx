import PostForm from "../PostForm";
import { createPostAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getOptions() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { leagues: [], teams: [], tags: [] };
  }
  try {
    const supabase = await createClient();
    const [{ data: leagues }, { data: teams }, { data: tags }] = await Promise.all([
      supabase.from("leagues").select("id, name_ar").order("sort_order"),
      supabase.from("teams").select("id, name_ar").order("sort_order"),
      supabase
        .from("tags")
        .select("id, slug, label, kind")
        .eq("kind", "topic")
        .order("label"),
    ]);
    return { leagues: leagues ?? [], teams: teams ?? [], tags: tags ?? [] };
  } catch {
    return { leagues: [], teams: [], tags: [] };
  }
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { leagues, teams, tags } = await getOptions();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">خبر / مقال جديد</h1>
      <PostForm
        action={createPostAction}
        leagues={leagues}
        teams={teams}
        tags={tags}
        selectedTagIds={[]}
        submitLabel="حفظ"
        error={error}
      />
    </div>
  );
}
