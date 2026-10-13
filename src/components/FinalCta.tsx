import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Reveal } from "@/components/shared/Reveal";
import { priceLabel, waLink } from "@/lib/utils";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-gradient-cta text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"
      />
      <Reveal className="container relative flex flex-col items-center gap-5 py-16 text-center md:py-24">
        <h2 id="final-cta-title" className="text-3xl font-bold md:text-[42px] md:leading-tight">
          আপনার আইডিয়াটা অপেক্ষা করছে।
        </h2>
        <p className="max-w-2xl text-lg text-white md:text-xl">
          আজ শুরু করলে কয়েক সপ্তাহ পরে আপনার হাতে থাকবে নিজের বানানো লাইভ প্রোডাক্ট।
        </p>
        <div className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="white"
            className="focus-visible:ring-white focus-visible:ring-offset-[#4338F0]"
          >
            <a href="#enroll">{priceLabel()}-এ এনরোল করুন</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outlineWhite"
            className="focus-visible:ring-white focus-visible:ring-offset-[#4338F0]"
          >
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              WhatsApp-এ কথা বলুন
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
