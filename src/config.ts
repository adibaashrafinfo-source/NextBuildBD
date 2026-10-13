/**
 * Single source of truth for every price, number and link on the page.
 * Components must read from here — never hardcode these values.
 * Search for "TODO" to find values the owner still has to fill in.
 */
export const CONFIG = {
  brand: "NextBuildBD",
  tagline: "Learn. Build. Launch.",
  courseName: "NextBuildBD Vibe Coding Course",
  price: 1499,
  currency: "৳",
  priceCurrencyCode: "BDT",

  whatsappNumber: "8801719686459", // TODO: owner confirm
  whatsappDisplay: "01719-686459", // TODO: owner confirm (shown in footer)
  // The WhatsApp group link is private (verified students only): set it in /admin → সেটিংস.
  whatsappMessage: "আসসালামু আলাইকুম, কোর্স সম্পর্কে জানতে চাই।",
  whatsappPaymentMessage: "আসসালামু আলাইকুম, পেমেন্ট নিয়ে সাহায্য দরকার।",

  /** Digits only (what the Copy button copies); shown formatted as 01719-686459. */
  payment: {
    bkash: { number: "01719686459", type: "Personal / Send Money" },
    nagad: { number: "01719686459", type: "Personal / Send Money" },
    // TODO: owner confirm — Rocket accounts are usually the mobile number + 1 extra check digit (12 digits)
    rocket: { number: "01719686459", type: "Personal / Send Money" },
  },

  liveClass: { platform: "Google Meet", schedule: "TODO: দিন ও সময়" }, // TODO
  batchStart: "TODO: তারিখ", // TODO
  seatsLeft: null as number | null, // null হলে seat counter দেখাবে না
  showGuarantee: false, // owner সিদ্ধান্ত না নিলে false
  guaranteeText: "", // TODO: showGuarantee true করলে owner-এর লেখা শর্ত এখানে দিন

  /** Approx. monthly AI subscription cost shown in the Cost section and FAQ. */
  aiSubscriptionCost: "$20",

  instructor: {
    name: "Ashraful Islam (Arif)",
    photo: "/instructor.webp",
    photoFallback: "/instructor.jpg",
    facebook: "https://facebook.com/ashraf.arif2000",
    website: "https://abrarit.com",
  },

  contact: {
    email: "asrafulislam2000@gmail.com",
    facebook: "https://facebook.com/ashraf.arif2000",
  },

  site: {
    url: "https://nextbuildbd.com", // TODO: final production domain (used in SEO tags)
    copyrightYear: 2026,
  },
};

export type PaymentMethod = keyof typeof CONFIG.payment;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
};

/** True while a config value still holds its placeholder. */
export const isTodo = (value: string) => value.startsWith("TODO") || value.includes("XXXX");
