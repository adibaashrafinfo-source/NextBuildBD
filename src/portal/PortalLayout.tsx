import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CONFIG } from "@/config";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Link } from "./Link";
import { navigate, usePathname } from "./router";

export function PortalLayout({
  session,
  isAdmin,
  children,
}: {
  session: Session | null;
  isAdmin: boolean;
  children: ReactNode;
}) {
  const path = usePathname();
  const signOut = async () => {
    await supabase?.auth.signOut();
    navigate("/login", { replace: true });
  };

  const tabs = session
    ? [{ href: "/dashboard", label: "ড্যাশবোর্ড" }, ...(isAdmin ? [{ href: "/admin", label: "অ্যাডমিন" }] : [])]
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-bg-elevated focus:px-4 focus:py-3 focus:font-semibold focus:text-text focus:shadow-card"
      >
        মূল কনটেন্টে যান
      </a>
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-2">
          <a href="/" aria-label="NextBuildBD — হোম পেজে যান" className="shrink-0 rounded-lg">
            <Logo />
          </a>
          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.length > 1 && (
              <nav aria-label="পোর্টাল মেনু" className="hidden sm:block">
                <ul className="flex gap-1">
                  {tabs.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        aria-current={path === t.href ? "page" : undefined}
                        className={cn(
                          "inline-flex h-11 items-center rounded-xl px-3 font-semibold transition-colors",
                          path === t.href ? "bg-brand-soft text-brand-strong" : "text-text-muted hover:text-text",
                        )}
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <ThemeToggle />
            {session && (
              <Button variant="secondary" size="sm" onClick={signOut} className="px-3">
                <LogOut aria-hidden />
                <span className="hidden sm:inline">লগআউট</span>
                <span className="sr-only sm:hidden">লগআউট</span>
              </Button>
            )}
          </div>
        </div>
        {tabs.length > 1 && (
          <nav aria-label="পোর্টাল মেনু (মোবাইল)" className="container pb-2 sm:hidden">
            <ul className="flex gap-1">
              {tabs.map((t) => (
                <li key={t.href} className="flex-1">
                  <Link
                    href={t.href}
                    aria-current={path === t.href ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-xl font-semibold",
                      path === t.href ? "bg-brand-soft text-brand-strong" : "text-text-muted",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="portal-main" className="container flex-1 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
        © <span className="num">{CONFIG.site.copyrightYear}</span> {CONFIG.brand}. সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}
