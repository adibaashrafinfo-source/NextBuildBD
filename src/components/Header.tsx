import { useEffect, useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn, waLink } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "কোর্স সম্পর্কে" },
  { href: "#curriculum", label: "কারিকুলাম" },
  { href: "#facilities", label: "সুবিধা" },
  { href: "#pricing", label: "মূল্য" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "glass border-border" : "border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-2 md:h-[72px]">
        <a href="#top" aria-label="NextBuildBD — পেজের শুরুতে যান" className="shrink-0 rounded-lg">
          <Logo />
        </a>

        <nav aria-label="মূল মেনু" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-1 font-medium text-text-muted transition-colors hover:text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp-এ মেসেজ করুন"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated text-whatsapp transition-colors hover:border-whatsapp sm:inline-flex"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href="/login"
            className="hidden h-11 items-center rounded-xl px-3 font-semibold text-text-muted transition-colors hover:text-text lg:inline-flex"
          >
            লগইন
          </a>
          <Button asChild size="sm" className="px-3 sm:px-4">
            <a href="#enroll">
              <span>
                এনরোল<span className="hidden sm:inline"> করুন</span>
              </span>
            </a>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-text hover:bg-brand-soft lg:hidden"
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="মোবাইল মেনু" className="border-t border-border bg-bg lg:hidden">
          <ul className="container flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-lg px-2 font-medium text-text hover:bg-brand-soft"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/login"
                className="flex min-h-12 items-center gap-2 rounded-lg px-2 font-medium text-text hover:bg-brand-soft"
              >
                <LogIn className="h-5 w-5 text-brand-strong" aria-hidden /> স্টুডেন্ট লগইন
              </a>
            </li>
            <li className="sm:hidden">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center gap-2 rounded-lg px-2 font-medium text-text hover:bg-brand-soft"
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" /> WhatsApp-এ মেসেজ করুন
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
