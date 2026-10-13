import { useState } from "react";
import { Globe, UserRound } from "lucide-react";
import { FacebookIcon } from "@/components/shared/BrandIcons";
import { Reveal } from "@/components/shared/Reveal";
import { CONFIG } from "@/config";

const prettyUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function Instructor() {
  const { name, photo, facebook, website } = CONFIG.instructor;
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section aria-labelledby="instructor-title" className="section bg-bg-soft">
      <div className="container max-w-5xl">
        <Reveal className="card grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[240px_1fr] md:gap-10 md:p-10">
          <div className="mx-auto w-full max-w-[240px]">
            <div className="rounded-3xl bg-gradient-brand p-[2px]">
              {photo && !photoFailed ? (
                <img
                  src={photo}
                  alt={`${name} — ইনস্ট্রাক্টর`}
                  width={480}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoFailed(true)}
                  className="aspect-square w-full rounded-[22px] bg-bg-soft object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-[22px] bg-brand-soft text-brand-strong">
                  <UserRound className="h-20 w-20" aria-hidden />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="self-center rounded-full border border-border bg-bg px-3.5 py-1 text-sm font-semibold text-brand-strong md:self-start">
              আপনার ইনস্ট্রাক্টর
            </span>
            <h2 id="instructor-title" className="font-en text-2xl font-extrabold text-text sm:text-3xl">
              {name}
            </h2>
            <p className="font-semibold text-text">
              Founder &amp; CEO, Abrar IT। ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং ও সফটওয়্যার প্রোডাক্ট নিয়ে কাজ করেন।
            </p>
            <p className="text-text-muted">
              ক্লায়েন্টের জন্য Lovable + Supabase + React/TypeScript স্ট্যাকে ওয়েবসাইট ও সফটওয়্যার বানানোর বাস্তব
              অভিজ্ঞতা থেকে এই কোর্স সাজানো।
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-bg px-4 font-en text-[15px] font-semibold text-text hover:border-brand"
              >
                <FacebookIcon className="h-5 w-5 text-[#1877F2]" /> Facebook
              </a>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-bg px-4 font-en text-[15px] font-semibold text-text hover:border-brand"
              >
                <Globe className="h-5 w-5 text-brand-strong" aria-hidden /> {prettyUrl(website)}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
