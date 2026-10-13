# NextBuildBD — Course Landing Page

Single-page, conversion-focused landing page for the NextBuildBD Vibe Coding course (Bangla copy, dark + light mode).

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS (CSS-variable tokens), shadcn/ui (Button, Accordion, Dialog), framer-motion, lucide-react, Supabase (auth + Postgres). Fonts: Hind Siliguri + Plus Jakarta Sans.

Routes: `/` landing page · `/login` student login (email magic link / code) · `/dashboard` student dashboard · `/admin` payment verification + class management.

## Run

```bash
npm install
cp .env.example .env   # add your Supabase URL + publishable key (see "Supabase setup")
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
| Database schema + security rules | `supabase/migrations/20261013000000_phase2_dashboard.sql` |
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

How it works: the enroll form saves a `pending` row in `enrollments` → an admin checks the TrxID in bKash/Nagad/Rocket and clicks **যাচাই করুন** in `/admin` → the student logs in at `/login` with the **same email** and their dashboard (classes, Meet links, recordings, WhatsApp group) unlocks. Access is decided by the database (row-level security), not by the browser.

1. **Create a project** at supabase.com (region close to Bangladesh, e.g. Singapore).
2. **Run the migration:** SQL Editor → paste `supabase/migrations/20261013000000_phase2_dashboard.sql` → Run (or `supabase db push` with the CLI).
3. **Auth → URL Configuration:** Site URL = your domain (e.g. `https://nextbuildbd.com`). Redirect URLs: `https://nextbuildbd.com/dashboard`, `https://nextbuildbd.com/admin`, and `http://localhost:5173/*` for development.
4. **Auth → Providers → Email:** keep it enabled with *Confirm email* on. Access is only granted to confirmed emails.
5. **Email template (optional but recommended):** Auth → Email Templates → Magic Link: add the code, e.g. `<p>অথবা এই কোডটি দিন: {{ .Token }}</p>`. Students whose mail app opens links in a different browser can then type the code on `/login`.
6. **Custom SMTP (needed before launch):** Supabase's built-in mailer only sends a few emails per hour. Add an SMTP provider under Auth → SMTP Settings.
7. **Keys:** Settings → API → copy the project URL and the **publishable** (or legacy anon) key into `.env` locally and into your host's environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Never use the secret/service_role key in this app.
8. **Make yourself admin:** log in once at `/login`, then run in the SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'asrafulislam2000@gmail.com';
   ```
9. Open `/admin` → **সেটিংস** (WhatsApp group link, default Meet link) and **ক্লাস** (add classes; paste the recording link after each class).

Hosting: `vercel.json` rewrites `/login`, `/dashboard`, `/admin` to `index.html`. On other hosts add the same SPA fallback.

Without the two env vars the landing page still works, but the enroll form shows an error with a WhatsApp fallback (in `npm run dev` it only logs the payload) and `/dashboard` explains that the portal isn't configured.

### Testing the security rules

`supabase/tests/rls_test.py` applies the migration to a throwaway local Postgres (with a small stand-in for Supabase's `auth` schema and default grants) and checks 38 cases: anonymous visitors can only insert, students see only their own rows and only get classes after verification, unconfirmed emails get nothing, only admins can verify / edit classes and settings.

```bash
PGHOST=/path/to/socket-or-host PGPORT=5432 python3 supabase/tests/rls_test.py
```

### Known limits

- Anyone can submit the enroll form (that is the point), so spam rows are possible; the admin simply rejects them. Add a captcha / Edge Function if it becomes a problem.
- No SMS/Email notification on verification yet: students see access on their next visit or by tapping "স্ট্যাটাস রিফ্রেশ করুন".
