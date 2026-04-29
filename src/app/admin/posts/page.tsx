import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePostAction } from "./actions";

export const dynamic = "force-dynamic";

async function getPosts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, kind, is_published, published_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    return data ?? [];
  } catch {
    return null;
  }
}

export default async function PostsAdminPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">الأخبار والمقالات</h1>
        <div className="flex-1" />
        <Link
          href="/admin/posts/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + خبر جديد
        </Link>
      </div>

      {posts === null && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm">
          لم يتم إعداد Supabase بعد.
        </div>
      )}

      {posts && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2">العنوان</th>
                <th className="text-start px-3 py-2 w-24">النوع</th>
                <th className="text-start px-3 py-2 w-24">الحالة</th>
                <th className="text-start px-3 py-2 w-32">تاريخ</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد منشورات بعد.
                  </td>
                </tr>
              )}
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    <Link href={`/admin/posts/${p.id}`} className="font-bold hover:text-kooora-goldDark">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{p.kind}</td>
                  <td className="px-3 py-2">
                    {p.is_published ? (
                      <span className="text-green-700">منشور</span>
                    ) : (
                      <span className="text-gray-500">مسودة</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-kooora-dark/70">
                    {new Date(p.published_at ?? p.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-3 py-2 text-end">
                    <form action={deletePostAction} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-red-700 hover:underline text-xs">
                        حذف
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
