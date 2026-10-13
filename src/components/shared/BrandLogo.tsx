import airbnb from "@/assets/logos/airbnb.svg";
import canva from "@/assets/logos/canva.svg";
import claude from "@/assets/logos/claude.svg";
import facebook from "@/assets/logos/facebook.svg";
import github from "@/assets/logos/github.svg";
import githubDark from "@/assets/logos/github-dark.svg";
import googleMeet from "@/assets/logos/google-meet.svg";
import lovable from "@/assets/logos/lovable.svg";
import react from "@/assets/logos/react.svg";
import shopify from "@/assets/logos/shopify.svg";
import supabase from "@/assets/logos/supabase.svg";
import tailwindcss from "@/assets/logos/tailwindcss.svg";
import typescript from "@/assets/logos/typescript.svg";
import vercel from "@/assets/logos/vercel.svg";
import vercelDark from "@/assets/logos/vercel-dark.svg";
import youtube from "@/assets/logos/youtube.svg";
import { cn } from "@/lib/utils";

/** Official brand marks (original colours). `dark` = variant for the dark theme where the mark is black. */
const LOGOS = {
  claude: { src: claude },
  lovable: { src: lovable },
  supabase: { src: supabase },
  react: { src: react },
  typescript: { src: typescript },
  github: { src: github, dark: githubDark },
  vercel: { src: vercel, dark: vercelDark },
  tailwindcss: { src: tailwindcss },
  googleMeet: { src: googleMeet },
  facebook: { src: facebook },
  youtube: { src: youtube },
  canva: { src: canva },
  shopify: { src: shopify },
  airbnb: { src: airbnb },
} satisfies Record<string, { src: string; dark?: string }>;

export type BrandName = keyof typeof LOGOS;

/**
 * Decorative by default (the brand name is always written next to it).
 * `onLight` forces the original (dark) mark, e.g. on a white tile inside the dark theme.
 */
export function BrandLogo({
  name,
  className,
  alt = "",
  onLight = false,
}: {
  name: BrandName;
  className?: string;
  alt?: string;
  onLight?: boolean;
}) {
  const logo: { src: string; dark?: string } = LOGOS[name];
  const img = (src: string, extra?: string) => (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("object-contain", className, extra)}
    />
  );
  if (!logo.dark || onLight) return img(logo.src);
  return (
    <>
      {img(logo.src, "dark:hidden")}
      {img(logo.dark, "hidden dark:block")}
    </>
  );
}
