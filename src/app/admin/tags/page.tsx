import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { createTagAction, deleteTagAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = { id: number; slug: string; label: string };

async function getTags(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tags").select("id, slug, label").order("label");
    return (data ?? []) as Row[];
  } catch {
    return null;
  }
}

export default async function TagsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const tags = await getTags();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">الوسوم</h1>

      <form
        action={createTagAction}
        className="bg-white border border-kooora-border/60 p-4 max-w-xl space-y-2 text-sm"
      >
        <div className="grid grid-cols-2 gap-2">
          <input
            name="label"
            placeholder="اسم الوسم"
            required
            className="h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
          <input
            name="slug"
            placeholder="slug (اختياري)"
            className="h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
        )}
        <button className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold">إضافة</button>
      </form>

      {tags === null && <SetupNotice />}
      {tags && (
        <div className="bg-white border border-kooora-border/60 max-w-xl">
          {tags.length === 0 ? (
            <p className="p-4 text-sm text-kooora-dark/70">لا توجد وسوم.</p>
          ) : (
            <ul className="divide-y divide-kooora-border/50 text-sm">
              {tags.map((t) => (
                <li key={t.id} className="flex items-center px-3 py-2">
                  <span className="font-bold">{t.label}</span>
                  <span className="text-kooora-muted text-xs mx-2">{t.slug}</span>
                  <div className="flex-1" />
                  <form action={deleteTagAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-red-700 hover:underline text-xs">حذف</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
