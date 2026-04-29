import TournamentForm from "../TournamentForm";
import { createTournamentAction } from "../actions";

export default async function NewTournamentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">بطولة جديدة</h1>
      <TournamentForm action={createTournamentAction} submitLabel="حفظ" error={error} />
    </div>
  );
}
