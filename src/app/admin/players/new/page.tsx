import PlayerForm from "../PlayerForm";
import { createPlayerAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getOptions() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { teams: [], countries: [] };
  try {
    const supabase = await createClient();
    const [{ data: teams }, { data: countries }] = await Promise.all([
      supabase.from("teams").select("id, name_ar").order("name_ar"),
      supabase.from("countries").select("id, code, name_ar").order("name_ar"),
    ]);
    return { teams: teams ?? [], countries: countries ?? [] };
  } catch {
    return { teams: [], countries: [] };
  }
}

export default async function NewPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { teams, countries } = await getOptions();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">لاعب جديد</h1>
      <PlayerForm
        action={createPlayerAction}
        teams={teams}
        countries={countries}
        submitLabel="حفظ"
        error={error}
      />
    </div>
  );
}
