"use client";

import { useRef, useState } from "react";
import { uploadCoverAction } from "./actions";

export default function CoverUpload({ defaultUrl }: { defaultUrl: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadCoverAction(fd);
    setBusy(false);
    if (res.error) setError(res.error);
    if (res.url) setUrl(res.url);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block font-bold">صورة الغلاف</label>
      <input
        type="text"
        name="cover_url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
      />
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          disabled={busy}
          className="text-[12px]"
        />
        {busy && <span className="text-[12px] text-kooora-muted">جاري الرفع...</span>}
        {error && <span className="text-[12px] text-red-700">{error}</span>}
      </div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="max-h-32 border border-kooora-border/60"
        />
      )}
    </div>
  );
}
