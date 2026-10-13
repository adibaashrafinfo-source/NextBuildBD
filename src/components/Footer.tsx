import { Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FacebookIcon, WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Logo } from "@/components/shared/Logo";
import { CONFIG } from "@/config";
import { waLink } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "#about", label: "কোর্স সম্পর্কে" },
  { href: "#curriculum", label: "কারিকুলাম" },
  { href: "#pricing", label: "মূল্য" },
  { href: "#faq", label: "FAQ" },
  { href: "/login", label: "স্টুডেন্ট লগইন" },
];

const linkClass = "inline-flex min-h-10 items-center gap-2 text-text-muted transition-colors hover:text-text";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg pb-24 pt-14 md:pb-10">
      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <a href="#top" aria-label="NextBuildBD — পেজের শুরুতে যান" className="self-start rounded-lg">
            <Logo />
          </a>
          <p className="font-en font-semibold text-text-muted">{CONFIG.tagline}</p>
        </div>

        <nav aria-label="ফুটার লিংক">
          <h2 className="mb-2 font-bold text-text">লিংক</h2>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-2 font-bold text-text">যোগাযোগ</h2>
          <ul>
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                <span>
                  WhatsApp: <span className="num">{CONFIG.whatsappDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONFIG.contact.email}`} className={`${linkClass} break-all`}>
                <Mail className="h-5 w-5 shrink-0 text-brand-strong" aria-hidden />
                <span className="num">{CONFIG.contact.email}</span>
              </a>
            </li>
            <li>
              <a href={CONFIG.contact.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                <span className="font-en">Facebook</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-12">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-text-muted sm:flex-row">
          <p>
            © <span className="num">{CONFIG.site.copyrightYear}</span> {CONFIG.brand}. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-4">
            <PolicyDialog title="Privacy Policy" />
            <PolicyDialog title="Terms" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Placeholder until the owner provides real Privacy Policy / Terms pages. */
function PolicyDialog({ title }: { title: string }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex min-h-10 items-center rounded-md font-en underline-offset-4 hover:text-text hover:underline">
        {title}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-en">{title}</DialogTitle>
        <DialogDescription>
          এই পেজটি শীঘ্রই যুক্ত করা হবে। কোনো প্রশ্ন থাকলে{" "}
          <a href={`mailto:${CONFIG.contact.email}`} className="font-semibold text-brand-strong underline">
            ইমেইল করুন
          </a>
          ।
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
