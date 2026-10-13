import { CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const MODULES = [
  {
    title: "Vibe Coding পরিচিতি ও Setup",
    items: [
      "Vibe Coding কী, আর কেন এটা গেম চেঞ্জার",
      "Claude Code install ও সেটআপ",
      "Lovable account ও workspace সেটআপ",
      "Supabase, GitHub, Vercel account সেটআপ",
      "ভালো Prompt লেখার কৌশল",
    ],
  },
  {
    title: "Landing Page Design",
    items: [
      "Conversion-focused landing page-এর গঠন",
      "Lovable ও Claude Code দিয়ে ডিজাইন",
      "Dark/Light mode, Responsive, Animation",
      "নিজের ব্র্যান্ড অনুযায়ী ডিজাইন",
    ],
  },
  {
    title: "Business Website Build",
    items: [
      "Corporate / Portfolio / E-commerce সাইট",
      "SEO বেসিক ও দ্রুত লোডিং",
      "Domain কেনা ও Hosting সংযোগ",
      "ক্লায়েন্ট ওয়ার্কের জন্য প্রফেশনাল ডেলিভারি",
    ],
  },
  {
    title: "Supabase Database Management",
    items: [
      "Table, Relation, Schema ডিজাইন",
      "Authentication (Login/Signup)",
      "Row Level Security (RLS) দিয়ে ডেটা সুরক্ষা",
      "Storage, Edge Functions",
    ],
  },
  {
    title: "SaaS Product Build",
    items: [
      "SaaS আইডিয়া যাচাই",
      "Student/User Dashboard ও Admin Dashboard",
      "Role-based access",
      "Subscription ও Plan লজিক",
    ],
  },
  {
    title: "Bangladesh Payment ও Automation",
    items: [
      "bKash / Nagad / Rocket (Send Money + TrxID) পেমেন্ট ফ্লো",
      "Admin ভেরিফাই করলে অটো অ্যাক্সেস চালু",
      "WhatsApp গ্রুপ লিংক ও ডাইরেক্ট মেসেজ ইন্টিগ্রেশন",
      "SMS/Email নোটিফিকেশন",
    ],
  },
  {
    title: "Deploy, Debug ও Maintenance",
    items: [
      "GitHub ও Vercel দিয়ে ডিপ্লয়",
      "Error debug করার পদ্ধতি",
      "Security checklist ও Backup",
      "প্রোডাক্ট আপডেট ও ভার্সনিং",
    ],
  },
  {
    title: "আয় ও ক্লায়েন্ট (Monetization)",
    items: [
      "Local ও International ক্লায়েন্ট কোথায় পাবেন",
      "Fiverr, Upwork, LinkedIn, Facebook-এ প্রোফাইল সাজানো",
      "সার্ভিস প্যাকেজ ও প্রাইসিং",
      "নিজের SaaS বিক্রির মডেল: Subscription, One-time, Lead-gen",
      "Portfolio তৈরি ও ক্লায়েন্ট পিচ",
    ],
  },
];

export function Curriculum() {
  return (
    <section id="curriculum" aria-labelledby="curriculum-title" className="section bg-bg-soft">
      <div className="container max-w-4xl">
        <SectionHeading id="curriculum-title" eyebrow="কারিকুলাম" title="আইডিয়া থেকে লাইভ প্রোডাক্ট — ধাপে ধাপে" />
        <Reveal>
          <Accordion type="multiple" defaultValue={["m-0"]} className="flex flex-col gap-3">
            {MODULES.map((m, i) => (
              <AccordionItem key={m.title} value={`m-${i}`}>
                <AccordionTrigger>
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="num inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-cta text-sm font-extrabold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="num block text-xs font-semibold uppercase tracking-wider text-brand-strong">
                        Module {i + 1}
                      </span>
                      <span className="block text-[17px] text-text md:text-lg">{m.title}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2.5 border-t border-border pt-4 md:pl-[60px]">
                    {m.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" aria-hidden />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
