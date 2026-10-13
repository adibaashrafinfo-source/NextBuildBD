import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG } from "@/config";
import { toBanglaNumber } from "@/lib/utils";

const FAQS = [
  {
    q: "কোডিং না জানলে কি করতে পারব?",
    a: "হ্যাঁ। কোর্সটি একদম শূন্য থেকে শুরু। আপনি শিখবেন AI-কে কীভাবে সঠিক নির্দেশ দিয়ে কাজ করাতে হয়।",
  },
  {
    q: "ক্লাস কীভাবে হবে?",
    a: `${CONFIG.liveClass.platform}-এ লাইভ ক্লাস হবে। প্রতিটি ক্লাসের রেকর্ডিং ড্যাশবোর্ডে পাবেন।`,
  },
  {
    q: "ক্লাস মিস করলে কী হবে?",
    a: "সমস্যা নেই। রেকর্ডিং দেখে নিতে পারবেন, আর গ্রুপে প্রশ্ন করতে পারবেন।",
  },
  {
    q: "কোর্স ফি কত?",
    a: `মাত্র ${toBanglaNumber(CONFIG.price)} টাকা, একবারই। কোনো হিডেন চার্জ নেই।`,
  },
  {
    q: "পেমেন্ট কীভাবে করব?",
    a: "bKash, Nagad বা Rocket-এ Send Money করে Transaction ID (TrxID) ফর্মে জমা দিন। অ্যাডমিন যাচাই করলে আপনার ড্যাশবোর্ড চালু হয়ে যাবে।",
  },
  {
    q: "পেমেন্ট ভেরিফাই হতে কতক্ষণ লাগে?",
    a: "সাধারণত অল্প সময়ে। দেরি হলে WhatsApp-এ মেসেজ দিন।",
  },
  {
    q: "কোর্সে কত খরচ করে শুরু করা যায়?",
    a: `Hosting ও Database ফ্রি টায়ারে শুরু করা যায়। শুধু একটি AI সাবস্ক্রিপশন (প্রায় ${CONFIG.aiSubscriptionCost}/মাস) দরকার হতে পারে।`,
  },
  {
    q: "কোর্স করলেই কি আয় নিশ্চিত?",
    a: "আয়ের নিশ্চয়তা কেউ দিতে পারে না। আমরা স্কিল ও ক্লায়েন্ট পাওয়ার পদ্ধতি শেখাই, ফলাফল আপনার প্র্যাকটিস ও কাজের ওপর নির্ভর করে।",
  },
  {
    q: "ল্যাপটপ না থাকলে?",
    a: "একটি ল্যাপটপ/ডেস্কটপ ও ইন্টারনেট থাকলে সবচেয়ে ভালো। মোবাইলে সীমিতভাবে সম্ভব।",
  },
  {
    q: "ব্যবসার জন্য নিজের সফটওয়্যার বানাতে চাই, এই কোর্স কি কাজে লাগবে?",
    a: "অবশ্যই। কোর্সের একটা বড় অংশ জুড়েই আছে নিজের ব্যবসার ওয়েবসাইট ও সফটওয়্যার বানানো।",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="container max-w-3xl">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="সাধারণ প্রশ্নোত্তর" />
        <Reveal>
          <Accordion type="single" collapsible defaultValue="q-0" className="flex flex-col gap-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`q-${i}`}>
                <AccordionTrigger className="text-[17px] text-text">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
