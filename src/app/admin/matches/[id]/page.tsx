import { notFound } from "next/navigation";
import MatchForm from "../MatchForm";
import { updateMatchAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditMatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const [{ data: match }, { data: leagues }, { data: teams }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", id).maybeSingle(),
    supabase.from("leagues").select("id, name_ar").order("sort_order"),
    supabase.from("teams").select("id, name_ar").order("name_ar"),
  ]);
  if (!match) notFound();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل المباراة #{id}</h1>
      <MatchForm
        action={updateMatchAction}
        match={match}
        leagues={leagues ?? []}
        teams={teams ?? []}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
