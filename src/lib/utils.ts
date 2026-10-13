import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONFIG, isTodo } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const bnNumber = new Intl.NumberFormat("bn-BD");

/** 1499 -> "১,৪৯৯" */
export const toBanglaNumber = (n: number) => bnNumber.format(n);

/** "১,৪৯৯৳" */
export const priceLabel = () => `${toBanglaNumber(CONFIG.price)}${CONFIG.currency}`;

/** wa.me link with a pre-filled message. */
export const waLink = (message: string = CONFIG.whatsappMessage) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

/** Shows a friendly fallback on the page while a config value is still a TODO. */
export const displayValue = (value: string, fallback = "শীঘ্রই জানানো হবে") => (isTodo(value) ? fallback : value);

const bnDateTime = new Intl.DateTimeFormat("bn-BD", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});

/** ISO timestamp -> Bangla date + time in Bangladesh time. */
export const formatDateTime = (iso: string) => bnDateTime.format(new Date(iso));

/** "01719686459" -> "01719-686459" (display only; copy the raw digits). */
export const formatPhone = (n: string) => (/^\d{11,12}$/.test(n) ? `${n.slice(0, 5)}-${n.slice(5)}` : n);
