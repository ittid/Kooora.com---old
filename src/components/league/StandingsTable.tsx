import Image from "next/image";
import Link from "next/link";
import type { StandingRow } from "@/lib/standings";

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-[12px] text-kooora-muted text-center py-6">
        لا تتوفر بيانات الترتيب لهذه المسابقة حالياً.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead className="bg-[#222] text-white">
          <tr>
            <th className="px-2 py-1.5 w-8 text-center">#</th>
            <th className="px-2 py-1.5 text-start">الفريق</th>
            <th className="px-2 py-1.5 w-10 text-center" title="لعب">ل</th>
            <th className="px-2 py-1.5 w-10 text-center" title="فاز">ف</th>
            <th className="px-2 py-1.5 w-10 text-center" title="تعادل">ت</th>
            <th className="px-2 py-1.5 w-10 text-center" title="خسر">خ</th>
            <th className="px-2 py-1.5 w-12 text-center" title="فارق الأهداف">+/-</th>
            <th className="px-2 py-1.5 w-12 text-center text-kooora-gold">نقاط</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.position} className="border-b border-kooora-border/40 last:border-0">
              <td className="px-2 py-1.5 text-center font-bold">{r.position}</td>
              <td className="px-2 py-1.5">
                <div className="flex items-center gap-2">
                  {r.team_logo && (
                    <Image
                      src={r.team_logo}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                      unoptimized
                    />
                  )}
                  {r.team_slug ? (
                    <Link
                      href={`/teams/${r.team_slug}`}
                      className="hover:text-kooora-goldDark"
                    >
                      {r.team_name}
                    </Link>
                  ) : (
                    <span>{r.team_name}</span>
                  )}
                </div>
              </td>
              <td className="px-2 py-1.5 text-center">{r.played}</td>
              <td className="px-2 py-1.5 text-center">{r.won}</td>
              <td className="px-2 py-1.5 text-center">{r.drawn}</td>
              <td className="px-2 py-1.5 text-center">{r.lost}</td>
              <td className="px-2 py-1.5 text-center" dir="ltr">
                {r.goal_diff > 0 ? `+${r.goal_diff}` : r.goal_diff}
              </td>
              <td className="px-2 py-1.5 text-center font-bold text-kooora-goldDark">
                {r.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
