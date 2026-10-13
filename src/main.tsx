import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CONFIG, isTodo } from "./config";
import "./index.css";

if (import.meta.env.DEV) {
  const pending = [
    ["payment.bkash.number", CONFIG.payment.bkash.number],
    ["payment.nagad.number", CONFIG.payment.nagad.number],
    ["payment.rocket.number", CONFIG.payment.rocket.number],
    ["whatsappGroupLink", CONFIG.whatsappGroupLink],
    ["liveClass.schedule", CONFIG.liveClass.schedule],
    ["batchStart", CONFIG.batchStart],
  ].filter(([, v]) => isTodo(v));
  if (pending.length) console.warn("[NextBuildBD] config.ts TODO values:", pending.map(([k]) => k).join(", "));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
