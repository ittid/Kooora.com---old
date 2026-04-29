"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const COOKIE = "kooora_voter";

async function voterFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  let fp = cookieStore.get(COOKIE)?.value;
  if (!fp) {
    fp = crypto.randomUUID();
    cookieStore.set(COOKIE, fp, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    });
  }
  // Mix in IP if available, so a cookie-cleared user doesn't get free votes.
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  return `${fp}:${ip}`;
}

export async function votePollAction(pollId: string, optionId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: "Supabase غير مفعل" };
  }
  try {
    const fp = await voterFingerprint();
    const supabase = await createClient();

    const { error: insertErr } = await supabase
      .from("poll_votes")
      .insert({ poll_id: pollId, option_id: optionId, voter_fingerprint: fp });

    if (insertErr) {
      // Unique constraint = already voted
      if (insertErr.code === "23505") {
        return { error: "لقد قمت بالتصويت من قبل" };
      }
      return { error: insertErr.message };
    }

    // Increment vote count using the service role to avoid RLS write friction.
    const admin = createAdminClient();
    const { error: rpcErr } = await admin.rpc("increment_poll_option", { opt_id: optionId });
    if (rpcErr) {
      // Fallback if the RPC isn't deployed: read-then-write.
      const { data } = await admin
        .from("poll_options")
        .select("votes")
        .eq("id", optionId)
        .single();
      if (data) {
        await admin
          .from("poll_options")
          .update({ votes: (data.votes ?? 0) + 1 })
          .eq("id", optionId);
      }
    }

    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "خطأ" };
  }
}
