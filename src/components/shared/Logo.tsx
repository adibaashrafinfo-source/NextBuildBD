import { CONFIG } from "@/config";
import { cn } from "@/lib/utils";

/**
 * The full logo (public/logo.png) is a square artwork with its own wordmark,
 * too small to read at header height. Per spec §0 we use the "N" mark cropped
 * from it (public/logo-mark.png) plus a live-text wordmark that adapts to both themes.
 */
export function Logo({ className }: { className?: string }) {
  const brand = CONFIG.brand;
  const main = brand.endsWith("BD") ? brand.slice(0, -2) : brand;
  const tail = brand.endsWith("BD") ? "BD" : "";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/logo-mark.webp"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 rounded-[10px] ring-1 ring-border sm:h-10 sm:w-10"
      />
      <span className="font-en text-lg font-extrabold tracking-tight text-text sm:text-xl">
        {main}
        <span className="text-brand-strong">{tail}</span>
      </span>
    </span>
  );
}
