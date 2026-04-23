import { ReactNode } from "react";

type Props = {
  title?: string;
  tabs?: { label: string; active?: boolean }[];
  children: ReactNode;
  className?: string;
  noBody?: boolean;
};

export default function Panel({ title, tabs, children, className = "", noBody = false }: Props) {
  return (
    <section className={`bg-kooora-card shadow-card mb-3 ${className}`}>
      {(title || tabs) && (
        <header className="bg-kooora-dark text-white px-3 h-[32px] flex items-center justify-between">
          {title && <h3 className="text-[13px] font-bold text-kooora-gold">{title}</h3>}
          {tabs && (
            <div className="flex items-center gap-2 text-[12px]">
              {tabs.map((t, i) => (
                <button
                  key={i}
                  className={`px-2 py-0.5 rounded ${
                    t.active
                      ? "bg-kooora-gold text-kooora-dark font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </header>
      )}
      {noBody ? children : <div className="p-2">{children}</div>}
    </section>
  );
}
