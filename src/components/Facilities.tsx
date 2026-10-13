import type { CSSProperties, MouseEvent, ReactNode } from "react";
import {
  BookOpenText,
  FileCode2,
  LayoutDashboard,
  MonitorPlay,
  RefreshCw,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG } from "@/config";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  body: string;
  /** Gradient stops for the icon tile (white icon on top stays >= 3:1). */
  from: string;
  to: string;
  icon?: LucideIcon;
  meet?: boolean;
};

const FEATURES: Feature[] = [
  {
    title: `${CONFIG.liveClass.platform}-এ Live Class`,
    body: "সরাসরি প্রশ্ন করুন, স্ক্রিন শেয়ারে দেখে দেখে শিখুন।",
    from: "#2684FC",
    to: "#00AC47",
    meet: true,
  },
  { icon: MonitorPlay, title: "Class Recording", body: "মিস হলে বা আবার দেখতে চাইলে রেকর্ডিং দেখুন।", from: "#F43F5E", to: "#BE123C" },
  { icon: Wand2, title: "Real Project Walkthrough", body: "Landing Page থেকে পূর্ণাঙ্গ LMS/SaaS বানানো।", from: "#4F46E5", to: "#7C3AED" },
  { icon: BookOpenText, title: "Ready Prompt Library", body: "Claude Code ও Lovable-এর প্রম্পট, সরাসরি কপি করে কাজে লাগান।", from: "#EA580C", to: "#C2410C" },
  { icon: FileCode2, title: "Source Code ও Template", body: "প্রজেক্ট ফাইল ও টেমপ্লেট।", from: "#0284C7", to: "#075985" },
  { icon: Users, title: "WhatsApp Community", body: "গ্রুপে জয়েন করুন, আটকে গেলে সাহায্য নিন।", from: "#16A34A", to: "#15803D" },
  { icon: LayoutDashboard, title: "Student Dashboard", body: "নিজের ড্যাশবোর্ডে সব ক্লাস ও রিসোর্স এক জায়গায়।", from: "#7C3AED", to: "#5B21B6" },
  { icon: RefreshCw, title: "নতুন কনটেন্ট আপডেট", body: "টুল বদলালে নতুন ভিডিও ও নোট যুক্ত হবে।", from: "#0D9488", to: "#0F766E" },
];

/** Spotlight that follows the pointer inside a card. */
function trackPointer(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Facilities() {
  return (
    <section id="facilities" aria-labelledby="facilities-title" className="section bg-bg-soft">
      <div className="container">
        <SectionHeading id="facilities-title" eyebrow="সুবিধা" title="কোর্সে আপনি যা যা পাচ্ছেন" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal as="li" key={f.title} delay={(i % 4) * 0.07} className="h-full">
                <div
                  onMouseMove={trackPointer}
                  style={{ "--from": f.from, "--to": f.to } as CSSProperties}
                  className={cn(
                    "card group relative flex h-full flex-col gap-4 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--from)] motion-reduce:hover:translate-y-0",
                    f.meet && "ring-2 ring-brand",
                  )}
                >
                  {/* pointer spotlight */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--from) 16%, transparent), transparent 70%)",
                    }}
                  />
                  {/* decorative index, drawn via CSS so it isn't read or contrast-checked as text */}
                  <span
                    aria-hidden
                    data-n={String(i + 1).padStart(2, "0")}
                    className="num pointer-events-none absolute right-4 top-3 text-4xl font-extrabold text-text opacity-[0.06] before:content-[attr(data-n)]"
                  />

                  <IconTile meet={f.meet}>
                    {Icon && <Icon className="relative h-7 w-7 text-white drop-shadow-sm" strokeWidth={1.75} aria-hidden />}
                  </IconTile>

                  <h3 className="relative text-lg font-bold text-text">{f.title}</h3>
                  <p className="relative text-[15px] text-text-muted">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function IconTile({ meet, children }: { meet?: boolean; children?: ReactNode }) {
  if (meet) {
    return (
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white shadow-[0_12px_28px_-12px_#2684FC] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
        <BrandLogo name="googleMeet" className="h-7 w-8" />
      </span>
    );
  }
  return (
    <span
      className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-[0_12px_28px_-12px_var(--from),inset_0_1px_0_rgba(255,255,255,.35)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100"
      style={{ background: "linear-gradient(135deg, var(--from), var(--to))" }}
    >
      {/* gloss */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      {children}
    </span>
  );
}
