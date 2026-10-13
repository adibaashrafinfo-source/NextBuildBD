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
  whatsappGroupLink: "https://chat.whatsapp.com/XXXX", // TODO: replace
  whatsappMessage: "আসসালামু আলাইকুম, কোর্স সম্পর্কে জানতে চাই।",
  whatsappPaymentMessage: "আসসালামু আলাইকুম, পেমেন্ট নিয়ে সাহায্য দরকার।",

  payment: {
    bkash: { number: "01XXXXXXXXX", type: "Personal / Send Money" }, // TODO
    nagad: { number: "01XXXXXXXXX", type: "Personal / Send Money" }, // TODO
    rocket: { number: "01XXXXXXXXXX", type: "Personal / Send Money" }, // TODO
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
    photo: "/instructor.jpg", // TODO: replace public/instructor.jpg with the real photo
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
