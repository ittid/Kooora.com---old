type TournamentFields = {
  id?: number;
  slug?: string;
  name_ar?: string;
  name_en?: string | null;
  logo_url?: string | null;
  description?: string | null;
  is_active?: boolean;
  sort_order?: number;
  starts_at?: string | null;
  ends_at?: string | null;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  tournament?: TournamentFields;
  submitLabel: string;
  error?: string;
};

export default function TournamentForm({
  action,
  tournament,
  submitLabel,
  error,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-2xl"
    >
      {tournament?.id && <input type="hidden" name="id" value={tournament.id} />}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">الاسم بالعربية</label>
          <input
            name="name_ar"
            required
            defaultValue={tournament?.name_ar ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">English name</label>
          <input
            name="name_en"
            defaultValue={tournament?.name_en ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-bold">slug</label>
        <input
          name="slug"
          defaultValue={tournament?.slug ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">رابط الشعار</label>
        <input
          name="logo_url"
          defaultValue={tournament?.logo_url ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">الوصف</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={tournament?.description ?? ""}
          className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-bold">تاريخ البداية</label>
          <input
            name="starts_at"
            type="date"
            defaultValue={tournament?.starts_at ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">تاريخ النهاية</label>
          <input
            name="ends_at"
            type="date"
            defaultValue={tournament?.ends_at ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">ترتيب</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={tournament?.sort_order ?? 0}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={tournament?.is_active ?? true}
        />
        <span>نشطة</span>
      </label>

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
