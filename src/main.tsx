import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CONFIG, isTodo } from "./config";
import { isPortalPath } from "./portal/router";
import "./index.css";

if (import.meta.env.DEV) {
  const pending = [
    ["payment.bkash.number", CONFIG.payment.bkash.number],
    ["payment.nagad.number", CONFIG.payment.nagad.number],
    ["payment.rocket.number", CONFIG.payment.rocket.number],
    ["liveClass.schedule", CONFIG.liveClass.schedule],
    ["batchStart", CONFIG.batchStart],
  ].filter(([, v]) => isTodo(v));
  if (pending.length) console.warn("[NextBuildBD] config.ts TODO values:", pending.map(([k]) => k).join(", "));
  if (!import.meta.env.VITE_SUPABASE_URL) console.warn("[NextBuildBD] Supabase not configured (.env) — see README.");
}

const root = createRoot(document.getElementById("root")!);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

// /login, /dashboard and /admin are the student/admin portal: a separate chunk with supabase-js,
// so the landing page's first load stays as small as before.
if (isPortalPath(window.location.pathname)) {
  import("./portal/PortalApp").then(({ default: PortalApp }) => render(<PortalApp />));
} else {
  render(<App />);
}
