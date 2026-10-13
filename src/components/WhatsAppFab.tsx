import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { waLink } from "@/lib/utils";

/** Bottom-right WhatsApp button. Sits above the mobile sticky bar (bottom offset) so they never overlap. */
export function WhatsAppFab() {
  return (
    <aside aria-label="দ্রুত যোগাযোগ">
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ মেসেজ করুন"
        className="group fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgba(17,132,63,.7)] transition-transform hover:scale-105 hover:bg-whatsapp-hover motion-reduce:hover:scale-100 md:bottom-6 md:right-6"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-text px-3 py-1.5 text-sm font-medium text-bg opacity-0 shadow-card transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          মেসেজ করুন
        </span>
      </a>
    </aside>
  );
}
