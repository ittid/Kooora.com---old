"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Suggestion = { id: string; slug: string; title: string; cover_url: string | null };

export default function SearchBox() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 2) {
      setItems([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(term)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) {
          setItems([]);
          return;
        }
        const json = (await res.json()) as { items: Suggestion[] };
        setItems(json.items);
      } catch {
        // ignore aborts and network errors
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative flex items-center">
      {open && (
        <form onSubmit={submit} className="me-2 relative">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث..."
            className="h-[26px] w-[220px] px-2 text-[13px] text-kooora-dark bg-white outline-none"
            dir="rtl"
          />
          {q.trim().length >= 2 && (
            <div
              className="absolute top-full right-0 mt-1 w-[300px] bg-white text-kooora-dark border border-kooora-border/60 shadow-lg z-[1000]"
              dir="rtl"
            >
              {loading && items.length === 0 && (
                <div className="px-3 py-2 text-[12px] text-kooora-muted">
                  جاري البحث...
                </div>
              )}
              {!loading && items.length === 0 && (
                <div className="px-3 py-2 text-[12px] text-kooora-muted">
                  لا توجد اقتراحات
                </div>
              )}
              <ul className="divide-y divide-kooora-border/50">
                {items.map((it) => (
                  <li key={it.id}>
                    <Link
                      href={`/news/${it.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-[12.5px] hover:bg-kooora-gold/20"
                    >
                      {it.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {items.length > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block bg-kooora-dark text-kooora-gold text-center py-1.5 text-[12px] hover:brightness-110"
                >
                  عرض كل النتائج
                </Link>
              )}
            </div>
          )}
        </form>
      )}
      <button
        type="button"
        aria-label="بحث"
        onClick={() => setOpen((v) => !v)}
        className="hover:opacity-80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/search.png" alt="" className="w-[20px] h-[20px]" />
      </button>
    </div>
  );
}
