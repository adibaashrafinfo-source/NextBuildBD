import { Hammer, LifeBuoy, PlayCircle, Sprout } from "lucide-react";

const ITEMS = [
  { icon: Sprout, title: "শূন্য থেকে শুরু", sub: "Beginner Friendly" },
  { icon: PlayCircle, title: "Live + Recorded", sub: "মিস করলেও সমস্যা নেই" },
  { icon: Hammer, title: "Real Project", sub: "হাতে-কলমে বানানো" },
  { icon: LifeBuoy, title: "WhatsApp Support", sub: "আটকে গেলে সাহায্য" },
];

export function TrustStrip() {
  return (
    <section aria-label="কোর্সের মূল বৈশিষ্ট্য" className="container">
      <ul className="card grid grid-cols-1 gap-x-6 gap-y-5 p-5 min-[480px]:grid-cols-2 md:p-7 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-cta text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-snug">
              <span className="block font-bold text-text">{title}</span>
              <span className="block text-[15px] text-text-muted">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
