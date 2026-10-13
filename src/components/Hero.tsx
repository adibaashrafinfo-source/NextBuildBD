import { CreditCard, MessageCircle, Wrench, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { HeroShowcase } from "@/components/HeroShowcase";
import { priceLabel, waLink } from "@/lib/utils";

const HIGHLIGHTS: { icon?: LucideIcon; meet?: boolean; label: string }[] = [
  { meet: true, label: "Google Meet-এ Live Class" },
  { icon: Wrench, label: "Claude Code + Lovable + Supabase" },
  { icon: MessageCircle, label: "WhatsApp কমিউনিটি সাপোর্ট" },
  { icon: CreditCard, label: "bKash / Nagad / Rocket-এ সহজ পেমেন্ট" },
];

/** CSS entrance (tailwindcss-animate) so the hero needs no animation JS; reduced-motion is handled in index.css. */
const enter = "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0" />

      <div className="container relative grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <span
            className={`${enter} inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm font-semibold shadow-card`}
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            Live Class • Google Meet • নতুন ব্যাচ
          </span>

          <h1
            id="hero-title"
            className="text-[28px] font-bold leading-[1.35] text-text min-[400px]:text-[32px] sm:text-4xl lg:text-[50px] lg:leading-[1.3]"
          >
            Claude Code, Lovable আর Supabase দিয়ে নিজেই বানান <span className="text-gradient">ওয়েবসাইট ও SaaS</span> —
            কোডিং না জেনেও।
          </h1>

          <p className="max-w-xl text-[17px] text-text-muted md:text-lg">
            আইডিয়া থেকে লাইভ প্রোডাক্ট পর্যন্ত পুরো পথ আমরা হাতে-কলমে দেখাব। শিখুন Vibe Coding, বানান Landing Page,
            Website ও SaaS, আর দেশ-বিদেশের ক্লায়েন্টের কাছে সেটা বিক্রি করে আয় শুরু করুন।
          </p>

          <div className={`${enter} flex w-full flex-col gap-3 delay-75 sm:w-auto sm:flex-row`}>
            <Button asChild size="lg">
              <a href="#enroll">মাত্র {priceLabel()}-এ এনরোল করুন</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="text-whatsapp" />
                WhatsApp-এ প্রশ্ন করুন
              </a>
            </Button>
          </div>

          <ul className={`${enter} grid w-full gap-3 pt-2 delay-150 sm:grid-cols-2`}>
            {HIGHLIGHTS.map(({ icon: Icon, meet, label }) => (
              <li key={label} className="flex items-center gap-3 text-[15px] font-medium text-text">
                <span
                  className={
                    meet
                      ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/5"
                      : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong"
                  }
                >
                  {meet ? <BrandLogo name="googleMeet" className="h-5 w-6" /> : Icon && <Icon className="h-5 w-5" aria-hidden />}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${enter} min-w-0 delay-150`}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
