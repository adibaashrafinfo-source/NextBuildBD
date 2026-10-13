import { Check, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Reveal } from "@/components/shared/Reveal";
import { CONFIG } from "@/config";
import { priceLabel, toBanglaNumber, waLink } from "@/lib/utils";

const INCLUDES = [
  `${CONFIG.liveClass.platform}-এ Live Class`,
  "সব Class Recording",
  "Claude Code + Lovable + Supabase",
  "Landing Page, Website, SaaS Build",
  "Student Dashboard অ্যাক্সেস",
  "Prompt Library ও Source Code",
  "WhatsApp কমিউনিটি সাপোর্ট",
  "ভবিষ্যৎ আপডেট",
];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section">
      <div className="container">
        <Reveal className="mx-auto max-w-lg">
          <div className="rounded-[28px] bg-gradient-brand p-[2px] shadow-[0_24px_70px_-24px_var(--brand)]">
            <div className="flex flex-col items-center gap-6 rounded-[26px] bg-bg-elevated px-5 py-8 text-center sm:px-10 sm:py-10">
              <h2 id="pricing-title" className="font-en text-xl font-bold text-text sm:text-2xl">
                {CONFIG.courseName}
              </h2>

              <div>
                <p className="text-[56px] font-bold leading-none text-text sm:text-6xl">{priceLabel()}</p>
                <p className="mt-3 text-text-muted">একবার পেমেন্ট, পুরো কোর্স</p>
              </div>

              {CONFIG.seatsLeft !== null && (
                <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-strong">
                  <Users className="h-4 w-4" aria-hidden />
                  সীমিত আসন — বাকি {toBanglaNumber(CONFIG.seatsLeft)}টি
                </p>
              )}

              <ul className="w-full space-y-3 text-left">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex w-full flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <a href="#enroll">এখনই এনরোল করুন — {priceLabel()}</a>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full">
                  <a href={waLink()} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="text-whatsapp" />
                    WhatsApp-এ প্রশ্ন করুন
                  </a>
                </Button>
              </div>

              <p className="font-en text-sm font-semibold text-text-muted">bKash · Nagad · Rocket</p>
            </div>
          </div>

          {CONFIG.showGuarantee && CONFIG.guaranteeText && (
            <div className="card mt-5 flex items-start gap-3 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-success" aria-hidden />
              <p className="text-text">{CONFIG.guaranteeText}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
