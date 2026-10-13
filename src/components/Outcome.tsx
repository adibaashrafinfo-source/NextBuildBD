import { CheckCircle2, Info } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const OUTCOMES = [
  "নিজের বা ক্লায়েন্টের জন্য প্রফেশনাল Landing Page ও Website বানাতে পারবেন",
  "Login, Dashboard, Payment সহ নিজের SaaS প্রোডাক্ট বানাতে পারবেন",
  "Supabase দিয়ে ডেটাবেস ও অথেনটিকেশন ম্যানেজ করতে পারবেন",
  "লাইভ ডোমেইনে প্রোডাক্ট পাবলিশ করতে পারবেন",
  "দেশি ও আন্তর্জাতিক ক্লায়েন্টের কাছে সার্ভিস বিক্রি করতে পারবেন",
  "নিজের SaaS থেকে রিকারিং ইনকামের পথে এগোতে পারবেন",
];

export function Outcome() {
  return (
    <section aria-labelledby="outcome-title" className="section">
      <div className="container max-w-5xl">
        <SectionHeading id="outcome-title" eyebrow="কোর্স শেষে" title="কোর্স শেষে আপনার হাতে থাকবে যেসব স্কিল" />
        <ul className="grid gap-4 md:grid-cols-2">
          {OUTCOMES.map((o, i) => (
            <Reveal as="li" key={o} delay={(i % 2) * 0.05} className="card flex items-start gap-4 p-5">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" aria-hidden />
              <span className="font-medium text-text">{o}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center text-sm text-text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              আয় নির্ভর করে আপনার পরিশ্রম, প্র্যাকটিস ও মার্কেটিংয়ের ওপর। নির্দিষ্ট আয়ের নিশ্চয়তা দেওয়া হয় না।
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
