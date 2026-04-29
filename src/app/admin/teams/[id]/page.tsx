import { notFound } from "next/navigation";
import TeamForm from "../TeamForm";
import { updateTeamAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditTeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: team }, { data: countries }, { data: leagues }] = await Promise.all([
    supabase.from("teams").select("*").eq("id", id).maybeSingle(),
    supabase.from("countries").select("id, code, name_ar").order("name_ar"),
    supabase.from("leagues").select("id, name_ar").order("sort_order"),
  ]);

  if (!team) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل: {team.name_ar}</h1>
      <TeamForm
        action={updateTeamAction}
        team={team}
        countries={countries ?? []}
        leagues={leagues ?? []}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
