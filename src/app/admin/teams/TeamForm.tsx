type Country = { id: number; code: string; name_ar: string };
type League = { id: number; name_ar: string };

type TeamFields = {
  id?: number;
  slug?: string;
  name_ar?: string;
  name_en?: string | null;
  country_id?: number | null;
  league_id?: number | null;
  logo_url?: string | null;
  external_id?: number | null;
  is_top?: boolean;
  sort_order?: number;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  team?: TeamFields;
  countries: Country[];
  leagues: League[];
  submitLabel: string;
  error?: string;
};

export default function TeamForm({ action, team, countries, leagues, submitLabel, error }: Props) {
  return (
    <form action={action} className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-2xl">
      {team?.id && <input type="hidden" name="id" value={team.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الاسم بالعربية</label>
          <input
            name="name_ar"
            required
            defaultValue={team?.name_ar ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">English name</label>
          <input
            name="name_en"
            defaultValue={team?.name_en ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">slug (المعرف)</label>
          <input
            name="slug"
            defaultValue={team?.slug ?? ""}
            placeholder="real-madrid"
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">البلد</label>
          <select
            name="country_id"
            defaultValue={team?.country_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— اختر —</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_ar}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-bold">المسابقة الأساسية</label>
        <select
          name="league_id"
          defaultValue={team?.league_id ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white max-w-md"
        >
          <option value="">— لا شيء —</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name_ar}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">رقم api-sports (اختياري)</label>
          <input
            name="external_id"
            type="number"
            defaultValue={team?.external_id ?? ""}
            placeholder="541"
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
          <p className="text-[11px] text-kooora-muted mt-1">
            إذا أدخلته يتم توليد رابط الشعار تلقائياً
          </p>
        </div>
        <div>
          <label className="block mb-1 font-bold">رابط الشعار (اختياري)</label>
          <input
            name="logo_url"
            defaultValue={team?.logo_url ?? ""}
            placeholder="https://..."
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        <label className="flex items-center gap-2 h-9">
          <input
            type="checkbox"
            name="is_top"
            defaultChecked={team?.is_top ?? false}
          />
          <span>ضمن أهم الأندية</span>
        </label>
        <div>
          <label className="block mb-1 font-bold">ترتيب</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={team?.sort_order ?? 0}
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
