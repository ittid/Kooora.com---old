import { createClient } from "@/lib/supabase/server";
import { createPollAction, deletePollAction, togglePollAction } from "./actions";

export const dynamic = "force-dynamic";

type Option = { id: string; label: string; votes: number };
type Poll = {
  id: string;
  question: string;
  is_active: boolean;
  poll_options: Option[];
};

async function getPolls(): Promise<Poll[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("polls")
      .select("id, question, is_active, poll_options(id, label, votes)")
      .order("created_at", { ascending: false });
    return (data ?? []) as Poll[];
  } catch {
    return null;
  }
}

export default async function PollsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const polls = await getPolls();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">التصويتات (سونداج)</h1>

      <form action={createPollAction} className="bg-white border border-kooora-border/60 p-5 max-w-2xl space-y-3 text-sm">
        <h2 className="font-bold">تصويت جديد</h2>
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
        )}
        <div>
          <label className="block mb-1 font-bold">السؤال</label>
          <input
            name="question"
            required
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">الخيارات (سطر لكل خيار)</label>
          <textarea
            name="options"
            rows={4}
            required
            className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked />
          <span>نشط</span>
        </label>
        <button className="h-9 px-5 bg-kooora-gold text-kooora-dark font-bold">
          حفظ
        </button>
      </form>

      {polls === null && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm">
          لم يتم إعداد Supabase بعد.
        </div>
      )}

      {polls && polls.length > 0 && (
        <div className="space-y-3">
          {polls.map((p) => (
            <div key={p.id} className="bg-white border border-kooora-border/60 p-4">
              <div className="flex items-center mb-2">
                <h3 className="font-bold">{p.question}</h3>
                <div className="flex-1" />
                <span
                  className={`text-xs px-2 py-0.5 ${
                    p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.is_active ? "نشط" : "متوقف"}
                </span>
              </div>
              <ul className="text-sm space-y-1 mb-3">
                {p.poll_options.map((o) => (
                  <li key={o.id} className="flex">
                    <span>{o.label}</span>
                    <span className="flex-1" />
                    <span className="text-kooora-dark/70">{o.votes} صوت</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <form action={togglePollAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="is_active" value={String(p.is_active)} />
                  <button className="text-xs hover:underline">
                    {p.is_active ? "إيقاف" : "تشغيل"}
                  </button>
                </form>
                <form action={deletePollAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-xs text-red-700 hover:underline">حذف</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
