type Option = { id: number; name_ar: string };

type MatchFields = {
  id?: number;
  league_id?: number | null;
  home_team_id?: number | null;
  away_team_id?: number | null;
  kickoff_at?: string;
  status?: string;
  home_score?: number | null;
  away_score?: number | null;
  round_label?: string | null;
  venue?: string | null;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  match?: MatchFields;
  leagues: Option[];
  teams: Option[];
  submitLabel: string;
  error?: string;
};

function toLocalInput(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MatchForm({
  action,
  match,
  leagues,
  teams,
  submitLabel,
  error,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-2xl"
    >
      {match?.id && <input type="hidden" name="id" value={match.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">المسابقة</label>
          <select
            name="league_id"
            defaultValue={match?.league_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— لا شيء —</option>
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>{l.name_ar}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">موعد البداية</label>
          <input
            name="kickoff_at"
            type="datetime-local"
            required
            defaultValue={toLocalInput(match?.kickoff_at)}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الفريق المضيف</label>
          <select
            name="home_team_id"
            required
            defaultValue={match?.home_team_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— اختر —</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name_ar}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">الفريق الضيف</label>
          <select
            name="away_team_id"
            required
            defaultValue={match?.away_team_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— اختر —</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name_ar}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-bold">الحالة</label>
          <select
            name="status"
            defaultValue={match?.status ?? "scheduled"}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="scheduled">لم تبدأ</option>
            <option value="live">مباشر</option>
            <option value="finished">انتهت</option>
            <option value="postponed">مؤجلة</option>
            <option value="cancelled">ملغية</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">هدف المضيف</label>
          <input
            name="home_score"
            type="number"
            min={0}
            defaultValue={match?.home_score ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">هدف الضيف</label>
          <input
            name="away_score"
            type="number"
            min={0}
            defaultValue={match?.away_score ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الجولة</label>
          <input
            name="round_label"
            defaultValue={match?.round_label ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">الملعب</label>
          <input
            name="venue"
            defaultValue={match?.venue ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="h-9 px-5 bg-kooora-gold text-kooora-dark font-bold hover:brightness-95"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
