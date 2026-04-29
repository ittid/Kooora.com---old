import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/login/actions";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/posts", label: "الأخبار والمقالات" },
  { href: "/admin/polls", label: "التصويتات" },
  { href: "/admin/teams", label: "الفرق" },
  { href: "/admin/players", label: "اللاعبون" },
  { href: "/admin/leagues", label: "المسابقات" },
  { href: "/admin/matches", label: "المباريات" },
  { href: "/admin/tournaments", label: "البطولات" },
  { href: "/admin/threads", label: "المنتدى" },
  { href: "/admin/tags", label: "الوسوم" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] p-8">
        <div className="bg-yellow-50 border border-yellow-200 p-6 max-w-2xl mx-auto text-sm">
          <h2 className="font-bold mb-2">يجب إعداد Supabase أولاً</h2>
          <p>
            انسخ <code>.env.local.example</code> إلى <code>.env.local</code>{" "}
            وعبئ <code>NEXT_PUBLIC_SUPABASE_URL</code> و
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>، ثم نفّذ الهجرة في{" "}
            <code>supabase/migrations/0001_initial_schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.is_admin === true;

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <header className="bg-kooora-dark text-white h-12 flex items-center px-4 gap-4">
        <Link href="/admin" className="font-black text-kooora-gold text-lg">
          KOOORA Admin
        </Link>
        <Link href="/" className="text-white/80 hover:text-white text-sm">
          ← العودة للموقع
        </Link>
        <div className="flex-1" />
        <span className="text-sm text-white/80">
          {profile?.display_name ?? user.email}
        </span>
        <form action={logoutAction}>
          <button className="text-sm text-white/80 hover:text-white">خروج</button>
        </form>
      </header>

      {!isAdmin ? (
        <main className="p-8 max-w-2xl mx-auto">
          <div className="bg-white border border-kooora-border/60 p-6 text-center">
            <h2 className="font-bold mb-2">صلاحياتك غير كافية</h2>
            <p className="text-sm text-kooora-dark/80">
              حسابك غير معتمد كمسؤول. اطلب من مسؤول النظام تعيين{" "}
              <code className="bg-gray-100 px-1">profiles.is_admin = true</code>{" "}
              لمستخدمك.
            </p>
          </div>
        </main>
      ) : (
        <div className="grid grid-cols-[220px_1fr] min-h-[calc(100vh-48px)]">
          <nav className="bg-white border-l border-kooora-border/60 p-3">
            <ul className="space-y-1 text-sm">
              {adminNav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="block px-3 py-2 hover:bg-kooora-gold/20 rounded"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <main className="p-6">{children}</main>
        </div>
      )}
    </div>
  );
}
