import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { isPortalPath, navigate } from "./router";

/** In-portal link. Links that leave the portal (e.g. "/") are plain full-page navigations. */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!isPortalPath(new URL(href, window.location.origin).pathname)) return;
    e.preventDefault();
    navigate(href);
  };
  return <a href={href} onClick={handle} {...rest} />;
}
