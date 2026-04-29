import SiteShell from "@/components/layout/SiteShell";
import { loginAction } from "./actions";

export const metadata = { title: "تسجيل الدخول - كووورة" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <SiteShell withSidebar={false}>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3 max-w-md mx-auto">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">تسجيل الدخول</h1>
        </header>
        <form action={loginAction} className="p-5 space-y-3 text-[13px]">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block mb-1 font-bold">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              required
              className="w-full h-9 px-2 border border-kooora-border bg-white outline-none focus:border-kooora-gold"
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">كلمة المرور</label>
            <input
              name="password"
              type="password"
              required
              className="w-full h-9 px-2 border border-kooora-border bg-white outline-none focus:border-kooora-gold"
            />
          </div>
          {error && (
            <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full h-9 bg-kooora-gold text-kooora-dark font-bold hover:brightness-95"
          >
            دخول
          </button>
        </form>
      </section>
    </SiteShell>
  );
}
