import { Briefcase, GraduationCap, Rocket } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const CARDS = [
  {
    icon: GraduationCap,
    title: "১. স্টুডেন্ট ও নতুন শিক্ষার্থী",
    body: "কোডিং জানেন না? সমস্যা নেই। AI দিয়ে কাজ করে এমন একটি হাই-ডিমান্ড স্কিল শিখে নিজের ক্যারিয়ার শুরু করুন।",
  },
  {
    icon: Briefcase,
    title: "২. ব্যবসায়ী ও বিজনেস ওনার",
    body: "নিজের ব্যবসার ওয়েবসাইট, অর্ডার সিস্টেম বা সফটওয়্যার নিজেই বানান। ডেভেলপারের পেছনে লাখ টাকা খরচ না করে নিজের হাতে নিয়ন্ত্রণ নিন।",
  },
  {
    icon: Rocket,
    title: "৩. ফ্রিল্যান্সার ও এন্ট্রাপ্রেনিউর",
    body: "ক্লায়েন্টের জন্য Landing Page, Website ও SaaS বানিয়ে দেশি ও আন্তর্জাতিক মার্কেটে সার্ভিস বিক্রি করুন, অথবা নিজের প্রোডাক্ট লঞ্চ করুন।",
  },
];

export function Audience() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container">
        <SectionHeading id="about-title" eyebrow="কাদের জন্য" title="আপনি যদি এদের একজন হন, এই কোর্স আপনার জন্য" />
        <ul className="grid gap-5 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="card flex h-full flex-col gap-4 p-6 md:p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-xl font-bold text-text">{title}</h3>
              <p className="text-text-muted">{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
