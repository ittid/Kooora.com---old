import LeagueForm from "../LeagueForm";
import { createLeagueAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCountries() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("countries")
      .select("id, code, name_ar")
      .order("name_ar");
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function NewLeaguePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const countries = await getCountries();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">مسابقة جديدة</h1>
      <LeagueForm
        action={createLeagueAction}
        countries={countries}
        submitLabel="حفظ"
        error={error}
      />
    </div>
  );
}
