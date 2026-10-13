import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, priceLabel } from "@/lib/utils";

/** Mobile-only bottom bar. Hidden at the very top and while the #enroll section is on screen. */
export function StickyEnrollBar() {
  const [enrollVisible, setEnrollVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const target = document.getElementById("enroll");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setEnrollVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(target);
    const onScroll = () => setPastHero(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const hidden = enrollVisible || !pastHero;

  return (
    <div
      aria-hidden={hidden}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border glass-elevated pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-15px_rgba(0,0,0,.35)] backdrop-blur-lg transition-transform duration-300 md:hidden",
        hidden ? "pointer-events-none translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-3">
        <div className="leading-tight">
          <div className="text-xl font-bold text-text">{priceLabel()}</div>
          <div className="text-xs text-text-muted">একবার পেমেন্ট, পুরো কোর্স</div>
        </div>
        <Button asChild size="sm" className="px-6" tabIndex={hidden ? -1 : undefined}>
          <a href="#enroll">এনরোল</a>
        </Button>
      </div>
    </div>
  );
}
