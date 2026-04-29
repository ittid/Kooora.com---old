import { notFound } from "next/navigation";
import LeagueForm from "../LeagueForm";
import { updateLeagueAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditLeaguePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const [{ data: league }, { data: countries }] = await Promise.all([
    supabase.from("leagues").select("*").eq("id", id).maybeSingle(),
    supabase.from("countries").select("id, code, name_ar").order("name_ar"),
  ]);
  if (!league) notFound();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل: {league.name_ar}</h1>
      <LeagueForm
        action={updateLeagueAction}
        league={league}
        countries={countries ?? []}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
