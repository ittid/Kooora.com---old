import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const KEYS = [
  { key: "header_banner_url", label: "صورة هيدر الصفحة الرئيسية" },
  { key: "sidebar_ad_url", label: "صورة إعلان الشريط الجانبي" },
  { key: "featured_video_url", label: "رابط فيديو الواجهة" },
];

async function getSettings() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    (data ?? []).forEach((row) => {
      map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
    });
    return map;
  } catch {
    return null;
  }
}

async function saveSettingsAction(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const rows = KEYS.map((k) => ({
    key: k.key,
    value: String(formData.get(k.key) ?? ""),
    updated_at: new Date().toISOString(),
  }));
  await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">إعدادات الموقع</h1>

      {settings === null ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm">
          لم يتم إعداد Supabase بعد.
        </div>
      ) : (
        <form action={saveSettingsAction} className="bg-white border border-kooora-border/60 p-5 max-w-2xl space-y-3 text-sm">
          {saved && (
            <p className="text-green-700 bg-green-50 border border-green-200 px-2 py-1">
              تم الحفظ
            </p>
          )}
          {KEYS.map((k) => (
            <div key={k.key}>
              <label className="block mb-1 font-bold">{k.label}</label>
              <input
                name={k.key}
                defaultValue={settings[k.key] ?? ""}
                className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
              />
            </div>
          ))}
          <button className="h-9 px-5 bg-kooora-gold text-kooora-dark font-bold">
            حفظ التغييرات
          </button>
        </form>
      )}
    </div>
  );
}
