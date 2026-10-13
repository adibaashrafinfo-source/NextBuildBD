import { CalendarDays, Film, MessagesSquare, Rocket, Video } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG } from "@/config";
import { displayValue } from "@/lib/utils";

const INFO = [
  { icon: Video, label: "প্ল্যাটফর্ম", value: CONFIG.liveClass.platform, strong: true },
  { icon: CalendarDays, label: "ক্লাসের সময়", value: displayValue(CONFIG.liveClass.schedule) },
  { icon: Rocket, label: "ব্যাচ শুরু", value: displayValue(CONFIG.batchStart) },
  { icon: Film, label: "রেকর্ডিং", value: "প্রতিটি ক্লাসের পর ড্যাশবোর্ডে" },
  { icon: MessagesSquare, label: "প্রশ্নোত্তর", value: "ক্লাসে ও WhatsApp গ্রুপে" },
];

export function LiveClass() {
  return (
    <section id="live-class" aria-labelledby="live-title" className="section bg-bg-soft">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading
            id="live-title"
            align="left"
            eyebrow="Live Class"
            title={`${CONFIG.liveClass.platform}-এ সরাসরি Live Class`}
            className="mb-6 md:mb-8"
          >
            ভিডিও দেখে একা একা শেখার ঝামেলা নেই। প্রতিটি ক্লাস হবে {CONFIG.liveClass.platform}-এ লাইভ, যেখানে আপনি
            সরাসরি প্রশ্ন করতে পারবেন আর স্ক্রিন শেয়ারে দেখে দেখে কাজ করতে পারবেন।
          </SectionHeading>
          <Reveal>
            <MeetIllustration />
          </Reveal>
        </div>

        <Reveal>
          <ul className="card divide-y divide-border p-2">
            {INFO.map(({ icon: Icon, label, value, strong }) => (
              <li key={label} className="flex items-center gap-4 p-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="min-w-0">
                  <span className="block text-sm text-text-muted">{label}</span>
                  <span className={strong ? "block text-lg font-bold text-text" : "block font-semibold text-text"}>
                    {value}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Small CSS-drawn video-call grid that suggests a live class with screen share. */
function MeetIllustration() {
  return (
    <div
      role="img"
      aria-label="Google Meet লাইভ ক্লাসে স্ক্রিন শেয়ারের চিত্র"
      className="overflow-hidden rounded-2xl border border-[#1F2566] bg-[#0C1030] p-3"
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 font-en text-[11px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
        </span>
        <span className="font-en text-xs text-[#A9AEDB]">Screen sharing</span>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        <div className="flex aspect-video flex-col gap-1.5 rounded-xl bg-[#11164A] p-3">
          <div className="h-2 w-1/2 rounded bg-gradient-brand" />
          <div className="h-1.5 w-3/4 rounded bg-[#1F2566]" />
          <div className="h-1.5 w-2/3 rounded bg-[#1F2566]" />
          <div className="mt-auto h-6 w-1/3 rounded-md bg-[#5B6BFF]" />
        </div>
        <div className="grid gap-2">
          {["#7FA6FF", "#A98CFF"].map((c) => (
            <div key={c} className="flex items-center justify-center rounded-xl bg-[#11164A]">
              <span className="h-7 w-7 rounded-full" style={{ background: c }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
