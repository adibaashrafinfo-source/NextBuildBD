import type { CSSProperties } from "react";
import { BrandLogo, type BrandName } from "@/components/shared/BrandLogo";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TOOLS: { name: string; logo: BrandName; tag: string; glow: string }[] = [
  { name: "Claude Code", logo: "claude", tag: "AI Coding Agent", glow: "#D97757" },
  { name: "Lovable", logo: "lovable", tag: "AI App Builder", glow: "#FF5AA0" },
  { name: "Supabase", logo: "supabase", tag: "Database & Auth", glow: "#3ECF8E" },
  { name: "React", logo: "react", tag: "UI Library", glow: "#00D8FF" },
  { name: "TypeScript", logo: "typescript", tag: "Type-safe Code", glow: "#3178C6" },
  { name: "GitHub", logo: "github", tag: "Version Control", glow: "#8B949E" },
  { name: "Vercel", logo: "vercel", tag: "Deploy & Hosting", glow: "#A3A3A3" },
  { name: "Tailwind CSS", logo: "tailwindcss", tag: "Styling", glow: "#38BDF8" },
];

export function Tools() {
  return (
    <section aria-labelledby="tools-title" className="section relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-72 bg-hero-glow opacity-70" />
      <div className="container relative max-w-5xl">
        <SectionHeading id="tools-title" eyebrow="Tools" title="যে টুলগুলো আপনি দক্ষভাবে চালাতে শিখবেন" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {TOOLS.map((t, i) => (
            <Reveal as="li" key={t.name} delay={(i % 4) * 0.06} className="h-full">
              <div
                style={{ "--glow": t.glow } as CSSProperties}
                className="card group relative flex h-full flex-col items-center gap-3 overflow-hidden px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--glow)] hover:shadow-[0_18px_40px_-18px_var(--glow)] motion-reduce:hover:translate-y-0 sm:px-4"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                  style={{ background: t.glow }}
                />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-bg shadow-sm transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <BrandLogo name={t.logo} className="h-9 w-9" />
                </span>
                <span className="relative">
                  <span className="block font-en text-[15px] font-bold text-text sm:text-base">{t.name}</span>
                  <span className="block font-en text-xs font-medium text-text-muted sm:text-[13px]">{t.tag}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
