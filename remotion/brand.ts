import { staticFile } from "remotion";

export const BRAND = {
  name: "Abrar IT",
  url: "www.abrarit.com",
  /** The brand tagline stays in English: it is part of the logo lock-up and is spoken in English. */
  tagline: "Your Journey to Digital Excellence",
  /** The original logo asset. Rendered as-is — never recoloured or redrawn. */
  logo: () => staticFile("abrar-it-logo.png"),
  logoAspect: 1249 / 351,
} as const;

/**
 * Contact number supplied by the owner and read aloud in the voice-over at
 * 27.58s. Shown on screen beside the WhatsApp button at that moment.
 */
export const PHONE = "01719686459";

/**
 * Click destination for the floating WhatsApp button, built from PHONE in
 * international form. Only meaningful in the interactive <Player> preview —
 * an MP4 carries no links. Set to null to render the button without a target.
 */
export const WHATSAPP_URL: string | null = `https://wa.me/88${PHONE}`;

/**
 * On-screen copy, in Bangla, following the narration phrase by phrase.
 * Each entry notes the spoken line it accompanies.
 */
export const COPY = {
  // "আপনার ব্যবসার কি এখনো কোনো প্রফেশনাল ওয়েবসাইট নেই?"
  hook: {
    line1: "আপনার ব্যবসার কি এখনো",
    line2: "কোনো প্রফেশনাল",
    line3: "ওয়েবসাইট নেই?",
  },
  // "তাহলে প্রতিদিন হারাচ্ছেন সম্ভাব্য কাস্টমারের বিশ্বাস ও নতুন ব্যবসার সুযোগ!"
  loss: {
    line1: "প্রতিদিন হারাচ্ছেন",
    line2: "কাস্টমারের বিশ্বাস",
    line3: "ও নতুন ব্যবসার সুযোগ!",
  },
  // "Abrar IT দিচ্ছে আধুনিক, দ্রুতগতির ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট..."
  showcase: {
    modern: "আধুনিক ডিজাইন",
    fast: "দ্রুতগতির",
    mobile: "মোবাইল-ফ্রেন্ডলি",
    brand: "আপনার ব্র্যান্ডকে তুলে ধরে",
    pro: "আরও প্রফেশনালভাবে",
  },
  // "বিজনেস ওয়েবসাইট হোক কিংবা ই-কমার্স স্টোর— ... স্মার্ট ও কাস্টমাইজড ওয়েব সলিউশন।"
  solutions: {
    business: "বিজনেস ওয়েবসাইট",
    shop: "ই-কমার্স স্টোর",
    custom: "কাস্টম ওয়েব সলিউশন",
    customSub: "স্মার্ট ও কাস্টমাইজড",
  },
  // "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে আজই যোগাযোগ করুন"
  cta: {
    lead: "আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে",
    headline: "আজই যোগাযোগ করুন",
  },
} as const;
