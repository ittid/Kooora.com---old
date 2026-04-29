import { notFound } from "next/navigation";
import PlayerForm from "../PlayerForm";
import { updatePlayerAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditPlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const [{ data: player }, { data: teams }, { data: countries }] = await Promise.all([
    supabase.from("players").select("*").eq("id", id).maybeSingle(),
    supabase.from("teams").select("id, name_ar").order("name_ar"),
    supabase.from("countries").select("id, code, name_ar").order("name_ar"),
  ]);
  if (!player) notFound();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تعديل: {player.name_ar}</h1>
      <PlayerForm
        action={updatePlayerAction}
        player={player}
        teams={teams ?? []}
        countries={countries ?? []}
        submitLabel="تحديث"
        error={error}
      />
    </div>
  );
}
