# NextBuildBD — Course Landing Page

Single-page, conversion-focused landing page for the NextBuildBD Vibe Coding course (Bangla copy, dark + light mode).

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS (CSS-variable tokens), shadcn/ui (Button, Accordion, Dialog), framer-motion, lucide-react, Supabase (auth + Postgres). Fonts: Hind Siliguri + Plus Jakarta Sans.

Routes: `/` landing page · `/login` student + admin login (email & password) · `/dashboard` student dashboard · `/admin` admin dashboard: overview (pending payments, submissions / revenue for 7·30·90 days, payment-method split, upcoming classes, verified-student CSV), payment verification, class management, settings.

## Run

```bash
npm install
# optional: cp .env.example .env to point at a different Supabase project
npm run dev       # http://localhost:5173
npm run lint
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Every price, number, link, payment number | `src/config.ts` (search for `TODO`) |
| Colour tokens (light + dark) | `src/index.css` → mapped in `tailwind.config.ts` |
| Theme: no-flash init script | `index.html` (inline script) + `src/lib/useTheme.ts` |
| SEO meta + JSON-LD `Course` schema | `index.html`, filled from `config.ts` at build time by the plugin in `vite.config.ts` |
| Sections (spec order) | `src/components/*.tsx` |
| Enroll form + validation | `src/components/Enroll.tsx`, `src/lib/validation.ts` |
| Logo / favicon / OG image | `public/` (generated from the brand logo) |
| Tool & brand logos (original colours) | `src/assets/logos/` via `src/components/shared/BrandLogo.tsx` |
| Animated hero demo | `src/components/HeroShowcase.tsx` |
| Smooth scrolling (Lenis) + progress bar | `src/components/shared/SmoothScroll.tsx` |
| Database schema + security rules | `supabase/migrations/*.sql` (one-paste bundle: `supabase/setup_all.sql`) |
| Security-rule tests | `supabase/tests/rls_test.py` |
| Supabase client + row types | `src/lib/supabase.ts` (loaded lazily; never in the landing page's first chunk) |
| Portal (login, dashboard, admin) | `src/portal/` — its own chunk, loaded only on `/login`, `/dashboard`, `/admin` |

## Before going live — fill these in `src/config.ts`

- `payment.rocket.number` — confirm (Rocket accounts are usually the mobile number + 1 check digit)
- `liveClass.schedule`, `batchStart` (the page shows "শীঘ্রই জানানো হবে" until set)
- `whatsappNumber` / `whatsappDisplay` (confirm)
- `site.url` (production domain, used in canonical / OG / JSON-LD)
- Optional: `seatsLeft` (number shows a "সীমিত আসন" line), `showGuarantee` + `guaranteeText`

The WhatsApp **group** link is no longer in `config.ts`: it is private (verified students only) and is set in `/admin → সেটিংস`.

## Supabase setup (student dashboard)

How it works: the enroll form saves a `pending` row in `enrollments` → an admin checks the TrxID in bKash/Nagad/Rocket and clicks **যাচাই করুন** in `/admin` → the student signs up at `/login` with the **same email** plus a password of their choosing, and their dashboard (classes, Meet links, recordings, WhatsApp group) unlocks. Access is decided by the database (row-level security), not by the browser.

Login is email + password only — no magic link, no emailed code, so no mail is ever sent and nothing depends on a working inbox.

The app is connected to the project `mlwbzmsitqtycminapwd` (URL + publishable key in `src/config.ts` → `supabase`; `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` override them).

1. **Create the database (once):** SQL Editor → New query → paste all of `supabase/setup_all.sql` → Run. (It is every file in `supabase/migrations/` in order; regenerate with `npm run db:bundle`. With the CLI: `supabase db push`.)
2. *(already done: project created)*
3. **Auth → Providers → Email:** enabled, and ***Confirm email* turned OFF**. Sign-up then returns a session straight away, which is what makes password login work without any mail. (No SMTP, no email templates and no URL configuration are needed — nothing is ever emailed.)
4. **Create the admin account.** With *Confirm email* off anyone can register any address, so step 1 installed a trigger that reserves every address in `public.admin_emails`. Open a short window to claim yours:
   1. SQL Editor: `drop trigger block_admin_signup on auth.users;`
   2. `/login` → **অ্যাকাউন্ট তৈরি করুন** → sign up with `asrafulislam2000@gmail.com` and a password. It is admin immediately (the address is seeded in `admin_emails`), so `/admin` opens.
   3. SQL Editor: re-run `supabase/migrations/20261015000000_password_login.sql` to put the trigger back.

   The address is now both taken and reserved. Don't leave the trigger off — that is the only thing standing between a stranger and `/admin`.
5. **Keys:** already in `src/config.ts`. To point a build at another project, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (in `.env` or the host's environment variables) and rebuild. Never use the secret/service_role key in this app.
6. **More admins:** add the address, then claim its account the same way as step 4:
   ```sql
   insert into public.admin_emails (email) values ('someone@example.com');
   ```
7. **Forgot the admin password?** Reset it in the SQL Editor:
   ```sql
   update auth.users
   set encrypted_password = extensions.crypt('your-new-password', extensions.gen_salt('bf'))
   where email = 'asrafulislam2000@gmail.com';
   ```
8. Open `/admin` → **সেটিংস** (WhatsApp group link, default Meet link) and **ক্লাস** (add classes; paste the recording link after each class).

Hosting: `vercel.json` rewrites `/login`, `/dashboard`, `/admin` to `index.html`. On other hosts add the same SPA fallback.

Until step 1 is done, form submissions fail (the form shows an error with a WhatsApp fallback) and the portal can't load data.

### Testing the security rules

`supabase/tests/rls_test.py` applies the migration to a throwaway local Postgres (with a small stand-in for Supabase's `auth` schema and default grants) and checks 46 cases: anonymous visitors can only insert, students see only their own rows and only get classes after verification, unconfirmed emails get nothing, only admins can verify / edit classes and settings, and sign-up is refused for any address reserved in `admin_emails`.

```bash
PGHOST=/path/to/socket-or-host PGPORT=5432 python3 supabase/tests/rls_test.py
```

### Known limits

- Anyone can submit the enroll form (that is the point), so spam rows are possible; the admin simply rejects them. Add a captcha / Edge Function if it becomes a problem.
- No SMS/Email notification on verification yet: students see access on their next visit or by tapping "স্ট্যাটাস রিফ্রেশ করুন".
