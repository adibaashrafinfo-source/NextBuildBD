import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { CONFIG } from "./src/config";

/** Fills SEO placeholders in index.html from src/config.ts so prices/links live in one place. */
function seoFromConfig(): Plugin {
  const priceBn = new Intl.NumberFormat("bn-BD").format(CONFIG.price);
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: CONFIG.courseName,
    description:
      "Google Meet-এ Live Class। Claude Code, Lovable ও Supabase দিয়ে Landing Page, Website ও SaaS বানানো শিখুন।",
    inLanguage: "bn",
    url: `${CONFIG.site.url}/`,
    image: `${CONFIG.site.url}/logo.png`,
    provider: {
      "@type": "Organization",
      name: CONFIG.brand,
      sameAs: [CONFIG.contact.facebook],
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: CONFIG.price,
      priceCurrency: CONFIG.priceCurrencyCode,
      availability: "https://schema.org/InStock",
      url: `${CONFIG.site.url}/#enroll`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      location: { "@type": "VirtualLocation", name: CONFIG.liveClass.platform },
      instructor: { "@type": "Person", name: CONFIG.instructor.name },
    },
  };
  return {
    name: "seo-from-config",
    transformIndexHtml(html) {
      return html
        .replaceAll("%PRICE_BN%", priceBn)
        .replaceAll("%SITE_URL%", CONFIG.site.url)
        .replace("%COURSE_JSON_LD%", JSON.stringify(courseJsonLd).replace(/</g, "\\u003c"));
    },
  };
}

export default defineConfig({
  plugins: [react(), seoFromConfig()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
