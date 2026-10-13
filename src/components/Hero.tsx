import { CreditCard, MessageCircle, Video, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { priceLabel, waLink } from "@/lib/utils";

const HIGHLIGHTS = [
  { icon: Video, label: "Google Meet-এ Live Class" },
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
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[15px] font-medium text-text">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${enter} min-w-0 delay-150`}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/** Browser window with a dark SaaS dashboard, drawn in CSS/SVG (no external images). */
function DashboardMockup() {
  const bars = [34, 52, 44, 68, 58, 82, 74, 92];
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-brand opacity-25 blur-3xl" />
      <figure
        role="img"
        aria-label="একটি SaaS ড্যাশবোর্ডের ব্রাউজার মকআপ — কোর্সে এমন প্রোডাক্ট বানানো শিখবেন"
        className="relative overflow-hidden rounded-3xl border border-[#1F2566] bg-[#0C1030] shadow-card"
      >
        <div className="flex items-center gap-1.5 border-b border-[#1F2566] bg-[#11164A] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-[#050816] px-3 py-1 font-en text-xs text-[#A9AEDB]">
            app.yoursaas.com/dashboard
          </span>
        </div>
        <div className="flex">
          <div className="hidden w-[24%] flex-col gap-3 bg-[#080B24] p-4 min-[420px]:flex">
            <div className="h-6 w-6 rounded-lg bg-gradient-brand" />
            {[80, 64, 72, 56, 68].map((w, i) => (
              <div
                key={i}
                className={i === 1 ? "h-2.5 rounded bg-[#5B6BFF]" : "h-2.5 rounded bg-[#1F2566]"}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#F4F5FF]/80" />
              <div className="h-7 w-16 rounded-lg bg-gradient-brand" />
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {["#7FA6FF", "#A98CFF", "#34D399"].map((c) => (
                <div key={c} className="rounded-xl border border-[#1F2566] bg-[#11164A] p-2.5">
                  <div className="h-1.5 w-10 rounded bg-[#A9AEDB]/50" />
                  <div className="mt-2 h-3 w-12 rounded" style={{ background: c }} />
                </div>
              ))}
            </div>
            <div className="flex h-32 items-end gap-1.5 rounded-xl border border-[#1F2566] bg-[#11164A] p-3 sm:gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{
                    height: `${h}%`,
                    minHeight: 12,
                    background: i > 4 ? "linear-gradient(#A98CFF,#4F46FF)" : "linear-gradient(#7FA6FF,#4F46FF)",
                  }}
                />
              ))}
            </div>
            <div className="space-y-2">
              {[0, 1].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#1A2070]" />
                  <div className="h-2 flex-1 rounded bg-[#1F2566]" />
                  <div className="h-2 w-10 rounded bg-[#34D399]/70" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
