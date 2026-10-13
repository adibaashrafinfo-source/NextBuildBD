import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Lightbulb, Sparkles } from "lucide-react";
import { BrandLogo, type BrandName } from "@/components/shared/BrandLogo";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { toBanglaNumber } from "@/lib/utils";

const STEPS = [
  { title: "এনরোল করুন", body: "পেমেন্ট করে TrxID জমা দিন" },
  { title: "অ্যাক্সেস পান", body: "অ্যাডমিন ভেরিফাই করলে অটো ড্যাশবোর্ডে লগইন" },
  { title: "কমিউনিটিতে জয়েন করুন", body: "WhatsApp গ্রুপে যোগ দিন" },
  { title: "Live Class করুন ও বানান", body: "নিজের প্রোডাক্ট লাইভ করুন" },
];

const STARTUPS: { name: string; logo: BrandName }[] = [
  { name: "Facebook", logo: "facebook" },
  { name: "YouTube", logo: "youtube" },
  { name: "Canva", logo: "canva" },
  { name: "Shopify", logo: "shopify" },
  { name: "Airbnb", logo: "airbnb" },
];

export function Process() {
  const stepsRef = useRef<HTMLDivElement>(null);
  // The connector line draws itself as the stepper scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start 85%", "end 55%"] });
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const progress = useReducedMotion() ? 1 : spring;

  return (
    <section aria-labelledby="process-title" className="section">
      <div className="container">
        <SectionHeading
          id="process-title"
          eyebrow="কীভাবে শুরু করবেন"
          title="ধরে নিচ্ছি আপনি কিছুই জানেন না — সমস্যা নেই"
        >
          আপনি জয়েন করলে প্রথম দিন থেকেই আইডিয়া সাজানো, প্রোডাক্ট বানানো ও পাবলিশ করা পর্যন্ত সবকিছু Live Class-এ
          স্ক্রিন শেয়ার করে দেখানো হবে। এটা থিওরি নয়, সরাসরি হাতে-কলমে কাজ।
        </SectionHeading>

        {/* Horizontal stepper on desktop, vertical on mobile */}
        <div ref={stepsRef} className="relative">
          <span
            aria-hidden
            className="absolute bottom-6 left-[23px] top-6 w-0.5 bg-border md:bottom-auto md:left-[12%] md:right-[12%] md:top-[23px] md:h-0.5 md:w-auto"
          />
          {/* vertical fill (mobile) */}
          <m.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-6 left-[23px] top-6 w-0.5 origin-top bg-gradient-brand md:hidden"
          />
          {/* horizontal fill (desktop) */}
          <m.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute left-[12%] right-[12%] top-[23px] hidden h-0.5 origin-left bg-gradient-brand md:block"
          />
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 0.08}
                className="relative flex gap-4 md:flex-col md:items-center md:text-center"
              >
                <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-cta text-lg font-bold text-white ring-4 ring-bg">
                  {toBanglaNumber(i + 1)}
                </span>
                <span className="pt-1 md:pt-0">
                  <span className="block text-lg font-bold text-text">{s.title}</span>
                  <span className="block text-[15px] text-text-muted">{s.body}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-[1.5px]">
            <div className="flex flex-col gap-3 rounded-[calc(1.5rem-1.5px)] bg-bg-elevated p-6 sm:flex-row sm:items-start sm:gap-4 md:p-8">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <Sparkles className="h-6 w-6" aria-hidden />
              </span>
              <p className="text-text md:text-lg">
                এটা কোনো সাধারণ কোর্স নয়, এটা একটা <strong className="text-brand-strong">Vibe Coding</strong>{" "}
                প্রোগ্রাম। এখানে আপনি লাইন বাই লাইন কোড মুখস্থ করবেন না। আপনি AI-কে সঠিকভাবে নির্দেশ দিয়ে প্রোডাক্ট
                বানানো শিখবেন।
              </p>
            </div>
          </div>
          <ul
            aria-label="ছোট আইডিয়া থেকে বড় প্রোডাক্ট"
            className="mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3"
          >
            {STARTUPS.map((b, i) => (
              <Reveal
                as="li"
                key={b.name}
                delay={i * 0.06}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated py-2 pl-2.5 pr-4 shadow-card"
              >
                <BrandLogo name={b.logo} className="h-6 w-6" />
                <span className="font-en text-sm font-semibold text-text">{b.name}</span>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-center text-text-muted">
            <Lightbulb className="mr-1.5 inline-block h-5 w-5 -translate-y-0.5 text-warning" aria-hidden />
            Facebook, YouTube, Canva, Shopify, Airbnb, সবই একসময় ছোট আইডিয়া থেকে শুরু হয়েছিল। পরের বড় প্রোডাক্টটা
            হয়তো আপনার হাত দিয়েই আসবে।
          </p>
        </Reveal>
      </div>
    </section>
  );
}
