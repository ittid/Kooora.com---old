# Supabase Setup — kooora.com

Follow these steps once. Total time: ~10 minutes.

## 1. Create the project

1. Sign up / log in at <https://supabase.com>.
2. Click **New project**.
3. Choose:
   - Name: `kooora` (anything you like)
   - Database password: pick a strong one and save it
   - Region: closest to your users (e.g. `eu-central-1` for MENA)
   - Plan: Free is fine to start
4. Wait ~2 minutes for provisioning.

## 2. Get your API keys

In the project dashboard:

1. Click the **gear icon** (Settings) in the left sidebar.
2. Click **API**.
3. Copy these three values into `.env.local` at the project root:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (under "Project API keys", click reveal) → `SUPABASE_SERVICE_ROLE_KEY`

> The `service_role` key bypasses Row Level Security. Never commit it
> and never use it in client code. It's only read in server-side code.

## 3. Run the schema migration

1. In Supabase, click **SQL Editor** (left sidebar) > **New query**.
2. Open `supabase/migrations/0001_initial_schema.sql` from this repo,
   copy the whole file, paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."

This creates the tables, RLS policies, search index, and the
`search_posts` RPC.

## 4. Seed sample data (optional but recommended)

To see the homepage populated immediately:

1. SQL Editor > **New query**.
2. Paste the contents of `supabase/seed.sql`.
3. Run.

You can re-run the seed at any time — it uses upserts.

## 5. Create your admin user

1. In Supabase: **Authentication** > **Users** > **Add user** > **Create new user**.
   - Email: your email
   - Password: pick one
   - Auto-confirm: ✓ on
2. After creating, copy the new user's UUID (the `id` column).
3. SQL Editor > New query, run:
   ```sql
   update public.profiles set is_admin = true where id = 'PASTE_USER_UUID_HERE';
   ```
4. Restart `pnpm dev`.
5. Go to <http://localhost:3000/login>, log in with that email + password.
6. You should be redirected to `/admin`.

## 6. Test the integration

- `/` — homepage should show data from Supabase (news, matches, polls)
- `/admin/posts` — create a post, mark it published, refresh `/news`
- `/search?q=...` — full-text search across published posts

## Troubleshooting

- **"Your project's URL and Key are required"** in dev console:
  `.env.local` not loaded. Stop dev server (`Ctrl+C`) and restart `pnpm dev`.
- **Login button does nothing**: check the user is confirmed (Auth > Users).
- **Admin page says "صلاحياتك غير كافية"**: you didn't run step 5.3 yet,
  or you ran it on the wrong UUID.
- **Polls don't save votes**: that's expected — voting requires a
  unique fingerprint per browser, set up in `Poll.tsx`.
