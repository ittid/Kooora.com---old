import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Suggestion = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
};

export async function GET(req: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json<{ items: Suggestion[] }>({ items: [] });
  }
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json<{ items: Suggestion[] }>({ items: [] });
  }
  try {
    const supabase = await createClient();
    // ilike covers short queries where to_tsquery has nothing to match.
    const { data } = await supabase
      .from("posts")
      .select("id, slug, title, cover_url")
      .eq("is_published", true)
      .ilike("title", `%${q}%`)
      .order("published_at", { ascending: false })
      .limit(5);
    return NextResponse.json<{ items: Suggestion[] }>({ items: (data ?? []) as Suggestion[] });
  } catch {
    return NextResponse.json<{ items: Suggestion[] }>({ items: [] });
  }
}
