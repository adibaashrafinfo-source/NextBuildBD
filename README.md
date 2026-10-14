# NextBuildBD — Course Landing Page

Single-page, conversion-focused landing page for the NextBuildBD Vibe Coding course (Bangla copy, dark + light mode).

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS (CSS-variable tokens), shadcn/ui (Button, Accordion, Dialog), framer-motion, lucide-react, Supabase (auth + Postgres). Fonts: Hind Siliguri + Plus Jakarta Sans.

Routes: `/` landing page · `/login` student + admin login (mobile number or email, plus password) · `/dashboard` student dashboard · `/admin` admin dashboard: overview (pending payments, submissions / revenue for 7·30·90 days, payment-method split, upcoming classes, verified-student CSV), payment verification, class management, settings.

## Run

```bash
npm install
# optional: cp .env.example .env to point at a different Supabase project
npm run dev       # http://localhost:5173
npm run lint
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Promo video (Abrar IT)

A separate deliverable that lives in this repo alongside the landing page: a
30-second, 1920x1080, **silent** motion-graphics promo for Abrar IT's Website
Design & Development service, built with Remotion.

```bash
npm run video:studio   # interactive preview with a scrubbable timeline
npm run video:render   # out/abrar-it-promo-30s.mp4  (900 frames @ 30fps)
```

Source is in `remotion/`; every timing lives in `remotion/timeline.ts`. Full
documentation, including how to attach your own voice-over afterwards, is in
**[VIDEO.md](VIDEO.md)**. It shares nothing with the site build but the
`public/` folder.

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

How it works: a student picks a password while filling in the enroll form, which creates their account and saves a `pending` row in `enrollments` → an admin checks the TrxID in bKash/Nagad/Rocket and clicks **যাচাই করুন** in `/admin` → the student's dashboard (classes, Meet links, recordings, WhatsApp group) unlocks. Access is decided by the database (row-level security), not by the browser.

Sign-in is **mobile number or email, plus that password**. Nothing is ever emailed — no magic link, no code, no SMTP — so nothing depends on a working inbox.

Email is optional. Supabase Auth signs in by email, so a student who gives none gets an address derived from their mobile number (`01XXXXXXXXX@phone.nextbuildbd.local`); it is never used to send anything. `public.login_email(identifier, password)` turns whichever identifier was typed into the address to sign in with, and answers only when the password is right, so it cannot be used to find out who has enrolled.

The app is connected to the project `mlwbzmsitqtycminapwd` (URL + publishable key in `src/config.ts` → `supabase`; `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` override them).

1. **Create the database (once):** SQL Editor → New query → paste all of `supabase/setup_all.sql` → Run. (It is every file in `supabase/migrations/` in order; regenerate with `npm run db:bundle`. With the CLI: `supabase db push`.)
   *Already ran an older `setup_all.sql`?* Run only the newer files from `supabase/migrations/` (in date order) in the SQL Editor. `20261016000000_phone_password_login.sql` is safe to run again if it was applied partly. Until it is in, the enroll form can create the student's account but not save the enrollment.
2. *(already done: project created)*
3. **Auth → Providers → Email:** enabled, and ***Confirm email* turned OFF**. Sign-up then returns a session straight away, which is what makes password login work without any mail. (No SMTP, no email templates and no URL configuration are needed — nothing is ever emailed.)
4. **Create the admin account:** open `supabase/create_admin.sql`, set `admin_password` to a real password, and run the whole file in the SQL Editor. Admins have no enrollment, so this is the only way an admin account comes into being. Running it again just resets the password.
5. **Keys:** already in `src/config.ts`. To point a build at another project, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (in `.env` or the host's environment variables) and rebuild. Never use the secret/service_role key in this app.
6. **More admins / a forgotten admin password:** edit the two values at the top of `supabase/create_admin.sql` and run it again. It adds the address to `public.admin_emails`, creates the account if it is new, and resets the password if it is not.
7. Open `/admin` → **সেটিংস** (WhatsApp group link, default Meet link) and **ক্লাস** (add classes; paste the recording link after each class).

Hosting: `vercel.json` rewrites `/login`, `/dashboard`, `/admin` to `index.html`. On other hosts add the same SPA fallback.

Until step 1 is done, form submissions fail (the form shows an error with a WhatsApp fallback) and the portal can't load data.

### Testing the security rules

`supabase/tests/rls_test.py` applies the migration to a throwaway local Postgres (with a small stand-in for Supabase's `auth` schema and default grants) and checks 58 cases: anonymous visitors can only insert, students see only their own rows (by account, or by email for rows predating sign-up-on-enroll) and only get classes after verification, an applicant cannot stamp someone else's account on a row, `login_email()` answers only with the right password, only admins can verify / edit classes and settings, and sign-up is refused for any address reserved in `admin_emails`.

```bash
PGHOST=/path/to/socket-or-host PGPORT=5432 python3 supabase/tests/rls_test.py
```

### Known limits

- Anyone can submit the enroll form (that is the point), so spam rows are possible; the admin simply rejects them. Add a captcha / Edge Function if it becomes a problem.
- No SMS/Email notification on verification yet: students see access on their next visit or by tapping "স্ট্যাটাস রিফ্রেশ করুন".
- `public.login_email()` checks a password outside Supabase's own auth endpoint, so it does not get that endpoint's rate limiting. It reveals nothing without the right password, but a determined attacker can guess against it faster than against `/auth/v1/token`. Insist on non-trivial passwords, and put the project behind a WAF if that stops being enough.
- A password can only be reset from the SQL Editor (`supabase/create_admin.sql` for admins; for a student, update `auth.users.encrypted_password`). There is no self-service reset, because that would need email.
