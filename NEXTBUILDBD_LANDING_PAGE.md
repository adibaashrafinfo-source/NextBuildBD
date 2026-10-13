# NextBuildBD — Course Landing Page (Claude Code Build Spec)

> এই ফাইলটি Claude Code-কে দিন। প্রথমে এটা পুরোটা পড়তে বলুন, তারপর build করতে বলুন।
> Page copy বাংলায়। Code, class name, file name ইংরেজিতে।

---

## 0. Build Instructions (Claude Code-এর জন্য)

**Goal:** একটি single-page, conversion-focused landing page বানানো, যেখানে Dark ও Light দুই মোড থাকবে।

**Stack:**
- React + TypeScript + Vite
- Tailwind CSS (CSS variables দিয়ে theme)
- shadcn/ui (Accordion, Dialog, Button)
- framer-motion (subtle scroll reveal)
- lucide-react (icons)
- Font: `Hind Siliguri` (বাংলা) + `Plus Jakarta Sans` (English/number), Google Fonts

**Logo:** `public/logo.png` (already provided). Header-এ logo ব্যবহার করুন। Dark mode-এ logo যেভাবে আছে সেভাবেই। Light mode-এ logo-র dark background সরানো transparent/SVG version না থাকলে header-এ logo mark-এর পাশে text "NextBuildBD" (Next Build = dark navy, BD = indigo) ব্যবহার করুন।

**Rules:**
1. Mobile-first (Bangladesh-এর বেশিরভাগ user mobile)। 360px-এ সব ঠিক থাকতে হবে।
2. Lighthouse Performance 90+ লক্ষ্য। Image lazy-load, font `display=swap`।
3. সব CTA button `#enroll` section-এ scroll করবে।
4. Theme toggle header-এ থাকবে। Default = system preference, user choice `localStorage`-এ (try/catch সহ) save হবে।
5. সব সংখ্যা/দাম/লিংক নিচের `config.ts` থেকে আসবে, hardcode নয়।
6. কোনো fake testimonial, fake student সংখ্যা বা fake income claim ব্যবহার করবেন না (Section 12 দেখুন)।

---

## 1. Brand & Design Tokens

লোগো থেকে নেওয়া রঙ: গাঢ় navy background, indigo-blue থেকে violet gradient।

### 1.1 Color tokens (`src/index.css`)

```css
:root {
  /* LIGHT MODE */
  --bg: #F7F8FF;
  --bg-elevated: #FFFFFF;
  --bg-soft: #EEF0FF;
  --text: #0B0D2E;
  --text-muted: #4B5078;
  --border: #DDE0F5;

  --brand: #4338F0;          /* logo "BD" indigo */
  --brand-strong: #2E24C9;
  --brand-soft: #E4E6FF;
  --accent: #8B6CFF;         /* violet */
  --sky: #5B8CFF;            /* blue highlight */
  --lavender: #C9B8FF;

  --gradient-brand: linear-gradient(135deg, #5B8CFF 0%, #4338F0 55%, #8B6CFF 100%);
  --gradient-hero-glow: radial-gradient(60% 50% at 50% 0%, rgba(67,56,240,.16), transparent 70%);

  --success: #12A150;
  --warning: #F5A524;
  --shadow-card: 0 10px 30px -12px rgba(67,56,240,.25);
}

:root[data-theme="dark"] {
  /* DARK MODE (logo background feel) */
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
}
```

Tailwind config-এ এই variable গুলো `bg-bg`, `text-text`, `border-border`, `bg-brand` ইত্যাদি নামে map করুন।

### 1.2 Style direction
- Look: premium, modern tech। Rounded corners `16px–24px`।
- Primary button: `--gradient-brand` background, সাদা text, hover-এ হালকা glow (`box-shadow` brand color)।
- Secondary button: transparent + `--border` outline।
- Card: `--bg-elevated`, `1px solid var(--border)`, `--shadow-card`।
- Hero background: `--gradient-hero-glow` + খুব হালকা grid/dot pattern।
- Section spacing: desktop `96px`, mobile `64px`।
- Animation: fade-up on scroll (y: 16px → 0, 0.5s)। `prefers-reduced-motion` সম্মান করুন।
- Contrast: দুই মোডেই WCAG AA।

---

## 2. Config (`src/config.ts`)

```ts
export const CONFIG = {
  brand: "NextBuildBD",
  tagline: "Learn. Build. Launch.",
  price: 1499,
  currency: "৳",
  whatsappNumber: "8801719686459",            // TODO: owner confirm
  whatsappGroupLink: "https://chat.whatsapp.com/XXXX", // TODO: replace
  whatsappMessage: "আসসালামু আলাইকুম, কোর্স সম্পর্কে জানতে চাই।",
  payment: {
    bkash:  { number: "01XXXXXXXXX", type: "Personal / Send Money" }, // TODO
    nagad:  { number: "01XXXXXXXXX", type: "Personal / Send Money" }, // TODO
    rocket: { number: "01XXXXXXXXXX", type: "Personal / Send Money" } // TODO
  },
  liveClass: { platform: "Google Meet", schedule: "TODO: দিন ও সময়" },
  batchStart: "TODO: তারিখ",
  seatsLeft: null as number | null,           // null হলে seat counter দেখাবে না
  showGuarantee: false                         // owner সিদ্ধান্ত না নিলে false
};
```

---

## 3. Page Structure (উপর থেকে নিচে)

1. Header (sticky)
2. Hero
3. Trust strip
4. এই কোর্স কাদের জন্য
5. আপনি কী শিখবেন (Curriculum)
6. Tools you'll master
7. কোর্স সুবিধা (Facilities)
8. কোর্স শেষে আপনি কী করতে পারবেন (Outcome / Income)
9. খরচ কেমন হবে? (Cost section)
10. কীভাবে শুরু করবেন (Process)
11. Live Class (Google Meet)
12. Pricing (একটাই প্ল্যান — ১,৪৯৯৳)
13. Instructor
14. FAQ
15. Enroll section (`#enroll`)
16. Final CTA
17. Footer
18. Floating WhatsApp button + Mobile sticky Enroll bar

---

## 4. Header

- বামে: Logo (`public/logo.png`, height 36–40px) + "NextBuildBD"।
- মাঝে (desktop): `কোর্স সম্পর্কে` · `কারিকুলাম` · `সুবিধা` · `মূল্য` · `FAQ` (smooth scroll anchor)।
- ডানে: Theme toggle (sun/moon icon), WhatsApp icon button, primary button **"এনরোল করুন"**।
- Mobile: hamburger menu, এনরোল button সবসময় দৃশ্যমান।
- Scroll করলে header-এ `backdrop-blur` + border bottom।

---

## 5. Hero Section

**Badge (ছোট pill):** `🔴 Live Class • Google Meet • নতুন ব্যাচ`

**Headline (H1):**
> Claude Code, Lovable আর Supabase দিয়ে নিজেই বানান ওয়েবসাইট ও SaaS — কোডিং না জেনেও।

**Sub-headline:**
> আইডিয়া থেকে লাইভ প্রোডাক্ট পর্যন্ত পুরো পথ আমরা হাতে-কলমে দেখাব। শিখুন Vibe Coding, বানান Landing Page, Website ও SaaS, আর দেশ-বিদেশের ক্লায়েন্টের কাছে সেটা বিক্রি করে আয় শুরু করুন।

**CTA:**
- Primary: **"মাত্র ১,৪৯৯৳-এ এনরোল করুন"** → `#enroll`
- Secondary: **"WhatsApp-এ প্রশ্ন করুন"** → `wa.me/{number}?text={message}`

**Hero-র নিচে ৪টি ছোট highlight (icon সহ):**
- 🎥 Google Meet-এ Live Class
- 🛠 Claude Code + Lovable + Supabase
- 💬 WhatsApp কমিউনিটি সাপোর্ট
- 💳 bKash / Nagad / Rocket-এ সহজ পেমেন্ট

**Visual (ডানে/নিচে):** একটি browser-window mockup, ভেতরে dark UI-এর SaaS dashboard illustration (CSS/SVG দিয়ে আঁকা, brand gradient সহ)। বাইরের stock image লাগবে না।

---

## 6. Trust Strip

একটি লাইনে চার আইটেম (কোনো বানানো সংখ্যা নয়, শুধু সত্যি তথ্য):
- `শূন্য থেকে শুরু` — Beginner Friendly
- `Live + Recorded` — মিস করলেও সমস্যা নেই
- `Real Project` — হাতে-কলমে বানানো
- `WhatsApp Support` — আটকে গেলে সাহায্য

---

## 7. এই কোর্স কাদের জন্য

শিরোনাম: **"আপনি যদি এদের একজন হন, এই কোর্স আপনার জন্য"**

তিনটি card:

**১. স্টুডেন্ট ও নতুন শিক্ষার্থী**
কোডিং জানেন না? সমস্যা নেই। AI দিয়ে কাজ করে এমন একটি হাই-ডিমান্ড স্কিল শিখে নিজের ক্যারিয়ার শুরু করুন।

**২. ব্যবসায়ী ও বিজনেস ওনার**
নিজের ব্যবসার ওয়েবসাইট, অর্ডার সিস্টেম বা সফটওয়্যার নিজেই বানান। ডেভেলপারের পেছনে লাখ টাকা খরচ না করে নিজের হাতে নিয়ন্ত্রণ নিন।

**৩. ফ্রিল্যান্সার ও এন্ট্রাপ্রেনিউর**
ক্লায়েন্টের জন্য Landing Page, Website ও SaaS বানিয়ে দেশি ও আন্তর্জাতিক মার্কেটে সার্ভিস বিক্রি করুন, অথবা নিজের প্রোডাক্ট লঞ্চ করুন।

---

## 8. Curriculum — আপনি কী শিখবেন

শিরোনাম: **"আইডিয়া থেকে লাইভ প্রোডাক্ট — ধাপে ধাপে"**
Accordion বা numbered timeline আকারে ৮টি মডিউল:

**Module 1 — Vibe Coding পরিচিতি ও Setup**
- Vibe Coding কী, আর কেন এটা গেম চেঞ্জার
- Claude Code install ও সেটআপ
- Lovable account ও workspace সেটআপ
- Supabase, GitHub, Vercel account সেটআপ
- ভালো Prompt লেখার কৌশল

**Module 2 — Landing Page Design**
- Conversion-focused landing page-এর গঠন
- Lovable ও Claude Code দিয়ে ডিজাইন
- Dark/Light mode, Responsive, Animation
- নিজের ব্র্যান্ড অনুযায়ী ডিজাইন

**Module 3 — Business Website Build**
- Corporate / Portfolio / E-commerce সাইট
- SEO বেসিক ও দ্রুত লোডিং
- Domain কেনা ও Hosting সংযোগ
- ক্লায়েন্ট ওয়ার্কের জন্য প্রফেশনাল ডেলিভারি

**Module 4 — Supabase Database Management**
- Table, Relation, Schema ডিজাইন
- Authentication (Login/Signup)
- Row Level Security (RLS) দিয়ে ডেটা সুরক্ষা
- Storage, Edge Functions

**Module 5 — SaaS Product Build**
- SaaS আইডিয়া যাচাই
- Student/User Dashboard ও Admin Dashboard
- Role-based access
- Subscription ও Plan লজিক

**Module 6 — Bangladesh Payment ও Automation**
- bKash / Nagad / Rocket (Send Money + TrxID) পেমেন্ট ফ্লো
- Admin ভেরিফাই করলে অটো অ্যাক্সেস চালু
- WhatsApp গ্রুপ লিংক ও ডাইরেক্ট মেসেজ ইন্টিগ্রেশন
- SMS/Email নোটিফিকেশন

**Module 7 — Deploy, Debug ও Maintenance**
- GitHub ও Vercel দিয়ে ডিপ্লয়
- Error debug করার পদ্ধতি
- Security checklist ও Backup
- প্রোডাক্ট আপডেট ও ভার্সনিং

**Module 8 — আয় ও ক্লায়েন্ট (Monetization)**
- Local ও International ক্লায়েন্ট কোথায় পাবেন
- Fiverr, Upwork, LinkedIn, Facebook-এ প্রোফাইল সাজানো
- সার্ভিস প্যাকেজ ও প্রাইসিং
- নিজের SaaS বিক্রির মডেল: Subscription, One-time, Lead-gen
- Portfolio তৈরি ও ক্লায়েন্ট পিচ

---

## 9. Tools Section

শিরোনাম: **"যে টুলগুলো আপনি দক্ষভাবে চালাতে শিখবেন"**
Logo grid (icon/text pill): `Claude Code` · `Lovable` · `Supabase` · `React` · `TypeScript` · `GitHub` · `Vercel` · `Tailwind CSS` · `bKash` · `WhatsApp`

---

## 10. কোর্স সুবিধা (Facilities)

শিরোনাম: **"কোর্সে আপনি যা যা পাচ্ছেন"**
৮টি feature card:

1. **Google Meet-এ Live Class** — সরাসরি প্রশ্ন করুন, স্ক্রিন শেয়ারে দেখে দেখে শিখুন।
2. **Class Recording** — মিস হলে বা আবার দেখতে চাইলে রেকর্ডিং দেখুন।
3. **Real Project Walkthrough** — Landing Page থেকে পূর্ণাঙ্গ LMS/SaaS বানানো।
4. **Ready Prompt Library** — Claude Code ও Lovable-এর প্রম্পট, সরাসরি কপি করে কাজে লাগান।
5. **Source Code ও Template** — প্রজেক্ট ফাইল ও টেমপ্লেট।
6. **WhatsApp Community** — গ্রুপে জয়েন করুন, আটকে গেলে সাহায্য নিন।
7. **Student Dashboard** — নিজের ড্যাশবোর্ডে সব ক্লাস ও রিসোর্স এক জায়গায়।
8. **নতুন কনটেন্ট আপডেট** — টুল বদলালে নতুন ভিডিও ও নোট যুক্ত হবে।

---

## 11. কোর্স শেষে আপনি কী করতে পারবেন (Outcome)

শিরোনাম: **"কোর্স শেষে আপনার হাতে থাকবে যেসব স্কিল"**

- নিজের বা ক্লায়েন্টের জন্য প্রফেশনাল Landing Page ও Website বানাতে পারবেন
- Login, Dashboard, Payment সহ নিজের SaaS প্রোডাক্ট বানাতে পারবেন
- Supabase দিয়ে ডেটাবেস ও অথেনটিকেশন ম্যানেজ করতে পারবেন
- লাইভ ডোমেইনে প্রোডাক্ট পাবলিশ করতে পারবেন
- দেশি ও আন্তর্জাতিক ক্লায়েন্টের কাছে সার্ভিস বিক্রি করতে পারবেন
- নিজের SaaS থেকে রিকারিং ইনকামের পথে এগোতে পারবেন

> **Disclaimer line (ছোট অক্ষরে):** আয় নির্ভর করে আপনার পরিশ্রম, প্র্যাকটিস ও মার্কেটিংয়ের ওপর। নির্দিষ্ট আয়ের নিশ্চয়তা দেওয়া হয় না।

---

## 12. খরচ কেমন হবে? (Cost Section)

শিরোনাম: **"আয় করতে পারবেন, কিন্তু খরচ কেমন হবে?"**

**Intro paragraph:**
> সবচেয়ে ভালো খবর হলো, শুরুতেই Hosting আর Database আপনি ফ্রি ব্যবহার করতে পারবেন। বেশিরভাগ টুলের Free Tier দিয়েই শুরু করা যায়, প্রথম কয়েকশ ইউজার পর্যন্ত। আপনার শুধু দরকার একটা AI সাবস্ক্রিপশন, যেটা দিয়ে আপনি সফটওয়্যার বানাবেন। মাসিক এই খরচ আপনার এক-দুই দিনের পকেট খরচের কাছাকাছি।

**তিনটি stat card:**
| | |
|---|---|
| **ফ্রি** | Hosting |
| **ফ্রি** | Database |
| **~$20/মাস** | AI Subscription |

**দ্বিতীয় paragraph:**
> একসময় একটা সফটওয়্যার বানাতে লাখ লাখ টাকা আর পুরো একটা টিম লাগত। এখন Claude বা Lovable-এর মতো AI টুল দিয়ে একা একজন মানুষই সেই কাজ করে ফেলতে পারেন। দুনিয়া বদলে গেছে, আর এই সুযোগটা এখন আপনার হাতেই।

**Small note:** `*টুলের দাম ও Free Tier সময়ের সাথে বদলাতে পারে।*`

**CTA:** "এখনই শুরু করুন" → `#enroll`

---

## 13. কীভাবে শুরু করবেন (Process)

শিরোনাম: **"ধরে নিচ্ছি আপনি কিছুই জানেন না — সমস্যা নেই"**

> আপনি জয়েন করলে প্রথম দিন থেকেই আইডিয়া সাজানো, প্রোডাক্ট বানানো ও পাবলিশ করা পর্যন্ত সবকিছু Live Class-এ স্ক্রিন শেয়ার করে দেখানো হবে। এটা থিওরি নয়, সরাসরি হাতে-কলমে কাজ।

**৪টি ধাপ (horizontal stepper, mobile-এ vertical):**
1. **এনরোল করুন** — পেমেন্ট করে TrxID জমা দিন
2. **অ্যাক্সেস পান** — অ্যাডমিন ভেরিফাই করলে অটো ড্যাশবোর্ডে লগইন
3. **কমিউনিটিতে জয়েন করুন** — WhatsApp গ্রুপে যোগ দিন
4. **Live Class করুন ও বানান** — নিজের প্রোডাক্ট লাইভ করুন

**Vibe Coding ব্যাখ্যা (highlight box):**
> এটা কোনো সাধারণ কোর্স নয়, এটা একটা **Vibe Coding** প্রোগ্রাম। এখানে আপনি লাইন বাই লাইন কোড মুখস্থ করবেন না। আপনি AI-কে সঠিকভাবে নির্দেশ দিয়ে প্রোডাক্ট বানানো শিখবেন।

**Inspiration line:**
> Facebook, YouTube, Canva, Shopify, Airbnb, সবই একসময় ছোট আইডিয়া থেকে শুরু হয়েছিল। পরের বড় প্রোডাক্টটা হয়তো আপনার হাত দিয়েই আসবে।

---

## 14. Live Class Section (Google Meet)

শিরোনাম: **"Google Meet-এ সরাসরি Live Class"**

**Copy:**
> ভিডিও দেখে একা একা শেখার ঝামেলা নেই। প্রতিটি ক্লাস হবে Google Meet-এ লাইভ, যেখানে আপনি সরাসরি প্রশ্ন করতে পারবেন আর স্ক্রিন শেয়ারে দেখে দেখে কাজ করতে পারবেন।

**Info grid:**
- 📹 প্ল্যাটফর্ম: **Google Meet**
- 🗓 ক্লাসের সময়: `{CONFIG.liveClass.schedule}`
- 🚀 ব্যাচ শুরু: `{CONFIG.batchStart}`
- 🎞 রেকর্ডিং: প্রতিটি ক্লাসের পর ড্যাশবোর্ডে
- 💬 প্রশ্নোত্তর: ক্লাসে ও WhatsApp গ্রুপে

---

## 15. Pricing (একটাই প্ল্যান)

**কোনো তিন-প্ল্যান টেবিল নয়।** একটি বড় centered card:

```
┌──────────────────────────────────────┐
│  NextBuildBD Vibe Coding Course      │
│                                      │
│          ১,৪৯৯৳                       │
│        একবার পেমেন্ট, পুরো কোর্স     │
│                                      │
│  ✔ Google Meet-এ Live Class          │
│  ✔ সব Class Recording                │
│  ✔ Claude Code + Lovable + Supabase  │
│  ✔ Landing Page, Website, SaaS Build │
│  ✔ Student Dashboard অ্যাক্সেস         │
│  ✔ Prompt Library ও Source Code       │
│  ✔ WhatsApp কমিউনিটি সাপোর্ট          │
│  ✔ ভবিষ্যৎ আপডেট                      │
│                                      │
│   [ এখনই এনরোল করুন — ১,৪৯৯৳ ]        │
│   [ WhatsApp-এ প্রশ্ন করুন ]           │
│                                      │
│  bKash · Nagad · Rocket              │
└──────────────────────────────────────┘
```

- Card-এ gradient border (brand gradient), হালকা glow।
- দাম `CONFIG.price` থেকে।
- কোনো কাটা পুরনো দাম বা fake "৪০% ছাড়" দেখানো যাবে না।
- `CONFIG.seatsLeft` থাকলে শুধু তখন "সীমিত আসন" লাইন দেখান।
- `CONFIG.showGuarantee === true` হলে card-এর নিচে guarantee box দেখান। টেক্সট owner ঠিক করবেন (কোনো শর্ত না জেনে "দ্বিগুণ টাকা ফেরত" লেখা যাবে না)।

---

## 16. Instructor Section

শিরোনাম: **"আপনার ইনস্ট্রাক্টর"**

- নাম: **Ashraful Islam (Arif)**
- পরিচিতি: Founder & CEO, Abrar IT। ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং ও সফটওয়্যার প্রোডাক্ট নিয়ে কাজ করেন।
- ছবি: placeholder `public/instructor.jpg` (owner পরে দেবেন)
- বর্ণনা: ক্লায়েন্টের জন্য Lovable + Supabase + React/TypeScript স্ট্যাকে ওয়েবসাইট ও সফটওয়্যার বানানোর বাস্তব অভিজ্ঞতা থেকে এই কোর্স সাজানো।
- লিংক: Facebook `facebook.com/ashraf.arif2000`, Website `abrarit.com`

---

## 17. FAQ (Accordion)

1. **কোডিং না জানলে কি করতে পারব?**
   হ্যাঁ। কোর্সটি একদম শূন্য থেকে শুরু। আপনি শিখবেন AI-কে কীভাবে সঠিক নির্দেশ দিয়ে কাজ করাতে হয়।

2. **ক্লাস কীভাবে হবে?**
   Google Meet-এ লাইভ ক্লাস হবে। প্রতিটি ক্লাসের রেকর্ডিং ড্যাশবোর্ডে পাবেন।

3. **ক্লাস মিস করলে কী হবে?**
   সমস্যা নেই। রেকর্ডিং দেখে নিতে পারবেন, আর গ্রুপে প্রশ্ন করতে পারবেন।

4. **কোর্স ফি কত?**
   মাত্র ১,৪৯৯ টাকা, একবারই। কোনো হিডেন চার্জ নেই।

5. **পেমেন্ট কীভাবে করব?**
   bKash, Nagad বা Rocket-এ Send Money করে Transaction ID (TrxID) ফর্মে জমা দিন। অ্যাডমিন যাচাই করলে আপনার ড্যাশবোর্ড চালু হয়ে যাবে।

6. **পেমেন্ট ভেরিফাই হতে কতক্ষণ লাগে?**
   সাধারণত অল্প সময়ে। দেরি হলে WhatsApp-এ মেসেজ দিন।

7. **কোর্সে কত খরচ করে শুরু করা যায়?**
   Hosting ও Database ফ্রি টায়ারে শুরু করা যায়। শুধু একটি AI সাবস্ক্রিপশন (প্রায় $20/মাস) দরকার হতে পারে।

8. **কোর্স করলেই কি আয় নিশ্চিত?**
   আয়ের নিশ্চয়তা কেউ দিতে পারে না। আমরা স্কিল ও ক্লায়েন্ট পাওয়ার পদ্ধতি শেখাই, ফলাফল আপনার প্র্যাকটিস ও কাজের ওপর নির্ভর করে।

9. **ল্যাপটপ না থাকলে?**
   একটি ল্যাপটপ/ডেস্কটপ ও ইন্টারনেট থাকলে সবচেয়ে ভালো। মোবাইলে সীমিতভাবে সম্ভব।

10. **ব্যবসার জন্য নিজের সফটওয়্যার বানাতে চাই, এই কোর্স কি কাজে লাগবে?**
    অবশ্যই। কোর্সের একটা বড় অংশ জুড়েই আছে নিজের ব্যবসার ওয়েবসাইট ও সফটওয়্যার বানানো।

---

## 18. Enroll Section (`#enroll`)

শিরোনাম: **"আজই আপনার যাত্রা শুরু করুন"**

**বামে: পেমেন্ট নির্দেশনা (Step-by-step)**
1. নিচের যেকোনো নাম্বারে **১,৪৯৯৳ Send Money** করুন:
   - bKash: `{CONFIG.payment.bkash.number}` (Personal)
   - Nagad: `{CONFIG.payment.nagad.number}` (Personal)
   - Rocket: `{CONFIG.payment.rocket.number}`
   - প্রতিটির পাশে **Copy** বাটন
2. পেমেন্ট শেষে SMS-এ পাওয়া **Transaction ID (TrxID)** কপি করুন
3. ডানের ফর্মে তথ্য ও TrxID জমা দিন
4. অ্যাডমিন যাচাই করলে অটো আপনার **Student Dashboard** চালু হবে
5. সেখান থেকে **WhatsApp গ্রুপে জয়েন** করুন

**ডানে: Enroll Form (UI + validation, backend পরের ধাপে)**
- পূর্ণ নাম (required)
- মোবাইল নম্বর (BD format validation: `01[3-9]XXXXXXXX`)
- ইমেইল (required)
- পেমেন্ট মাধ্যম (bKash / Nagad / Rocket)
- যে নম্বর থেকে পাঠিয়েছেন
- Transaction ID (required)
- Submit button: **"পেমেন্ট জমা দিন"**
- Submit-এর পর success state: "আপনার তথ্য জমা হয়েছে। যাচাই শেষে ড্যাশবোর্ড চালু হবে।"

**এখন কী করবেন:** ফর্ম submit এখনকার জন্য `console.log` + success UI দেখাবে। `// TODO: Supabase insert into enrollments` কমেন্ট রাখুন, যাতে পরের ধাপে LMS backend যুক্ত করা যায়।

**নিচে:** "পেমেন্টে সমস্যা? সরাসরি মেসেজ করুন" → WhatsApp button।

---

## 19. Final CTA

Full-width gradient section (`--gradient-brand`):

> **আপনার আইডিয়াটা অপেক্ষা করছে।**
> আজ শুরু করলে কয়েক সপ্তাহ পরে আপনার হাতে থাকবে নিজের বানানো লাইভ প্রোডাক্ট।

**বাটন:** "১,৪৯৯৳-এ এনরোল করুন" · "WhatsApp-এ কথা বলুন"

---

## 20. Footer

- Logo + tagline: **Learn. Build. Launch.**
- Quick links: কোর্স সম্পর্কে, কারিকুলাম, মূল্য, FAQ
- যোগাযোগ: WhatsApp `01719-686459`, Email `asrafulislam2000@gmail.com`
- Social: Facebook (`facebook.com/ashraf.arif2000`)
- Copyright: `© 2026 NextBuildBD. সর্বস্বত্ব সংরক্ষিত।`
- ছোট লিংক: Privacy Policy, Terms (placeholder page)

---

## 21. Floating Elements

- **WhatsApp floating button:** নিচে-ডানে, সবুজ গোল বাটন, `wa.me/{number}?text={message}`, hover-এ tooltip "মেসেজ করুন"।
- **Mobile sticky bar:** স্ক্রিনের নিচে, বামে দাম `১,৪৯৯৳`, ডানে **"এনরোল"** বাটন। Enroll section দেখা গেলে hide হবে।
- WhatsApp button ও sticky bar একে অপরকে ঢাকবে না (WhatsApp button sticky bar-এর ওপরে থাকবে)।

---

## 22. SEO ও Meta

```html
<title>NextBuildBD — Claude Code, Lovable ও Supabase দিয়ে Website ও SaaS বানানো শিখুন</title>
<meta name="description" content="Google Meet-এ Live Class। Claude Code, Lovable ও Supabase দিয়ে Landing Page, Website ও SaaS বানানো শিখুন মাত্র ১,৪৯৯ টাকায়।" />
<meta property="og:title" content="NextBuildBD — Learn. Build. Launch." />
<meta property="og:image" content="/logo.png" />
<meta name="theme-color" content="#050816" />
<html lang="bn">
```

- Favicon: logo থেকে বানানো।
- JSON-LD `Course` schema যুক্ত করুন।

---

## 23. File Structure

```
src/
  components/
    Header.tsx  Hero.tsx  TrustStrip.tsx  Audience.tsx
    Curriculum.tsx  Tools.tsx  Facilities.tsx  Outcome.tsx
    CostSection.tsx  Process.tsx  LiveClass.tsx  Pricing.tsx
    Instructor.tsx  Faq.tsx  Enroll.tsx  FinalCta.tsx  Footer.tsx
    WhatsAppFab.tsx  StickyEnrollBar.tsx  ThemeToggle.tsx
  config.ts
  index.css
  App.tsx
public/
  logo.png   instructor.jpg (placeholder)
```

---

## 24. Acceptance Checklist

- [ ] Dark ও Light দুই মোড কাজ করছে, toggle সহ, কোনো flash নেই
- [ ] লোগোর brand রঙ (navy + indigo/violet gradient) দুই মোডেই সুসংগত
- [ ] মূল্য শুধু **১,৪৯৯৳**, একটাই প্ল্যান
- [ ] Google Meet Live Class স্পষ্টভাবে উল্লেখ আছে (Hero, Facilities, Live Class section, Pricing, FAQ)
- [ ] "খরচ কেমন হবে" section আছে
- [ ] সব CTA `#enroll`-এ যায়, WhatsApp লিংক কাজ করছে
- [ ] Payment ফ্লো (Send Money → TrxID → Admin verify → Dashboard → WhatsApp group) ব্যাখ্যা করা আছে
- [ ] 360px মোবাইলে overflow নেই
- [ ] কোনো fake testimonial, fake সংখ্যা বা অনিশ্চিত আয়ের প্রতিশ্রুতি নেই
- [ ] সব `TODO` মান `config.ts`-এ চিহ্নিত

---

## 25. Phase 2 (পরে করার জন্য, এখন নয়)

Landing page শেষ হলে আলাদা prompt-এ: Supabase Auth, `enrollments` table, Admin payment verification panel, Student Dashboard (class list, Meet link, recordings, WhatsApp group button), verified হলে auto access।

---

## Build Order

1. `index.css` tokens + Tailwind map + theme toggle
2. Header, Hero, WhatsApp FAB, Sticky bar
3. বাকি section গুলো উপর থেকে নিচে
4. Enroll form validation
5. Responsive ও dark/light visual QA, SEO meta
