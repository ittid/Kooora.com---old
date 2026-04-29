"use client";

import { useEffect, useRef, useState } from "react";
import { fetchSdbPhotoAction } from "./actions";

type Candidate = { name: string; team: string | null; photo: string };

export default function PhotoPicker({
  defaultUrl,
  defaultName,
  defaultTeamName,
}: {
  defaultUrl: string;
  defaultName: string;
  defaultTeamName?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const teamRef = useRef<HTMLSelectElement | null>(null);

  // Read the current name + team selections from the surrounding form.
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;
    nameRef.current = form.querySelector('input[name="name_en"]') as HTMLInputElement | null;
    teamRef.current = form.querySelector('select[name="team_id"]') as HTMLSelectElement | null;
  }, []);

  async function fetchPhoto() {
    const nameEn = nameRef.current?.value?.trim() ?? "";
    const arabicFallback = (
      document.querySelector('input[name="name_ar"]') as HTMLInputElement | null
    )?.value?.trim() ?? "";
    const lookup = nameEn || defaultName || arabicFallback;
    if (!lookup) {
      setError("أدخل الاسم بالإنجليزية أولاً للبحث");
      return;
    }
    const teamLabel = teamRef.current
      ? teamRef.current.options[teamRef.current.selectedIndex]?.text
      : undefined;

    setBusy(true);
    setError(null);
    const res = await fetchSdbPhotoAction({ name: lookup, teamName: teamLabel });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setCandidates(res.candidates);
    if (res.url) setUrl(res.url);
  }

  return (
    <div>
      <label className="block mb-1 font-bold">رابط الصورة</label>
      <input
        type="text"
        name="photo_url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
      />
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={fetchPhoto}
          disabled={busy}
          className="text-[12px] h-7 px-3 bg-kooora-dark text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "..." : "جلب الصورة من TheSportsDB"}
        </button>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-12 w-12 object-cover rounded-full border border-kooora-border/60"
          />
        )}
        {error && <span className="text-[12px] text-red-700">{error}</span>}
      </div>

      {candidates.length > 1 && (
        <div className="mt-2">
          <p className="text-[11px] text-kooora-muted mb-1">
            اختياريا: اختر صورة أخرى
          </p>
          <div className="flex flex-wrap gap-2">
            {candidates.map((c) => (
              <button
                key={c.photo}
                type="button"
                onClick={() => setUrl(c.photo)}
                title={`${c.name} ${c.team ? "— " + c.team : ""}`}
                className={`border ${
                  c.photo === url ? "border-kooora-gold" : "border-kooora-border/60"
                } hover:border-kooora-gold p-0.5`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.photo} alt={c.name} className="w-12 h-12 object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
