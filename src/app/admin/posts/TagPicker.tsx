"use client";

type Tag = { id: number; slug: string; label: string };

type Props = {
  allTags: Tag[];
  selectedIds: number[];
};

// Renders hidden inputs `tag_ids[]=N` for each selected tag, plus visible chips
// that toggle. The post action reads `formData.getAll("tag_ids[]")`.
export default function TagPicker({ allTags, selectedIds }: Props) {
  return (
    <div>
      <label className="block mb-1 font-bold">الوسوم</label>
      {allTags.length === 0 ? (
        <p className="text-[11px] text-kooora-muted">
          لا توجد وسوم. أنشئ الوسوم من <code>/admin/tags</code> أولاً.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((t) => (
            <TagChip
              key={t.id}
              tag={t}
              defaultChecked={selectedIds.includes(t.id)}
            />
          ))}
        </div>
      )}
      <p className="text-[11px] text-kooora-muted mt-1">
        الوسوم التلقائية لكل فريق/مسابقة تُضاف من تلقاء نفسها.
      </p>
    </div>
  );
}

function TagChip({ tag, defaultChecked }: { tag: Tag; defaultChecked: boolean }) {
  return (
    <label className="inline-flex items-center gap-1 cursor-pointer">
      <input
        type="checkbox"
        name="tag_ids[]"
        value={tag.id}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="px-2 py-0.5 text-[12px] border border-kooora-border/60 rounded peer-checked:bg-kooora-gold peer-checked:border-kooora-gold peer-checked:text-kooora-dark peer-checked:font-bold">
        {tag.label}
      </span>
    </label>
  );
}
