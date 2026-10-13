# NextBuildBD — Course Landing Page

Single-page, conversion-focused landing page for the NextBuildBD Vibe Coding course (Bangla copy, dark + light mode).

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS (CSS-variable tokens), shadcn/ui (Button, Accordion, Dialog), framer-motion, lucide-react. Fonts: Hind Siliguri + Plus Jakarta Sans.

## Run

```bash
npm install
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

## Before going live — fill these in `src/config.ts`

- `payment.rocket.number` — confirm (Rocket accounts are usually the mobile number + 1 check digit)
- `whatsappGroupLink`
- `liveClass.schedule`, `batchStart` (the page shows "শীঘ্রই জানানো হবে" until set)
- `whatsappNumber` / `whatsappDisplay` (confirm)
- `site.url` (production domain, used in canonical / OG / JSON-LD)
- Optional: `seatsLeft` (number shows a "সীমিত আসন" line), `showGuarantee` + `guaranteeText`

## Phase 2

`Enroll.tsx` → `onSubmit` has a `// TODO: Supabase insert into enrollments` marker; the payload is already shaped
for an `enrollments` table (`full_name, phone, email, payment_method, sender_number, trx_id, amount, status`).
