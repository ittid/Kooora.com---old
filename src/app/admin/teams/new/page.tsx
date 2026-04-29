import TeamForm from "../TeamForm";
import { createTeamAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getOptions() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { countries: [], leagues: [] };
  try {
    const supabase = await createClient();
    const [{ data: countries }, { data: leagues }] = await Promise.all([
      supabase.from("countries").select("id, code, name_ar").order("name_ar"),
      supabase.from("leagues").select("id, name_ar").order("sort_order"),
    ]);
    return { countries: countries ?? [], leagues: leagues ?? [] };
  } catch {
    return { countries: [], leagues: [] };
  }
}

export default async function NewTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { countries, leagues } = await getOptions();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">فريق جديد</h1>
      <TeamForm
        action={createTeamAction}
        countries={countries}
        leagues={leagues}
        submitLabel="حفظ"
        error={error}
      />
    </div>
  );
}
