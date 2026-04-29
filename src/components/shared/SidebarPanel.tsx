import { ReactNode } from "react";

type Tab = { label: string; active?: boolean };

type Props = {
  title: string;
  tabs?: Tab[];
  children: ReactNode;
  bodyClassName?: string;
};

export default function SidebarPanel({ title, tabs, children, bodyClassName = "" }: Props) {
  return (
    <section className="mb-3">
      <header className="bg-kooora-dark h-[34px] flex items-stretch border-b-2 border-kooora-gold">
        {/* Title on the RIGHT (first child in RTL) */}
        <h3
          className="text-white flex items-center px-3"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "30px",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>

        {/* Spacer pushes tabs to the far left */}
        {tabs && <div className="flex-1" />}

        {/* Tabs on the LEFT */}
        {tabs && (
          <div className="flex items-stretch">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`px-4 text-[13px] ${
                  t.active
                    ? "bg-kooora-card text-kooora-dark font-bold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>
      <div className={`bg-kooora-card ${bodyClassName}`}>{children}</div>
    </section>
  );
}
