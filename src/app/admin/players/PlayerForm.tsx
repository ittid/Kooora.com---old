import PhotoPicker from "./PhotoPicker";

type Option = { id: number; name_ar: string };
type Country = { id: number; code: string; name_ar: string };

type PlayerFields = {
  id?: number;
  slug?: string;
  name_ar?: string;
  name_en?: string | null;
  team_id?: number | null;
  country_id?: number | null;
  photo_url?: string | null;
  position?: string | null;
  birth_date?: string | null;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  player?: PlayerFields;
  teams: Option[];
  countries: Country[];
  submitLabel: string;
  error?: string;
};

export default function PlayerForm({
  action,
  player,
  teams,
  countries,
  submitLabel,
  error,
}: Props) {
  return (
    <form action={action} className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-2xl">
      {player?.id && <input type="hidden" name="id" value={player.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الاسم بالعربية</label>
          <input
            name="name_ar"
            required
            defaultValue={player?.name_ar ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">English name</label>
          <input
            name="name_en"
            defaultValue={player?.name_en ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">slug</label>
          <input
            name="slug"
            defaultValue={player?.slug ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">المركز</label>
          <input
            name="position"
            defaultValue={player?.position ?? ""}
            placeholder="مهاجم / لاعب وسط ..."
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الفريق</label>
          <select
            name="team_id"
            defaultValue={player?.team_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— لا شيء —</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name_ar}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">الجنسية</label>
          <select
            name="country_id"
            defaultValue={player?.country_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— لا شيء —</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_ar}
              </option>
            ))}
          </select>
        </div>
      </div>

      <PhotoPicker
        defaultUrl={player?.photo_url ?? ""}
        defaultName={player?.name_en ?? player?.name_ar ?? ""}
      />

      <div>
        <label className="block mb-1 font-bold">تاريخ الميلاد</label>
        <input
          name="birth_date"
          type="date"
          defaultValue={player?.birth_date ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold max-w-xs"
        />
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
