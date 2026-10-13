import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TOOLS = [
  "Claude Code",
  "Lovable",
  "Supabase",
  "React",
  "TypeScript",
  "GitHub",
  "Vercel",
  "Tailwind CSS",
  "bKash",
  "WhatsApp",
];

export function Tools() {
  return (
    <section aria-labelledby="tools-title" className="section">
      <div className="container max-w-4xl">
        <SectionHeading id="tools-title" eyebrow="Tools" title="যে টুলগুলো আপনি দক্ষভাবে চালাতে শিখবেন" />
        <Reveal>
          <ul className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-bg-elevated px-4 py-2.5 font-en text-[15px] font-semibold text-text shadow-card transition-colors hover:border-brand"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-brand" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
