# NextBuildBD — Claude Code Build Prompt (v2, complete)

> **কীভাবে ব্যবহার করবেন**
> 1. একটি খালি ফোল্ডার নিন। এর ভেতরে রাখুন:
>    - এই ফাইল: `CLAUDE_CODE_BUILD_PROMPT.md`
>    - ডাউনলোড করা ডিজাইন HTML ফাইল → `design/nextbuildbd-design.html` নামে রাখুন
>    - লোগো → `public/logo.png`
>    - ইনস্ট্রাক্টরের ছবি → `public/instructor.jpg`
> 2. ফোল্ডারে `claude` চালান।
> 3. নিচের **"Paste this prompt"** অংশটি Claude Code-এ কপি-পেস্ট করুন।
>
> Page copy বাংলায়। Code, class name, file name ইংরেজিতে।

---

## Paste this prompt

```text
You are a senior front-end engineer. Build the complete NextBuildBD course landing page.

SOURCE OF TRUTH
1. Read CLAUDE_CODE_BUILD_PROMPT.md in this folder completely before writing any code. It is the full
   spec: design tokens, config, all sections with exact Bangla copy, animations, logos, accessibility and
   performance rules, and the acceptance checklist. Follow it exactly.
2. design/nextbuildbd-design.html is a VISUAL REFERENCE ONLY (layout, spacing, colours, card styles).
   It is an older static mock. Wherever it differs from the .md (hero animation, real brand logos,
   payment numbers, instructor photo, Google Meet branding, scroll animations), the .md wins.
3. Do not rewrite, shorten or "improve" the Bangla copy. Use it exactly as written in the .md.

ASSETS
- public/logo.png (brand logo) and public/instructor.jpg (instructor photo) are provided.
- Get the tool/brand logos exactly as described in section 9 of the .md (original colours).

WORKFLOW
Step 1: Read the .md and the design HTML, then reply with a short plan (file list + component list).
        Do not wait for approval, continue.
Step 2: Scaffold (Vite + React + TS), config.ts, index.css tokens, Tailwind mapping, theme toggle,
        no-flash theme script, assets (logo mark, favicons, OG image, optimised instructor photo, logos).
Step 3: Build components in the Build Order (section 16).
Step 4: Run the dev server. Check every section in dark AND light mode at 360px, 768px and 1280px
        (use Playwright screenshots). Fix layout, overflow and contrast problems.
Step 5: Run lint, type-check and a production build. Fix all errors and warnings.
Step 6: Run the verification in section 15 (interaction tests, axe, Lighthouse) and fix what fails.
Step 7: Go through the Acceptance Checklist (section 17) item by item and report pass/fail.

DELIVERABLE
A working project that runs with `npm install && npm run dev`. Finish with the report in section 18.
If anything is ambiguous, pick the most reasonable option, note it in the final report, and keep going.
Do not stop to ask.
```

---

## 1. Goal & non-negotiables

Single-page, conversion-focused landing page for a Bangla course, with Dark + Light mode.

1. **Mobile-first.** Most users are on phones in Bangladesh. Must look correct at **360px** with no horizontal scroll.
2. **One pricing plan only: ১,৪৯৯৳.** No multi-plan table, no crossed-out old price, no fake discount.
3. **Google Meet live class** must be clearly visible (with the real Google Meet logo) in: Hero, Facilities, Live Class section, Pricing card, FAQ.
4. **Every price, number, link and payment number comes from `src/config.ts`.** Never hardcode them in components (SEO tags and JSON-LD included; inject them at build time).
5. **Every CTA scrolls to `#enroll`.** WhatsApp links use `https://wa.me/{number}?text={encoded message}` from config.
6. **No fake testimonials, student counts or income claims.** Keep the income disclaimer line.
7. **Accessibility:** WCAG AA contrast in both themes, visible focus states, `prefers-reduced-motion` respected everywhere.
8. **Performance:** Lighthouse mobile Performance ≥ 90, Accessibility/Best Practices/SEO = 100.

---

## 2. Stack

- React 18 + TypeScript + Vite
- Tailwind CSS 3 (colours mapped to CSS variables) + `tailwindcss-animate`
- shadcn/ui primitives: Button, Accordion, Dialog (Radix)
- framer-motion (scroll reveals, scroll-linked effects) — use `LazyMotion` + `m.*` components
- lenis (smooth scrolling)
- lucide-react (UI icons). lucide has no brand marks → brand logos are SVG files (section 9).
- Fonts (Google Fonts, `display=swap`): **Hind Siliguri** (Bangla) + **Plus Jakarta Sans** (English/numbers). Load the stylesheet non-render-blocking (`rel=preload` + `media="print" onload="this.media='all'"` + `<noscript>` fallback).

---

## 3. Brand & design tokens

Brand look from the logo: deep navy background, indigo → violet gradient.

### 3.1 `src/index.css` tokens (use exactly)

```css
:root {
  /* LIGHT MODE */
  --bg: #F7F8FF;
  --bg-elevated: #FFFFFF;
  --bg-soft: #EEF0FF;
  --text: #0B0D2E;
  --text-muted: #4B5078;
  --border: #DDE0F5;

  --brand: #4338F0;
  --brand-strong: #2E24C9;
  --brand-soft: #E4E6FF;
  --accent: #8B6CFF;
  --sky: #5B8CFF;
  --lavender: #C9B8FF;

  --gradient-brand: linear-gradient(135deg, #5B8CFF 0%, #4338F0 55%, #8B6CFF 100%);
  --gradient-hero-glow: radial-gradient(60% 50% at 50% 0%, rgba(67,56,240,.16), transparent 70%);

  --success: #12A150;
  --warning: #F5A524;
  --shadow-card: 0 10px 30px -12px rgba(67,56,240,.25);

  /* Additions required for WCAG AA */
  --gradient-cta: linear-gradient(135deg, #3F5BEA 0%, #4338F0 55%, #6A48E6 100%); /* buttons: white text >= 4.5:1 */
  --gradient-text: var(--gradient-cta);   /* gradient headline text >= 3:1 on --bg */
  --input-border: #7E84AE;                /* form field edges >= 3:1 */
  --danger: #C42B2B;
  --pattern-dot: rgba(67,56,240,.12);
  color-scheme: light;
}

:root[data-theme="dark"] {
  --bg: #050816;
  --bg-elevated: #0C1030;
  --bg-soft: #11164A;
  --text: #F4F5FF;
  --text-muted: #A9AEDB;
  --border: #1F2566;

  --brand: #5B6BFF;
  --brand-strong: #7C8BFF;
  --brand-soft: #1A2070;
  --accent: #A98CFF;
  --sky: #7FA6FF;
  --lavender: #C9B8FF;

  --gradient-brand: linear-gradient(135deg, #7FA6FF 0%, #4F46FF 55%, #A98CFF 100%);
  --gradient-hero-glow: radial-gradient(60% 50% at 50% 0%, rgba(91,107,255,.35), transparent 70%);
  --shadow-card: 0 14px 40px -16px rgba(91,107,255,.45);

  --gradient-text: var(--gradient-brand);
  --input-border: #6670C8;
  --danger: #FF8A8A;
  --pattern-dot: rgba(127,166,255,.10);
  color-scheme: dark;
}
```

- Map in Tailwind as `bg-bg`, `bg-bg-elevated`, `bg-bg-soft`, `text-text`, `text-text-muted`, `border-border`, `bg-brand`, `text-brand-strong`, `bg-brand-soft`, `bg-gradient-brand`, `bg-gradient-cta`, `bg-hero-glow`, `shadow-card`, etc.
- Dark mode via `darkMode: ["selector", '[data-theme="dark"]']`.
- ⚠️ Tailwind 3 cannot apply opacity modifiers (`bg-bg/80`) to `var()` colours. Do not use them. For translucent surfaces write small CSS classes with a solid fallback and `@supports (color: color-mix(...))` for the translucent version (older Android browsers don't support `color-mix`).
- WhatsApp green: use **`#11843F`** (hover `#0D6F38`), not `#25D366`, so white text/icon passes AA.
- Use text colour `--brand-strong` (not `--brand`) for brand-coloured text: it passes AA in both themes.

### 3.2 Style direction
- Premium, modern tech. Rounded corners 16–24px.
- Primary button: `--gradient-cta`, white text, glow on hover. Secondary: transparent + `--border` outline.
- Card: `--bg-elevated`, `1px solid var(--border)`, `--shadow-card`.
- Hero background: `--gradient-hero-glow` + very light dot pattern (masked radial fade).
- Section spacing: desktop 96px, mobile 64px. Container max width 1200px, 16px side padding on mobile.
- Body text 17px, line-height 1.7 (Bangla needs the height).

### 3.3 Theme
- Default = system preference. User choice saved in `localStorage` key `nbbd-theme`, every read/write inside `try/catch`.
- **No flash:** an inline script in `<head>` sets `data-theme` on `<html>` (and updates `<meta name="theme-color">`) before first paint.
- Follow OS changes until the user picks a theme. Toggle (sun/moon) in the header with a Bangla `aria-label`.

---

## 4. `src/config.ts`

```ts
export const CONFIG = {
  brand: "NextBuildBD",
  tagline: "Learn. Build. Launch.",
  courseName: "NextBuildBD Vibe Coding Course",
  price: 1499,
  currency: "৳",
  priceCurrencyCode: "BDT",

  whatsappNumber: "8801719686459",          // TODO: owner confirm
  whatsappDisplay: "01719-686459",
  whatsappGroupLink: "https://chat.whatsapp.com/XXXX", // TODO: replace
  whatsappMessage: "আসসালামু আলাইকুম, কোর্স সম্পর্কে জানতে চাই।",
  whatsappPaymentMessage: "আসসালামু আলাইকুম, পেমেন্ট নিয়ে সাহায্য দরকার।",

  /** Digits only (Copy button copies this); displayed as 01719-686459. */
  payment: {
    bkash:  { number: "01719686459", type: "Personal / Send Money" },
    nagad:  { number: "01719686459", type: "Personal / Send Money" },
    // TODO: owner confirm — Rocket accounts are usually the mobile number + 1 check digit (12 digits)
    rocket: { number: "01719686459", type: "Personal / Send Money" },
  },

  liveClass: { platform: "Google Meet", schedule: "TODO: দিন ও সময়" }, // TODO
  batchStart: "TODO: তারিখ",                                            // TODO
  seatsLeft: null as number | null,  // null হলে seat counter দেখাবে না
  showGuarantee: false,              // owner সিদ্ধান্ত না নিলে false
  guaranteeText: "",                 // TODO: owner-এর লেখা শর্ত (দ্বিগুণ টাকা ফেরত জাতীয় কিছু লেখা যাবে না)

  aiSubscriptionCost: "$20",

  instructor: {
    name: "Ashraful Islam (Arif)",
    photo: "/instructor.webp",
    photoFallback: "/instructor.jpg",
    facebook: "https://facebook.com/ashraf.arif2000",
    website: "https://abrarit.com",
  },
  contact: {
    email: "asrafulislam2000@gmail.com",
    facebook: "https://facebook.com/ashraf.arif2000",
  },
  site: { url: "https://nextbuildbd.com", copyrightYear: 2026 }, // TODO: final domain
};
```

Helpers (in `src/lib/utils.ts`):
- `toBanglaNumber(n)` with `Intl.NumberFormat("bn-BD")` → `১,৪৯৯`. `priceLabel()` → `১,৪৯৯৳`.
- `waLink(message?)` → `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`.
- `formatPhone("01719686459")` → `01719-686459` (display only).
- `displayValue(v)`: if a value still starts with `TODO`, show **"শীঘ্রই জানানো হবে"** on the page instead.
- In dev mode, `console.warn` the list of config values that are still TODO.

---

## 5. Page structure (top → bottom)

1. Header (sticky) 2. Hero 3. Trust strip 4. কাদের জন্য 5. Curriculum 6. Tools 7. Facilities 8. Outcome 9. Cost 10. Process 11. Live Class (Google Meet) 12. Pricing 13. Instructor 14. FAQ 15. Enroll (`#enroll`) 16. Final CTA 17. Footer 18. Floating WhatsApp button + mobile sticky enroll bar

Plus: a skip link "মূল কনটেন্টে যান" → `#main`. `<main id="main">` wraps sections 2–16; the footer is outside `<main>`.

---

## 6. Section specs with exact copy

### 6.1 Header
- Left: logo mark + wordmark "Next**Build**" + "**BD**" (BD in `--brand-strong`). The full `logo.png` is square with its own wordmark (unreadable at 40px), so **crop the "N" mark** from it into `public/logo-mark.webp` (≈80×80) and pair it with live text.
- Centre (desktop): `কোর্স সম্পর্কে` (#about) · `কারিকুলাম` (#curriculum) · `সুবিধা` (#facilities) · `মূল্য` (#pricing) · `FAQ` (#faq).
- Right: theme toggle, WhatsApp icon button (hidden < 640px), primary button **"এনরোল করুন"** (at < 640px label shortens to "এনরোল" so the header fits 360px), hamburger (< 1024px) with `aria-expanded`/`aria-controls`, Escape closes it.
- Transparent at top; on scroll: translucent background + `backdrop-blur` + bottom border. Header must fit 360px without overflow.

### 6.2 Hero
- Badge pill: red pulsing dot + `Live Class • Google Meet • নতুন ব্যাচ`
- H1: **Claude Code, Lovable আর Supabase দিয়ে নিজেই বানান ওয়েবসাইট ও SaaS — কোডিং না জেনেও।** ("ওয়েবসাইট ও SaaS" in gradient text). The H1 must **not** fade in from opacity 0 (it is the LCP element).
- Sub: আইডিয়া থেকে লাইভ প্রোডাক্ট পর্যন্ত পুরো পথ আমরা হাতে-কলমে দেখাব। শিখুন Vibe Coding, বানান Landing Page, Website ও SaaS, আর দেশ-বিদেশের ক্লায়েন্টের কাছে সেটা বিক্রি করে আয় শুরু করুন।
- CTAs: Primary **"মাত্র ১,৪৯৯৳-এ এনরোল করুন"** → `#enroll`; Secondary **"WhatsApp-এ প্রশ্ন করুন"** → wa.me.
- 4 highlights with icons: `Google Meet-এ Live Class` (**real Google Meet logo** on a white tile) · `Claude Code + Lovable + Supabase` · `WhatsApp কমিউনিটি সাপোর্ট` · `bKash / Nagad / Rocket-এ সহজ পেমেন্ট`
- Hero entrance animations: CSS only (tailwindcss-animate), **not** framer-motion, so the first chunk stays small.
- **Right side: animated premium showcase (see 7.1).**

### 6.3 Trust strip (one card, 4 items, no invented numbers)
`শূন্য থেকে শুরু` — Beginner Friendly · `Live + Recorded` — মিস করলেও সমস্যা নেই · `Real Project` — হাতে-কলমে বানানো · `WhatsApp Support` — আটকে গেলে সাহায্য

### 6.4 এই কোর্স কাদের জন্য (`#about`)
Title: **আপনি যদি এদের একজন হন, এই কোর্স আপনার জন্য**
1. **১. স্টুডেন্ট ও নতুন শিক্ষার্থী** — কোডিং জানেন না? সমস্যা নেই। AI দিয়ে কাজ করে এমন একটি হাই-ডিমান্ড স্কিল শিখে নিজের ক্যারিয়ার শুরু করুন।
2. **২. ব্যবসায়ী ও বিজনেস ওনার** — নিজের ব্যবসার ওয়েবসাইট, অর্ডার সিস্টেম বা সফটওয়্যার নিজেই বানান। ডেভেলপারের পেছনে লাখ টাকা খরচ না করে নিজের হাতে নিয়ন্ত্রণ নিন।
3. **৩. ফ্রিল্যান্সার ও এন্ট্রাপ্রেনিউর** — ক্লায়েন্টের জন্য Landing Page, Website ও SaaS বানিয়ে দেশি ও আন্তর্জাতিক মার্কেটে সার্ভিস বিক্রি করুন, অথবা নিজের প্রোডাক্ট লঞ্চ করুন।

### 6.5 Curriculum (`#curriculum`) — Accordion (module 1 open by default), numbered gradient badge "01…08" + "Module N"
Title: **আইডিয়া থেকে লাইভ প্রোডাক্ট — ধাপে ধাপে**

- **Module 1 — Vibe Coding পরিচিতি ও Setup:** Vibe Coding কী, আর কেন এটা গেম চেঞ্জার · Claude Code install ও সেটআপ · Lovable account ও workspace সেটআপ · Supabase, GitHub, Vercel account সেটআপ · ভালো Prompt লেখার কৌশল
- **Module 2 — Landing Page Design:** Conversion-focused landing page-এর গঠন · Lovable ও Claude Code দিয়ে ডিজাইন · Dark/Light mode, Responsive, Animation · নিজের ব্র্যান্ড অনুযায়ী ডিজাইন
- **Module 3 — Business Website Build:** Corporate / Portfolio / E-commerce সাইট · SEO বেসিক ও দ্রুত লোডিং · Domain কেনা ও Hosting সংযোগ · ক্লায়েন্ট ওয়ার্কের জন্য প্রফেশনাল ডেলিভারি
- **Module 4 — Supabase Database Management:** Table, Relation, Schema ডিজাইন · Authentication (Login/Signup) · Row Level Security (RLS) দিয়ে ডেটা সুরক্ষা · Storage, Edge Functions
- **Module 5 — SaaS Product Build:** SaaS আইডিয়া যাচাই · Student/User Dashboard ও Admin Dashboard · Role-based access · Subscription ও Plan লজিক
- **Module 6 — Bangladesh Payment ও Automation:** bKash / Nagad / Rocket (Send Money + TrxID) পেমেন্ট ফ্লো · Admin ভেরিফাই করলে অটো অ্যাক্সেস চালু · WhatsApp গ্রুপ লিংক ও ডাইরেক্ট মেসেজ ইন্টিগ্রেশন · SMS/Email নোটিফিকেশন
- **Module 7 — Deploy, Debug ও Maintenance:** GitHub ও Vercel দিয়ে ডিপ্লয় · Error debug করার পদ্ধতি · Security checklist ও Backup · প্রোডাক্ট আপডেট ও ভার্সনিং
- **Module 8 — আয় ও ক্লায়েন্ট (Monetization):** Local ও International ক্লায়েন্ট কোথায় পাবেন · Fiverr, Upwork, LinkedIn, Facebook-এ প্রোফাইল সাজানো · সার্ভিস প্যাকেজ ও প্রাইসিং · নিজের SaaS বিক্রির মডেল: Subscription, One-time, Lead-gen · Portfolio তৈরি ও ক্লায়েন্ট পিচ

### 6.6 Tools
Title: **যে টুলগুলো আপনি দক্ষভাবে চালাতে শিখবেন**
Grid of **8 logo cards** (2 columns mobile, 4 desktop), each with the **original logo**, the name and a small English tag:

| Tool | Tag | Hover glow |
|---|---|---|
| Claude Code | AI Coding Agent | `#D97757` |
| Lovable | AI App Builder | `#FF5AA0` |
| Supabase | Database & Auth | `#3ECF8E` |
| React | UI Library | `#00D8FF` |
| TypeScript | Type-safe Code | `#3178C6` |
| GitHub | Version Control | `#8B949E` |
| Vercel | Deploy & Hosting | `#A3A3A3` |
| Tailwind CSS | Styling | `#38BDF8` |

**bKash and WhatsApp are NOT in this section.** Hover: lift, border + shadow take the tool's glow colour, logo tile scales slightly.

### 6.7 Facilities (`#facilities`)
Title: **কোর্সে আপনি যা যা পাচ্ছেন** — 8 cards with **premium icons**:
- Icon tile 56px, rounded-2xl, own gradient per card, glossy top highlight (white→transparent), coloured soft shadow, white lucide icon (stroke 1.75). Tile tilts/scales slightly on hover.
- Card: pointer-following spotlight (radial gradient at `--mx/--my` set on `mousemove`), lift on hover, border takes the card colour, large faint index number "01…08" in the corner drawn via CSS `content: attr(data-n)` (decorative, not real text, so it isn't contrast-checked).
- Card 1 is highlighted (ring) and uses the **real Google Meet logo** on a white tile.

| # | Title | Body | Icon | Gradient |
|---|---|---|---|---|
| 1 | Google Meet-এ Live Class | সরাসরি প্রশ্ন করুন, স্ক্রিন শেয়ারে দেখে দেখে শিখুন। | Google Meet logo | — |
| 2 | Class Recording | মিস হলে বা আবার দেখতে চাইলে রেকর্ডিং দেখুন। | MonitorPlay | `#F43F5E → #BE123C` |
| 3 | Real Project Walkthrough | Landing Page থেকে পূর্ণাঙ্গ LMS/SaaS বানানো। | Wand2 | `#4F46E5 → #7C3AED` |
| 4 | Ready Prompt Library | Claude Code ও Lovable-এর প্রম্পট, সরাসরি কপি করে কাজে লাগান। | BookOpenText | `#EA580C → #C2410C` |
| 5 | Source Code ও Template | প্রজেক্ট ফাইল ও টেমপ্লেট। | FileCode2 | `#0284C7 → #075985` |
| 6 | WhatsApp Community | গ্রুপে জয়েন করুন, আটকে গেলে সাহায্য নিন। | Users | `#16A34A → #15803D` |
| 7 | Student Dashboard | নিজের ড্যাশবোর্ডে সব ক্লাস ও রিসোর্স এক জায়গায়। | LayoutDashboard | `#7C3AED → #5B21B6` |
| 8 | নতুন কনটেন্ট আপডেট | টুল বদলালে নতুন ভিডিও ও নোট যুক্ত হবে। | RefreshCw | `#0D9488 → #0F766E` |

### 6.8 Outcome
Title: **কোর্স শেষে আপনার হাতে থাকবে যেসব স্কিল** (check-icon list, 2 columns on desktop)
- নিজের বা ক্লায়েন্টের জন্য প্রফেশনাল Landing Page ও Website বানাতে পারবেন
- Login, Dashboard, Payment সহ নিজের SaaS প্রোডাক্ট বানাতে পারবেন
- Supabase দিয়ে ডেটাবেস ও অথেনটিকেশন ম্যানেজ করতে পারবেন
- লাইভ ডোমেইনে প্রোডাক্ট পাবলিশ করতে পারবেন
- দেশি ও আন্তর্জাতিক ক্লায়েন্টের কাছে সার্ভিস বিক্রি করতে পারবেন
- নিজের SaaS থেকে রিকারিং ইনকামের পথে এগোতে পারবেন

Disclaimer (small): **আয় নির্ভর করে আপনার পরিশ্রম, প্র্যাকটিস ও মার্কেটিংয়ের ওপর। নির্দিষ্ট আয়ের নিশ্চয়তা দেওয়া হয় না।**

### 6.9 Cost
Title: **আয় করতে পারবেন, কিন্তু খরচ কেমন হবে?**
Intro: সবচেয়ে ভালো খবর হলো, শুরুতেই Hosting আর Database আপনি ফ্রি ব্যবহার করতে পারবেন। বেশিরভাগ টুলের Free Tier দিয়েই শুরু করা যায়, প্রথম কয়েকশ ইউজার পর্যন্ত। আপনার শুধু দরকার একটা AI সাবস্ক্রিপশন, যেটা দিয়ে আপনি সফটওয়্যার বানাবেন। মাসিক এই খরচ আপনার এক-দুই দিনের পকেট খরচের কাছাকাছি।
3 stat cards: **ফ্রি** Hosting · **ফ্রি** Database · **~$20/মাস** AI Subscription (from config)
Second paragraph: একসময় একটা সফটওয়্যার বানাতে লাখ লাখ টাকা আর পুরো একটা টিম লাগত। এখন Claude বা Lovable-এর মতো AI টুল দিয়ে একা একজন মানুষই সেই কাজ করে ফেলতে পারেন। দুনিয়া বদলে গেছে, আর এই সুযোগটা এখন আপনার হাতেই।
Note: `*টুলের দাম ও Free Tier সময়ের সাথে বদলাতে পারে।*` · CTA: **"এখনই শুরু করুন"** → `#enroll`

### 6.10 Process
Title: **ধরে নিচ্ছি আপনি কিছুই জানেন না — সমস্যা নেই**
Intro: আপনি জয়েন করলে প্রথম দিন থেকেই আইডিয়া সাজানো, প্রোডাক্ট বানানো ও পাবলিশ করা পর্যন্ত সবকিছু Live Class-এ স্ক্রিন শেয়ার করে দেখানো হবে। এটা থিওরি নয়, সরাসরি হাতে-কলমে কাজ।
4-step stepper (horizontal desktop, vertical mobile, Bangla numerals ১-৪). **The connector line draws itself as the user scrolls** (framer `useScroll` on the list + `useSpring`, `scaleX` desktop / `scaleY` mobile; static full line for reduced motion):
1. **এনরোল করুন** — পেমেন্ট করে TrxID জমা দিন
2. **অ্যাক্সেস পান** — অ্যাডমিন ভেরিফাই করলে অটো ড্যাশবোর্ডে লগইন
3. **কমিউনিটিতে জয়েন করুন** — WhatsApp গ্রুপে যোগ দিন
4. **Live Class করুন ও বানান** — নিজের প্রোডাক্ট লাইভ করুন

Highlight box (gradient border): এটা কোনো সাধারণ কোর্স নয়, এটা একটা **Vibe Coding** প্রোগ্রাম। এখানে আপনি লাইন বাই লাইন কোড মুখস্থ করবেন না। আপনি AI-কে সঠিকভাবে নির্দেশ দিয়ে প্রোডাক্ট বানানো শিখবেন।

**Logo row** (pill chips: original logo + name): **Facebook · YouTube · Canva · Shopify · Airbnb** — then the inspiration line:
Facebook, YouTube, Canva, Shopify, Airbnb, সবই একসময় ছোট আইডিয়া থেকে শুরু হয়েছিল। পরের বড় প্রোডাক্টটা হয়তো আপনার হাত দিয়েই আসবে।

### 6.11 Live Class (`#live-class`)
- Above the title: a chip with the **real Google Meet logo** + "Google Meet".
- Title: **Google Meet-এ সরাসরি Live Class**
- Copy: ভিডিও দেখে একা একা শেখার ঝামেলা নেই। প্রতিটি ক্লাস হবে Google Meet-এ লাইভ, যেখানে আপনি সরাসরি প্রশ্ন করতে পারবেন আর স্ক্রিন শেয়ারে দেখে দেখে কাজ করতে পারবেন।
- Meet-style illustration (CSS): Meet logo + "Vibe Coding — Live", red LIVE badge, shared screen ("Arif is presenting"), 2 participant tiles (active speaker ring), Meet control bar (mic, camera, present, red hang-up). Meet colours `#202124` / `#3C4043`.
- Info list (use `ul/li`, not a broken `dl`):
  - প্ল্যাটফর্ম: **Google Meet** (with Meet logo)
  - ক্লাসের সময়: `CONFIG.liveClass.schedule`
  - ব্যাচ শুরু: `CONFIG.batchStart`
  - রেকর্ডিং: প্রতিটি ক্লাসের পর ড্যাশবোর্ডে
  - প্রশ্নোত্তর: ক্লাসে ও WhatsApp গ্রুপে

### 6.12 Pricing (`#pricing`) — one large centered card, gradient border + glow
```
NextBuildBD Vibe Coding Course
১,৪৯৯৳
একবার পেমেন্ট, পুরো কোর্স
✔ Google Meet-এ Live Class   ✔ সব Class Recording   ✔ Claude Code + Lovable + Supabase
✔ Landing Page, Website, SaaS Build   ✔ Student Dashboard অ্যাক্সেস   ✔ Prompt Library ও Source Code
✔ WhatsApp কমিউনিটি সাপোর্ট   ✔ ভবিষ্যৎ আপডেট
[ এখনই এনরোল করুন — ১,৪৯৯৳ ]   [ WhatsApp-এ প্রশ্ন করুন ]
bKash · Nagad · Rocket
```
- Price from config. No crossed-out price, no "% ছাড়".
- Show "সীমিত আসন — বাকি Nটি" only if `CONFIG.seatsLeft !== null`.
- Show a guarantee box under the card only if `showGuarantee === true` and `guaranteeText` is set.

### 6.13 Instructor
- Badge: **আপনার ইনস্ট্রাক্টর** · Name: **Ashraful Islam (Arif)**
- **Founder & CEO, Abrar IT। ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং ও সফটওয়্যার প্রোডাক্ট নিয়ে কাজ করেন।**
- ক্লায়েন্টের জন্য Lovable + Supabase + React/TypeScript স্ট্যাকে ওয়েবসাইট ও সফটওয়্যার বানানোর বাস্তব অভিজ্ঞতা থেকে এই কোর্স সাজানো।
- Links: Facebook (`facebook.com/ashraf.arif2000`), Website (`abrarit.com`).
- **Photo:** use the provided `public/instructor.jpg`. Crop to **4:5 from the top** (keep the face), export 640×800 `instructor.webp` + optimised `instructor.jpg`; render with `<picture>` (webp + jpg fallback), `object-cover object-top`, gradient border frame + soft glow, `loading="lazy"`, explicit width/height. Fall back to an icon placeholder if it fails to load.

### 6.14 FAQ (`#faq`) — Accordion (first open). Heading: **সাধারণ প্রশ্নোত্তর**
1. **কোডিং না জানলে কি করতে পারব?** — হ্যাঁ। কোর্সটি একদম শূন্য থেকে শুরু। আপনি শিখবেন AI-কে কীভাবে সঠিক নির্দেশ দিয়ে কাজ করাতে হয়।
2. **ক্লাস কীভাবে হবে?** — Google Meet-এ লাইভ ক্লাস হবে। প্রতিটি ক্লাসের রেকর্ডিং ড্যাশবোর্ডে পাবেন।
3. **ক্লাস মিস করলে কী হবে?** — সমস্যা নেই। রেকর্ডিং দেখে নিতে পারবেন, আর গ্রুপে প্রশ্ন করতে পারবেন।
4. **কোর্স ফি কত?** — মাত্র ১,৪৯৯ টাকা, একবারই। কোনো হিডেন চার্জ নেই।
5. **পেমেন্ট কীভাবে করব?** — bKash, Nagad বা Rocket-এ Send Money করে Transaction ID (TrxID) ফর্মে জমা দিন। অ্যাডমিন যাচাই করলে আপনার ড্যাশবোর্ড চালু হয়ে যাবে।
6. **পেমেন্ট ভেরিফাই হতে কতক্ষণ লাগে?** — সাধারণত অল্প সময়ে। দেরি হলে WhatsApp-এ মেসেজ দিন।
7. **কোর্সে কত খরচ করে শুরু করা যায়?** — Hosting ও Database ফ্রি টায়ারে শুরু করা যায়। শুধু একটি AI সাবস্ক্রিপশন (প্রায় $20/মাস) দরকার হতে পারে।
8. **কোর্স করলেই কি আয় নিশ্চিত?** — আয়ের নিশ্চয়তা কেউ দিতে পারে না। আমরা স্কিল ও ক্লায়েন্ট পাওয়ার পদ্ধতি শেখাই, ফলাফল আপনার প্র্যাকটিস ও কাজের ওপর নির্ভর করে।
9. **ল্যাপটপ না থাকলে?** — একটি ল্যাপটপ/ডেস্কটপ ও ইন্টারনেট থাকলে সবচেয়ে ভালো। মোবাইলে সীমিতভাবে সম্ভব।
10. **ব্যবসার জন্য নিজের সফটওয়্যার বানাতে চাই, এই কোর্স কি কাজে লাগবে?** — অবশ্যই। কোর্সের একটা বড় অংশ জুড়েই আছে নিজের ব্যবসার ওয়েবসাইট ও সফটওয়্যার বানানো।

(Price, platform and AI cost in answers come from config.)

### 6.15 Enroll (`#enroll`)
Title: **আজই আপনার যাত্রা শুরু করুন**

**Left card "পেমেন্ট নির্দেশনা"** (numbered steps ১-৫):
1. নিচের যেকোনো নাম্বারে **১,৪৯৯৳ Send Money** করুন: — rows for **bKash**, **Nagad**, **Rocket**, each showing the brand colour bar (`#E2136E`, `#F6921E`, `#8C3494`), the number formatted **01719-686459**, the type, and a **Copy** button (copies digits only; label changes to "কপি হয়েছে" with `aria-live`; clipboard API with `execCommand` fallback).
2. পেমেন্ট শেষে SMS-এ পাওয়া **Transaction ID (TrxID)** কপি করুন
3. ডানের ফর্মে তথ্য ও TrxID জমা দিন (on mobile the form is below, so show "নিচের" instead of "ডানের")
4. অ্যাডমিন যাচাই করলে অটো আপনার **Student Dashboard** চালু হবে
5. সেখান থেকে **WhatsApp গ্রুপে জয়েন** করুন

**Right card "এনরোল ফর্ম"** (all required, `noValidate` + custom Bangla errors, `aria-invalid` + `aria-describedby`, focus the first invalid field on submit):
- পূর্ণ নাম (≥ 2 chars)
- মোবাইল নম্বর — BD format `^01[3-9]\d{8}$`. Normalise first: Bangla digits → ASCII, strip spaces/dashes, strip `+88`/`88` prefix.
- ইমেইল
- পেমেন্ট মাধ্যম — radio cards bKash / Nagad / Rocket
- যে নম্বর থেকে পাঠিয়েছেন — BD format (Rocket: allow one extra check digit, `^01[3-9]\d{8}\d?$`)
- Transaction ID (TrxID) — uppercase, `^[A-Z0-9]{6,20}$`
- Submit: **"পেমেন্ট জমা দিন"**
- Success state (focus moves to it, `role="status"`): **আপনার তথ্য জমা হয়েছে। যাচাই শেষে ড্যাশবোর্ড চালু হবে।** + button "আরেকটি জমা দিন".
- For now submit only `console.log`s the payload `{ full_name, phone, email, payment_method, sender_number, trx_id, amount, status: "pending", submitted_at }` and shows success. Leave **`// TODO: Supabase insert into enrollments`** right there.

Below both cards: **"পেমেন্টে সমস্যা? সরাসরি মেসেজ করুন"** + green WhatsApp button.

### 6.16 Final CTA — full-width `--gradient-cta` section, white text, subtle dot pattern
**আপনার আইডিয়াটা অপেক্ষা করছে।** / আজ শুরু করলে কয়েক সপ্তাহ পরে আপনার হাতে থাকবে নিজের বানানো লাইভ প্রোডাক্ট।
Buttons: white **"১,৪৯৯৳-এ এনরোল করুন"** · outline-white **"WhatsApp-এ কথা বলুন"**

### 6.17 Footer
Logo + tagline **Learn. Build. Launch.** · Quick links: কোর্স সম্পর্কে, কারিকুলাম, মূল্য, FAQ · যোগাযোগ: WhatsApp `01719-686459`, Email `asrafulislam2000@gmail.com`, Facebook · `© 2026 NextBuildBD. সর্বস্বত্ব সংরক্ষিত।` (English digits for 2026, as written) · Privacy Policy, Terms → Dialog with placeholder text "এই পেজটি শীঘ্রই যুক্ত করা হবে।" + email link.

### 6.18 Floating elements
- **WhatsApp FAB** bottom-right, green `#11843F` circle, wa.me link, hover/focus tooltip **"মেসেজ করুন"**, wrapped in `<aside aria-label="দ্রুত যোগাযোগ">`. On mobile it sits **above** the sticky bar (bottom ≈ 76px + safe-area).
- **Mobile sticky bar** (< 768px): left `১,৪৯৯৳` + "একবার পেমেন্ট, পুরো কোর্স", right **"এনরোল"** button. Hidden at the very top and while `#enroll` is on screen (IntersectionObserver). When hidden: `aria-hidden`, not focusable.

---

## 7. Animations & premium scrolling

### 7.1 Hero showcase (right side) — `HeroShowcase.tsx`
A premium, animated "AI builds a SaaS" demo. Plain React state + CSS transitions (no framer-motion in the first chunk). Wrapper is `role="img"` with a Bangla `aria-label`; the inner mock is `aria-hidden`.

Layout:
- **Browser window** (dark, always dark-styled): traffic-light dots, URL bar (`localhost:5173/dashboard` → `https://yoursaas.vercel.app` after deploy), a **Deploy** button in the title bar. Body: sidebar (hidden < 420px; active item follows the tab) + main: "Dashboard" title, tabs **Overview | Revenue | Users**, 3 stat cards (Orders, Users, Growth) with **count-up numbers**, a chart card with **7 animated bars + an SVG line that draws itself** (`pathLength=1`, `stroke-dashoffset` keyframe; re-keyed per tab), skeleton/shimmer before build, a "Building your app…" progress overlay.
- **Claude Code editor card** overlapping the window's bottom-left: header with the Claude logo + `claude — ~/my-saas` and a **Run** button (bg `#B4532F` so white text passes AA). It **types** (syntax-coloured, line numbers, blinking caret):
  ```
  ❯ Build a SaaS dashboard with Supabase auth
  1  const { data } = await supabase
  2    .from("orders")
  3    .select("month, total");
  4  return <SalesChart data={data} />
  ```
  After build, a footer appears: "✓ Built · Supabase connected" + Supabase logo.
- **Floating toast** after deploy: Vercel logo (dark mark on white tile) + "Deployed / Live on Vercel".
- **Animated mouse cursor** (white arrow SVG with shadow) that glides between real targets (positions measured from refs with `getBoundingClientRect`) and **clicks** (press scale + ripple ring; the clicked button scales down).

Loop timeline:
1. Reset → type the prompt + code (2 chars / ~26–34ms).
2. Cursor → **Run** → click → "Building…" (≈1.1s) → bars grow, line draws, counters count up.
3. Cursor → **Revenue** tab → click → new data animates.
4. Cursor → **Users** tab → click → new data.
5. Cursor → **Deploy** → click → spinner → "Live" + toast. Pause, hide cursor, restart.

Rules:
- Start only after `window.load` + `requestIdleCallback` (+ ~1.5s) so it never competes with first paint.
- Pause while off-screen (IntersectionObserver) or the tab is hidden.
- Keep typing state inside the editor component so each tick re-renders only the editor.
- Reduced motion: no cursor, no loop — render the finished state (code typed, dashboard built, deployed).
- Desktop only (≥ 1024px): gentle scroll parallax (`translateY(scrollY * -0.06)`) and a 3D tilt that follows the mouse (±5–6°). No parallax on stacked layouts (it opens a gap).
- No horizontal overflow at 360px (keep floating parts inside the container).

### 7.2 Premium scrolling
- **Lenis smooth scrolling** (`duration ≈ 1.15`, expo-out easing, `autoRaf`), loaded in the lazy below-the-fold chunk; disabled for reduced motion; touch stays native. Add `html.lenis { scroll-behavior: auto; }` (native smooth-scroll fights Lenis) and `data-lenis-prevent` on dialog content.
- **In-page anchor clicks: handle them yourself** (Lenis' built-in `anchors` option mis-positions repeated jumps). On click of `a[href^="#"]`: `preventDefault`, wait one frame (a closing mobile menu changes the header height), compute `target.top + scrollY − headerHeight − 8`, `lenis.scrollTo(y, { onComplete })`, and in `onComplete` re-measure and correct (up to 4 times) because `content-visibility` sections change height as they render. `history.replaceState` the hash.
- **Reading progress bar:** fixed 3px gradient bar at the top, `scaleX` from `useScroll().scrollYProgress` through `useSpring`.
- **Scroll reveal** (`Reveal` component, framer `whileInView`, `once`, margin `-80px`): opacity 0→1, y 28→0, scale 0.985→1, ease `[0.22,1,0.36,1]`, 0.8s, small stagger per grid item. Add `filter: blur(6px)→0` **only on ≥ 1024px** (blur is expensive on phones). Reduced motion: plain quick fade. Support `as="li"` so lists stay valid HTML.
- Process stepper line draws on scroll (6.10). Cards lift on hover (disabled for reduced motion).
- Global `@media (prefers-reduced-motion: reduce)`: near-zero animation/transition durations, `scroll-behavior: auto`.

---

## 8. Images & generated assets
From `public/logo.png` (square, navy background):
- `public/logo-mark.png` + `logo-mark.webp` (≈80px): crop the "N" mark only (no wordmark).
- `favicon.ico` (16/32/48), `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `site.webmanifest` (theme/background `#050816`).
- `og-image.png` 1200×630 (logo centred on `#050816`).
- `robots.txt`.
- Instructor photo per 6.13.

---

## 9. Brand logos (original colours) — `src/assets/logos/*.svg`

Install in a **separate scratch folder** (not as project deps) and copy the SVGs out:
- `npm i @iconify-json/logos` → read `icons.json`, wrap each `body` in `<svg xmlns viewBox="0 0 {w} {h}">`:
  `claude-icon` → claude.svg · `lovable-icon` → lovable.svg · `supabase-icon` · `react` · `typescript-icon` · `github-icon` · `vercel-icon` · `tailwindcss-icon` · `facebook` · `youtube-icon` · `shopify` · `airbnb-icon`
- **Dark-theme variants:** GitHub and Vercel marks are black → create `github-dark.svg` / `vercel-dark.svg` with fill `#ffffff`; show via `dark:hidden` / `hidden dark:block`. Add an `onLight` prop to force the dark mark on white tiles inside the dark theme.
- **Canva:** `npm i devicon` → `icons/canva/canva-original.svg`, add a white `<circle cx="64" cy="64" r="60" fill="#fff"/>` behind it so the cut-out wordmark reads white in both themes.
- **Google Meet** (official flat 2020 mark) — save exactly as `google-meet.svg`:
  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.5 72"><path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"/><path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"/><path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"/><path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/><path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"/><path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"/></svg>
  ```
- Reject any SVG containing `<script`, `on*=` handlers, `foreignObject` or external `href`s.
- Render a contact sheet of all logos on white and on `#0C1030` and check each one visually.
- `BrandLogo` component: `<img>` (decorative `alt=""` + `aria-hidden` because the name is always written next to it), `loading="lazy"`, explicit size.

---

## 10. SEO & meta (`index.html`, `lang="bn"`)
```html
<title>NextBuildBD — Claude Code, Lovable ও Supabase দিয়ে Website ও SaaS বানানো শিখুন</title>
<meta name="description" content="Google Meet-এ Live Class। Claude Code, Lovable ও Supabase দিয়ে Landing Page, Website ও SaaS বানানো শিখুন মাত্র ১,৪৯৯ টাকায়।" />
<meta property="og:title" content="NextBuildBD — Learn. Build. Launch." />
<meta property="og:image" content="{site.url}/logo.png" />
<meta name="theme-color" content="#050816" />
```
Plus canonical, `og:type/locale(bn_BD)/description/url`, Twitter card (`og-image.png`), favicons, manifest.
**JSON-LD `Course`** (name, description, `inLanguage: "bn"`, provider Organization + sameAs Facebook, `offers` {price 1499, priceCurrency BDT, url `#enroll`}, `hasCourseInstance` {courseMode Online, VirtualLocation "Google Meet", instructor}).
Fill the price/URL/platform placeholders from `config.ts` at build time with a small Vite plugin (`transformIndexHtml`) — no hardcoded values.

---

## 11. Accessibility rules
- `lang="bn"`, one `h1`, logical `h2/h3`, landmarks (header, nav with Bangla `aria-label`, main, aside for the FAB, footer).
- Visible `:focus-visible` outline (3px `--brand-strong`) on everything interactive; 44px minimum touch targets.
- Icon-only buttons have Bangla `aria-label`s. Decorative SVG/images `aria-hidden`.
- Lists inside `ul/ol` must contain only `li` (use `Reveal as="li"`).
- Contrast: check every text colour in both themes (white on brand gradient → use `--gradient-cta`; WhatsApp `#11843F`; Run button `#B4532F`). Decorative faint numbers via CSS `content`, not text.
- Run axe-core in both themes at 360 and 1280 → **0 violations**.

---

## 12. Performance rules (these are what keep mobile Lighthouse ≥ 90)
1. **Code-split:** first chunk = Header + Hero + TrustStrip + WhatsApp FAB only (no framer-motion there; hero uses CSS animations). Everything after the hero → `React.lazy` `BelowFold` chunk (with `LazyMotion` + `MotionConfig reducedMotion="user"` + Lenis); Footer → its own lazy chunk. Suspense fallback `min-h-screen`.
2. **Stage the below-the-fold mount:** first batch (Audience, Curriculum, Tools) immediately, the rest on `requestIdleCallback` (timeout 1.5s). If the user clicks an anchor whose target isn't mounted yet, mount everything and then scroll. Deep links (`/#enroll`) scroll after mount and re-align for a few frames and after `document.fonts.ready`.
3. **`content-visibility: auto; contain-intrinsic-size: auto 900px;`** on every `.section` — biggest single win (Bangla text layout is expensive).
4. LCP (hero H1) never animates from opacity 0. Logo mark as tiny WebP + `preload`.
5. Fonts non-render-blocking (section 2). Images lazy with width/height. Hero demo starts after load + idle.
6. Blur filters only on desktop.

---

## 13. File structure
```
index.html                (no-flash theme script, SEO, JSON-LD placeholder, fonts)
vite.config.ts            (@ alias + SEO-from-config plugin)
tailwind.config.ts  postcss.config.js  eslint.config.js  tsconfig*.json  components.json
public/   logo.png logo-mark.(png|webp) favicon.ico favicon-32.png apple-touch-icon.png icon-192.png
          og-image.png site.webmanifest robots.txt instructor.(webp|jpg)
src/
  main.tsx  App.tsx  index.css  config.ts  vite-env.d.ts
  lib/      utils.ts  useTheme.ts  validation.ts
  assets/logos/*.svg
  components/
    ui/       button.tsx accordion.tsx dialog.tsx
    shared/   Logo.tsx BrandLogo.tsx BrandIcons.tsx (WhatsApp/Facebook glyphs) Reveal.tsx SectionHeading.tsx SmoothScroll.tsx
    Header.tsx ThemeToggle.tsx Hero.tsx HeroShowcase.tsx TrustStrip.tsx BelowFold.tsx
    Audience.tsx Curriculum.tsx Tools.tsx Facilities.tsx Outcome.tsx CostSection.tsx Process.tsx
    LiveClass.tsx Pricing.tsx Instructor.tsx Faq.tsx Enroll.tsx FinalCta.tsx Footer.tsx
    WhatsAppFab.tsx StickyEnrollBar.tsx
README.md  (run commands, where things live, TODO list)
```

---

## 14. Commands
`npm run dev` · `npm run lint` (ESLint 9 flat config, typescript-eslint, react-hooks, react-refresh) · `npm run build` (`tsc -b && vite build`) · `npm run preview`

---

## 15. Verification (do all of this, with Playwright + the preinstalled/available Chromium)
1. **Screenshots:** full page, dark + light, at 360 / 768 / 1280. Scroll through first so reveals trigger. Review each section visually.
2. **Overflow:** `document.documentElement.scrollWidth === innerWidth` at every width/theme; list any element sticking out.
3. **Hero demo:** capture frames over ~15s — typing, Run click, building, charts, tab clicks, deploy toast.
4. **Interactions:** theme toggle + persistence after reload; theme works with `localStorage` blocked (no errors); Copy buttons copy `01719686459`; empty submit shows 6 Bangla errors and focuses the first field; invalid phone rejected; `+880 1712-345678` and Bangla digits accepted; successful submit logs the payload and shows the success text.
5. **Navigation:** every header/mobile-menu link and CTA lands its section ~8px below the header; deep link `/#enroll` lands correctly; sticky bar hidden at top and at `#enroll`, visible in between.
6. **axe-core:** 0 violations in both themes at 360 and 1280.
7. **Lighthouse** (production build via `vite preview`), run 3×: mobile Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100; desktop Performance ≥ 95. If Performance drops, inspect `mainthread-work-breakdown` and `long-tasks` and apply section 12 — don't guess.

---

## 16. Build order
1. Scaffold, tokens, Tailwind map, theme (no-flash) + toggle, config, utils, assets & logos
2. Header, Hero (+ HeroShowcase), WhatsApp FAB, sticky bar
3. Remaining sections top → bottom (BelowFold split, Reveal, SmoothScroll)
4. Enroll form + validation
5. Responsive + dark/light visual QA, SEO/JSON-LD, accessibility, performance (section 15)

---

## 17. Acceptance checklist
- [ ] Dark & Light mode work, toggle present, no flash on load, choice persisted (try/catch)
- [ ] Brand colours (navy + indigo/violet gradient) consistent in both modes; logo in header & footer; favicon from logo
- [ ] Only **১,৪৯৯৳**, one plan, no fake old price/discount
- [ ] Google Meet (real logo) clearly shown in Hero, Facilities, Live Class, Pricing, FAQ
- [ ] Hero right side: animated code typing, building, animated charts/counters, cursor clicking Run/tabs/Deploy, deploy toast
- [ ] Tools: original logos of Claude, Lovable, Supabase, React, TypeScript, GitHub, Vercel, Tailwind CSS — no bKash/WhatsApp
- [ ] Facilities: premium gradient icon tiles
- [ ] Facebook, YouTube, Canva, Shopify, Airbnb logos shown with the inspiration line
- [ ] Instructor photo shown (4:5, face visible)
- [ ] Payment numbers 01719-686459 with working Copy buttons
- [ ] Premium scrolling: Lenis smooth scroll, progress bar, scroll reveals, scroll-drawn stepper
- [ ] "খরচ কেমন হবে" section present
- [ ] All CTAs → `#enroll`; WhatsApp links work
- [ ] Payment flow explained (Send Money → TrxID → Admin verify → Dashboard → WhatsApp group)
- [ ] Form validation (BD phone, TrxID required), success state, `// TODO: Supabase insert into enrollments`
- [ ] No horizontal scroll at 360px; FAB never covers the sticky bar
- [ ] No fake testimonials, numbers or income promises; disclaimer present
- [ ] All TODO values marked in `config.ts`; prices/links only from config
- [ ] SEO meta, `lang="bn"`, JSON-LD Course
- [ ] axe 0 violations; Lighthouse mobile ≥ 90 / A11y 100 / BP 100 / SEO 100
- [ ] Reduced motion respected everywhere

---

## 18. Final report (reply format)
1. What was built (short).
2. Acceptance checklist with pass/fail per item.
3. Lighthouse + axe numbers.
4. TODO values still to fill in `config.ts` (Rocket number confirmation, WhatsApp group link, class schedule, batch date, production domain, optional seats/guarantee).
5. Anything you could not do, and every ambiguity you resolved (and how).

---

## Phase 2 (later, separate prompt — not now)
Supabase Auth, `enrollments` table, admin payment-verification panel, Student Dashboard (class list, Meet link, recordings, WhatsApp group button), auto-access when verified.
