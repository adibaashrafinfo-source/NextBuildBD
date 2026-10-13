import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PortalLayout } from "./PortalLayout";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { AdminPage } from "./AdminPage";
import { navigate, usePathname } from "./router";
import { useSession } from "./useSession";

const TITLES: Record<string, string> = {
  "/login": "লগইন — NextBuildBD",
  "/dashboard": "স্টুডেন্ট ড্যাশবোর্ড — NextBuildBD",
  "/admin": "অ্যাডমিন — NextBuildBD",
};

/** Safe post-login destination: only our own portal routes. */
function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next === "/admin" || next === "/dashboard" ? next : "/dashboard";
}

/**
 * Student / admin portal (/login, /dashboard, /admin). Loaded as its own chunk from main.tsx,
 * so the landing page never downloads supabase-js or this code.
 */
export default function PortalApp() {
  const path = usePathname();
  const { loading, session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = session?.user.id;

  useEffect(() => {
    document.title = TITLES[path] ?? "NextBuildBD";
  }, [path]);

  useEffect(() => {
    // Private pages: keep them out of search results.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!supabase || !userId) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    supabase.rpc("is_admin").then(({ data }) => active && setIsAdmin(data === true));
    return () => {
      active = false;
    };
  }, [userId]);

  // Route guards
  useEffect(() => {
    if (loading || !supabase) return;
    if (path === "/login" && session) navigate(nextPath(), { replace: true });
    if ((path === "/dashboard" || path === "/admin") && !session) navigate(`/login?next=${path}`, { replace: true });
  }, [loading, path, session]);

  if (!supabase) {
    return (
      <PortalLayout session={null} isAdmin={false}>
        <div className="card mx-auto max-w-lg p-8 text-center">
          <h1 className="text-xl font-bold">পোর্টাল এখনো চালু হয়নি</h1>
          <p className="mt-3 text-text-muted">
            Supabase কনফিগার করা নেই। <code className="font-en">.env</code> ফাইলে{" "}
            <code className="font-en">VITE_SUPABASE_URL</code> ও{" "}
            <code className="font-en">VITE_SUPABASE_PUBLISHABLE_KEY</code> দিন (README দেখুন)।
          </p>
        </div>
      </PortalLayout>
    );
  }

  const waiting = loading || (path === "/login" && session) || (path !== "/login" && !session);

  return (
    <PortalLayout session={session} isAdmin={isAdmin}>
      {waiting ? (
        <div className="flex justify-center py-24" role="status" aria-label="লোড হচ্ছে">
          <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
        </div>
      ) : path === "/login" ? (
        <LoginPage next={nextPath()} />
      ) : path === "/admin" ? (
        <AdminPage isAdmin={isAdmin} session={session!} />
      ) : (
        <DashboardPage session={session!} />
      )}
    </PortalLayout>
  );
}
