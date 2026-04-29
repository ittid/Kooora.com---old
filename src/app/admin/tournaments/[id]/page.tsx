import { notFound } from "next/navigation";
import TournamentForm from "../TournamentForm";
import { updateTournamentAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditTournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!tournament) notFound();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل: {tournament.name_ar}</h1>
      <TournamentForm
        action={updateTournamentAction}
        tournament={tournament}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
