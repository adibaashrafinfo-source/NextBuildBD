import { useEffect, useState } from "react";

/** The portal has three routes, so a few lines of history handling replace a router dependency. */
export const PORTAL_PATHS = ["/login", "/dashboard", "/admin"] as const;
export type PortalPath = (typeof PORTAL_PATHS)[number];

export const isPortalPath = (pathname: string) => PORTAL_PATHS.some((p) => pathname === p || pathname === `${p}/`);

const EVENT = "nbbd:navigate";

export function navigate(to: string, { replace = false } = {}) {
  if (replace) history.replaceState(null, "", to);
  else history.pushState(null, "", to);
  window.dispatchEvent(new Event(EVENT));
  window.scrollTo(0, 0);
}

export function usePathname() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, "") || "/");
  useEffect(() => {
    const sync = () => setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener("popstate", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);
  return path;
}
