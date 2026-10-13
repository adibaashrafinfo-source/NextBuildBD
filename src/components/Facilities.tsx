import { BookOpenText, FileCode2, LayoutDashboard, MonitorPlay, RefreshCw, Users, Video, Wand2 } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Video, title: "Google Meet-এ Live Class", body: "সরাসরি প্রশ্ন করুন, স্ক্রিন শেয়ারে দেখে দেখে শিখুন।" },
  { icon: MonitorPlay, title: "Class Recording", body: "মিস হলে বা আবার দেখতে চাইলে রেকর্ডিং দেখুন।" },
  { icon: Wand2, title: "Real Project Walkthrough", body: "Landing Page থেকে পূর্ণাঙ্গ LMS/SaaS বানানো।" },
  {
    icon: BookOpenText,
    title: "Ready Prompt Library",
    body: "Claude Code ও Lovable-এর প্রম্পট, সরাসরি কপি করে কাজে লাগান।",
  },
  { icon: FileCode2, title: "Source Code ও Template", body: "প্রজেক্ট ফাইল ও টেমপ্লেট।" },
  { icon: Users, title: "WhatsApp Community", body: "গ্রুপে জয়েন করুন, আটকে গেলে সাহায্য নিন।" },
  { icon: LayoutDashboard, title: "Student Dashboard", body: "নিজের ড্যাশবোর্ডে সব ক্লাস ও রিসোর্স এক জায়গায়।" },
  { icon: RefreshCw, title: "নতুন কনটেন্ট আপডেট", body: "টুল বদলালে নতুন ভিডিও ও নোট যুক্ত হবে।" },
];

export function Facilities() {
  return (
    <section id="facilities" aria-labelledby="facilities-title" className="section bg-bg-soft">
      <div className="container">
        <SectionHeading id="facilities-title" eyebrow="সুবিধা" title="কোর্সে আপনি যা যা পাচ্ছেন" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => {
            const featured = i === 0; // Google Meet live class is the headline facility
            return (
              <Reveal
                as="li"
                key={title}
                delay={(i % 4) * 0.05}
                className={cn("card flex flex-col gap-3 p-6", featured && "ring-2 ring-brand")}
              >
                <span
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-2xl",
                    featured ? "bg-gradient-cta text-white" : "bg-brand-soft text-brand-strong",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-text">{title}</h3>
                <p className="text-[15px] text-text-muted">{body}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
