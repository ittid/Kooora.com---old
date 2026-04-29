import CoverUpload from "./CoverUpload";
import TagPicker from "./TagPicker";

type Tag = { id: number; slug: string; label: string };

type PostFields = {
  id?: string;
  title?: string;
  excerpt?: string | null;
  body?: string | null;
  cover_url?: string | null;
  video_url?: string | null;
  kind?: string;
  is_published?: boolean;
  league_id?: number | null;
  team_id?: number | null;
  category?: string | null;
};

type Option = { id: number; name_ar: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  post?: PostFields;
  leagues: Option[];
  teams: Option[];
  tags: Tag[];
  selectedTagIds: number[];
  submitLabel: string;
  error?: string;
};

export default function PostForm({
  action,
  post,
  leagues,
  teams,
  tags,
  selectedTagIds,
  submitLabel,
  error,
}: Props) {
  return (
    <form action={action} className="space-y-3 text-sm bg-white p-5 border border-kooora-border/60 max-w-3xl">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className="block mb-1 font-bold">العنوان</label>
        <input
          name="title"
          required
          defaultValue={post?.title ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">المقدمة</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold">المحتوى</label>
        <textarea
          name="body"
          rows={10}
          defaultValue={post?.body ?? ""}
          className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold font-mono text-[12px]"
        />
      </div>

      <CoverUpload defaultUrl={post?.cover_url ?? ""} />

      <div>
        <label className="block mb-1 font-bold">رابط فيديو (YouTube/mp4)</label>
        <input
          name="video_url"
          defaultValue={post?.video_url ?? ""}
          className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-bold">المسابقة</label>
          <select
            name="league_id"
            defaultValue={post?.league_id ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— لا شيء —</option>
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name_ar}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">الفريق</label>
          <select
            name="team_id"
            defaultValue={post?.team_id ?? ""}
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
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        <div>
          <label className="block mb-1 font-bold">النوع</label>
          <select
            name="kind"
            defaultValue={post?.kind ?? "news"}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="news">خبر</option>
            <option value="article">مقال</option>
            <option value="video">فيديو</option>
            <option value="interview">حوار</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">التصنيف</label>
          <select
            name="category"
            defaultValue={post?.category ?? ""}
            className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold bg-white"
          >
            <option value="">— لا شيء —</option>
            <option value="world">كرة عالمية</option>
            <option value="arab">كرة عربية</option>
            <option value="other-sports">رياضات أخرى</option>
            <option value="analysis">تحليلات</option>
          </select>
        </div>
        <label className="flex items-center gap-2 h-9">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published ?? false}
          />
          <span>منشور</span>
        </label>
      </div>

      <TagPicker allTags={tags} selectedIds={selectedTagIds} />

      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
      )}

      <div className="flex gap-2 pt-2">
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
