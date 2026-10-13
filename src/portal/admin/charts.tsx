import { useId, useState, type KeyboardEvent } from "react";
import { cn, toBanglaNumber } from "@/lib/utils";

/*
 * Small single-series charts for the admin overview, in plain HTML/CSS.
 * One series → one hue (--brand, validated ≥3:1 on the card surface in both themes), no legend box:
 * the title names what is plotted. Marks: ≤24px thick, 4px rounded data-end, square at the baseline,
 * 2px surface gap between neighbours; text always uses text tokens, never the bar colour.
 */

export type Bucket = { label: string; short: string; value: number };

/** Round the axis top up to a clean number so the middle tick is a whole number too. */
function niceMax(max: number) {
  if (max <= 4) return 4;
  const step = max <= 20 ? 2 : max <= 100 ? 10 : 50;
  const top = Math.ceil(max / step) * step;
  return top % 2 === 0 ? top : top + step;
}

export function ColumnChart({ title, subtitle, buckets, unit }: { title: string; subtitle: string; buckets: Bucket[]; unit: string }) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();
  const max = Math.max(0, ...buckets.map((b) => b.value));
  // +1 headroom so the tallest column's value label sits inside the plot, not on the top tick.
  const top = niceMax(max + 1);
  const peak = max > 0 ? buckets.findIndex((b) => b.value === max) : -1;
  const n = buckets.length;
  const describe = (b: Bucket) => `${b.label}: ${toBanglaNumber(b.value)}${unit}`;

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
    if (e.key in keys) setActive((a) => Math.min(n - 1, Math.max(0, (a ?? n - 1) + keys[e.key])));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else return;
    e.preventDefault();
  };

  return (
    <figure className="card flex min-w-0 flex-col gap-3 p-5 sm:p-6" aria-labelledby={`${id}-title`}>
      <figcaption>
        <h3 id={`${id}-title`} className="text-lg font-bold">
          {title}
        </h3>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </figcaption>

      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        {/* y-axis ticks */}
        <div className="num relative h-44 w-6 text-right text-xs tabular-nums text-text-muted" aria-hidden>
          {[top, top / 2, 0].map((t, i) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${i * 50}%` }}>
              {toBanglaNumber(t)}
            </span>
          ))}
        </div>

        <div
          tabIndex={0}
          role="group"
          aria-label={`${title} চার্ট। তীর চিহ্ন দিয়ে ${n}টি কলামের মান শুনুন।`}
          onKeyDown={onKey}
          onFocus={() => setActive((a) => a ?? n - 1)}
          onBlur={() => setActive(null)}
          onPointerLeave={() => setActive(null)}
          className="relative h-44 rounded-sm focus-visible:outline-offset-4"
        >
          {/* hairline gridlines */}
          {[0, 50, 100].map((p) => (
            <span key={p} aria-hidden className="absolute inset-x-0 border-t border-border" style={{ top: `${p}%` }} />
          ))}

          <div className="absolute inset-0 flex items-end gap-[2px]" aria-hidden>
            {buckets.map((b, i) => (
              <div key={i} className="relative flex h-full flex-1 items-end justify-center" onPointerEnter={() => setActive(i)}>
                {i === peak && (
                  <span
                    className="num absolute left-1/2 -translate-x-1/2 -translate-y-full pb-1 text-xs font-semibold text-text"
                    style={{ bottom: `${(b.value / top) * 100}%` }}
                  >
                    {toBanglaNumber(b.value)}
                  </span>
                )}
                <span
                  className={cn("block rounded-t-[4px] transition-colors", active === i ? "bg-brand-strong" : "bg-brand")}
                  style={{ width: "min(24px, 100%)", height: `${(b.value / top) * 100}%` }}
                />
              </div>
            ))}
          </div>

          {max === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-[15px] text-text-muted">এই সময়ে কোনো জমা নেই</p>
          )}

          {active !== null && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-lg border border-border bg-bg-elevated px-3 py-2 shadow-card",
                active < n / 4 ? "translate-x-0" : active > (n * 3) / 4 ? "-translate-x-full" : "-translate-x-1/2",
              )}
              style={{ left: `${((active + (active < n / 4 ? 0 : active > (n * 3) / 4 ? 1 : 0.5)) / n) * 100}%` }}
            >
              <span className="num block text-base font-bold text-text">
                {toBanglaNumber(buckets[active].value)}
                {unit}
              </span>
              <span className="block text-xs text-text-muted">{buckets[active].label}</span>
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {active !== null ? describe(buckets[active]) : ""}
          </span>
        </div>

        {/* x-axis: first, middle, last */}
        <div />
        <div className="relative mt-1.5 h-5 text-xs text-text-muted" aria-hidden>
          {[0, Math.floor((n - 1) / 2), n - 1].map((i, k) => (
            <span
              key={k}
              className={cn("absolute whitespace-nowrap", k === 0 ? "left-0" : k === 2 ? "right-0" : "-translate-x-1/2")}
              style={k === 1 ? { left: `${((i + 0.5) / n) * 100}%` } : undefined}
            >
              {buckets[i].short}
            </span>
          ))}
        </div>
      </div>

      <details className="text-[15px]">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-brand-strong">টেবিল আকারে দেখুন</summary>
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th scope="col" className="py-1.5 font-semibold">
                সময়
              </th>
              <th scope="col" className="py-1.5 text-right font-semibold">
                জমা
              </th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((b, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-1.5">{b.label}</td>
                <td className="num py-1.5 text-right tabular-nums">{toBanglaNumber(b.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Horizontal bars for a few named categories; every value is labelled at the bar's tip. */
export function BarList({ title, subtitle, items, unit }: { title: string; subtitle: string; items: { label: string; value: number }[]; unit: string }) {
  const id = useId();
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <figure className="card flex min-w-0 flex-col gap-4 p-5 sm:p-6" aria-labelledby={`${id}-title`}>
      <figcaption>
        <h3 id={`${id}-title`} className="text-lg font-bold">
          {title}
        </h3>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </figcaption>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
            <span className="font-en text-[15px] font-semibold">{it.label}</span>
            <span className="flex min-w-0 items-center gap-2 border-l border-border">
              <span
                aria-hidden
                className="block h-5 rounded-r-[4px] bg-brand"
                style={{ width: `${(it.value / max) * 75}%`, minWidth: it.value ? 2 : 0 }}
              />
              <span className="num shrink-0 text-[15px] font-semibold tabular-nums">
                {toBanglaNumber(it.value)}
                {unit}
                {total > 0 && <span className="font-normal text-text-muted"> ({toBanglaNumber(Math.round((it.value / total) * 100))}%)</span>}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
