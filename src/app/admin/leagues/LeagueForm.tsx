type Country = { id: number; code: string; name_ar: string };

type LeagueFields = {
  id?: number;
  slug?: string;
  name_ar?: string;
  name_en?: string | null;
  country_id?: number | null;
  logo_url?: string | null;
  is_top?: boolean;
  sort_order?: number;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  league?: LeagueFields;
  countries: Country[];
  submitLabel: string;
  error?: string;
};

export default function LeagueForm({
  action,
  league,
  countries,
  submitLabel,
  error,
}: Props) {
  return (
    <form action={action} className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-2xl">
      {league?.id && <input type="hidden" name="id" value={league.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الاسم بالعربية</label>
          <input
            name="name_ar"
            required
            defaultValue={league?.name_ar ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">English name</label>
          <input
            name="name_en"
            defaultValue={league?.name_en ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">slug</label>
          <input
            name="slug"
            defaultValue={league?.slug ?? ""}
            placeholder="laliga"
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">البلد</label>
          <select
            name="country_id"
            defaultValue={league?.country_id ?? ""}
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
        <label className="block mb-1 font-bold">رابط الشعار</label>
        <input
          name="logo_url"
          defaultValue={league?.logo_url ?? ""}
          placeholder="https://..."
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        <label className="flex items-center gap-2 h-9">
          <input
            type="checkbox"
            name="is_top"
            defaultChecked={league?.is_top ?? false}
          />
          <span>ضمن أهم المسابقات</span>
        </label>
        <div>
          <label className="block mb-1 font-bold">ترتيب</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={league?.sort_order ?? 0}
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
