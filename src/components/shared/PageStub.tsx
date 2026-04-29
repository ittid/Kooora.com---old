import SiteShell from "@/components/layout/SiteShell";

type Props = {
  title: string;
  description?: string;
};

export default function PageStub({ title, description }: Props) {
  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">{title}</h1>
        </header>
        <div className="p-6 text-[13px] text-kooora-dark min-h-[300px]">
          {description ?? "هذه الصفحة قيد الإنشاء. سيتم تعبئتها بالمحتوى قريباً."}
        </div>
      </section>
    </SiteShell>
  );
}
