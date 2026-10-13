import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-3 md:mb-14",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <span className="rounded-full border border-border bg-bg-elevated px-3.5 py-1 text-sm font-semibold text-brand-strong">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="text-[26px] font-bold text-text sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {children && <div className="text-text-muted md:text-lg">{children}</div>}
    </Reveal>
  );
}
