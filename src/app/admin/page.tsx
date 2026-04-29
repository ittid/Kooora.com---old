import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCounts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const [posts, teams, matches] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }),
    ]);
    return {
      posts: posts.count ?? 0,
      teams: teams.count ?? 0,
      matches: matches.count ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function AdminHome() {
  const counts = await getCounts();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">لوحة التحكم</h1>
      {!counts ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm">
          لم يتم إعداد Supabase بعد. انسخ <code>.env.local.example</code> إلى{" "}
          <code>.env.local</code> وعبئ المفاتيح، ثم نفّذ ملف الهجرة في{" "}
          <code>supabase/migrations/0001_initial_schema.sql</code>.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <Stat label="أخبار ومقالات" value={counts.posts} />
          <Stat label="فرق" value={counts.teams} />
          <Stat label="مباريات" value={counts.matches} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-kooora-border/60 p-4">
      <div className="text-sm text-kooora-dark/70">{label}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
    </div>
  );
}
