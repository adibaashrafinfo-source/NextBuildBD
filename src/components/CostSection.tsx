import { Bot, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG } from "@/config";

const STATS = [
  { icon: Server, value: "ফ্রি", label: "Hosting", en: false },
  { icon: Database, value: "ফ্রি", label: "Database", en: false },
  { icon: Bot, value: `~${CONFIG.aiSubscriptionCost}`, suffix: "/মাস", label: "AI Subscription", en: true },
];

export function CostSection() {
  return (
    <section aria-labelledby="cost-title" className="section bg-bg-soft">
      <div className="container max-w-5xl">
        <SectionHeading id="cost-title" eyebrow="খরচ" title="আয় করতে পারবেন, কিন্তু খরচ কেমন হবে?">
          সবচেয়ে ভালো খবর হলো, শুরুতেই Hosting আর Database আপনি ফ্রি ব্যবহার করতে পারবেন। বেশিরভাগ টুলের Free Tier
          দিয়েই শুরু করা যায়, প্রথম কয়েকশ ইউজার পর্যন্ত। আপনার শুধু দরকার একটা AI সাবস্ক্রিপশন, যেটা দিয়ে আপনি
          সফটওয়্যার বানাবেন। মাসিক এই খরচ আপনার এক-দুই দিনের পকেট খরচের কাছাকাছি।
        </SectionHeading>

        <ul className="grid gap-4 sm:grid-cols-3">
          {STATS.map(({ icon: Icon, value, suffix, label, en }, i) => (
            <Reveal
              as="li"
              key={label}
              delay={i * 0.06}
              className="card flex flex-col items-center gap-2 p-7 text-center"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-4xl font-bold text-text">
                <span className={en ? "num" : undefined}>{value}</span>
                {suffix && <span className="text-2xl">{suffix}</span>}
              </span>
              <span className="font-en font-semibold text-text-muted">{label}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-text md:text-lg">
            একসময় একটা সফটওয়্যার বানাতে লাখ লাখ টাকা আর পুরো একটা টিম লাগত। এখন Claude বা Lovable-এর মতো AI টুল দিয়ে
            একা একজন মানুষই সেই কাজ করে ফেলতে পারেন। দুনিয়া বদলে গেছে, আর এই সুযোগটা এখন আপনার হাতেই।
          </p>
          <p className="mt-4 text-sm italic text-text-muted">*টুলের দাম ও Free Tier সময়ের সাথে বদলাতে পারে।*</p>
          <Button asChild size="lg" className="mt-8">
            <a href="#enroll">এখনই শুরু করুন</a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
