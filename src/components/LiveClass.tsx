import { CalendarDays, Film, MessagesSquare, Mic, MonitorUp, PhoneOff, Rocket, Video } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG } from "@/config";
import { displayValue } from "@/lib/utils";

const INFO = [
  { icon: CalendarDays, label: "ক্লাসের সময়", value: displayValue(CONFIG.liveClass.schedule) },
  { icon: Rocket, label: "ব্যাচ শুরু", value: displayValue(CONFIG.batchStart) },
  { icon: Film, label: "রেকর্ডিং", value: "প্রতিটি ক্লাসের পর ড্যাশবোর্ডে" },
  { icon: MessagesSquare, label: "প্রশ্নোত্তর", value: "ক্লাসে ও WhatsApp গ্রুপে" },
];

export function LiveClass() {
  const platform = CONFIG.liveClass.platform;
  return (
    <section id="live-class" aria-labelledby="live-title" className="section bg-bg-soft">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border bg-bg-elevated py-2 pl-2 pr-4 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-black/5">
              <BrandLogo name="googleMeet" className="h-6 w-7" />
            </span>
            <span className="font-en font-bold text-text">{platform}</span>
          </Reveal>
          <SectionHeading
            id="live-title"
            align="left"
            title={`${platform}-এ সরাসরি Live Class`}
            className="mb-6 md:mb-8"
          >
            ভিডিও দেখে একা একা শেখার ঝামেলা নেই। প্রতিটি ক্লাস হবে {platform}-এ লাইভ, যেখানে আপনি সরাসরি প্রশ্ন করতে
            পারবেন আর স্ক্রিন শেয়ারে দেখে দেখে কাজ করতে পারবেন।
          </SectionHeading>
          <Reveal>
            <MeetIllustration />
          </Reveal>
        </div>

        <Reveal>
          <ul className="card divide-y divide-border p-2">
            <li className="flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/5">
                <BrandLogo name="googleMeet" className="h-5 w-6" />
              </span>
              <p className="min-w-0">
                <span className="block text-sm text-text-muted">প্ল্যাটফর্ম</span>
                <span className="block font-en text-lg font-bold text-text">{platform}</span>
              </p>
            </li>
            {INFO.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-4 p-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="min-w-0">
                  <span className="block text-sm text-text-muted">{label}</span>
                  <span className="block font-semibold text-text">{value}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** CSS-drawn Google Meet call: shared screen, participant tiles and the control bar. */
function MeetIllustration() {
  const people = [
    { initial: "A", color: "#7C3AED" },
    { initial: "S", color: "#0284C7" },
    { initial: "R", color: "#EA580C" },
  ];
  return (
    <div
      role="img"
      aria-label="Google Meet লাইভ ক্লাসে স্ক্রিন শেয়ারের চিত্র"
      className="overflow-hidden rounded-2xl border border-[#2A2F45] bg-[#202124] p-3 shadow-card"
    >
      <div className="flex items-center justify-between px-1 pb-2.5">
        <span className="inline-flex items-center gap-2">
          <BrandLogo name="googleMeet" className="h-4 w-5" />
          <span className="font-en text-xs font-semibold text-[#E8EAED]">Vibe Coding — Live</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D93025] px-2 py-0.5 font-en text-[11px] font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" /> LIVE
        </span>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-2">
        {/* shared screen */}
        <div className="flex aspect-video flex-col gap-1.5 rounded-xl bg-[#0C1030] p-3">
          <div className="flex items-center gap-1.5 font-en text-[10px] text-[#A9AEDB]">
            <MonitorUp className="h-3 w-3" aria-hidden /> Arif is presenting
          </div>
          <div className="mt-1 h-2 w-1/2 rounded bg-gradient-brand" />
          <div className="h-1.5 w-3/4 rounded bg-[#1F2566]" />
          <div className="h-1.5 w-2/3 rounded bg-[#1F2566]" />
          <div className="h-1.5 w-1/2 rounded bg-[#1F2566]" />
          <div className="mt-auto h-6 w-1/3 rounded-md bg-[#5B6BFF]" />
        </div>
        {/* participants */}
        <div className="grid gap-2">
          {people.slice(0, 2).map((p, i) => (
            <div key={p.initial} className="relative flex items-center justify-center rounded-xl bg-[#3C4043]">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full font-en text-sm font-bold text-white"
                style={{ background: p.color }}
              >
                {p.initial}
              </span>
              {i === 0 && (
                <span className="absolute inset-0 rounded-xl ring-2 ring-[#8AB4F8] motion-safe:animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {[Mic, Video, MonitorUp].map((Icon, i) => (
          <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C4043] text-[#E8EAED]">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ))}
        <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#D93025] text-white">
          <PhoneOff className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </div>
  );
}
