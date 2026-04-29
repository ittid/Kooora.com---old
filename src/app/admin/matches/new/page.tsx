import MatchForm from "../MatchForm";
import { createMatchAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getOptions() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { leagues: [], teams: [] };
  try {
    const supabase = await createClient();
    const [{ data: leagues }, { data: teams }] = await Promise.all([
      supabase.from("leagues").select("id, name_ar").order("sort_order"),
      supabase.from("teams").select("id, name_ar").order("name_ar"),
    ]);
    return { leagues: leagues ?? [], teams: teams ?? [] };
  } catch {
    return { leagues: [], teams: [] };
  }
}

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { leagues, teams } = await getOptions();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">مباراة جديدة</h1>
      <MatchForm
        action={createMatchAction}
        leagues={leagues}
        teams={teams}
        submitLabel="حفظ"
        error={error}
      />
    </div>
  );
}
