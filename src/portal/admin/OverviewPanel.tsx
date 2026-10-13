import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarClock, Download, Loader2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_LABELS, type PaymentMethod } from "@/config";
import { supabase, type CourseClass, type Enrollment } from "@/lib/supabase";
import { cn, formatDateTime, toBanglaNumber } from "@/lib/utils";
import { BarList, ColumnChart, type Bucket } from "./charts";
import { ErrorNote } from "./ErrorNote";

const RANGES = [
  { days: 7, label: "৭ দিন" },
  { days: 30, label: "৩০ দিন" },
  { days: 90, label: "৯০ দিন" },
] as const;
type RangeDays = (typeof RANGES)[number]["days"];

const DAY = 86_400_000;
/** Calendar day in Bangladesh time as YYYY-MM-DD (en-CA formats ISO-style). */
const dhakaDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" });
const dayKey = (t: number | string | Date) => dhakaDay.format(new Date(t));
const shortDate = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short", timeZone: "UTC" });
/** Whole days between a submission's Dhaka calendar day and today's. */
const daysAgo = (iso: string, todayKey: string) => Math.round((Date.parse(todayKey) - Date.parse(dayKey(iso))) / DAY);

type Row = Pick<Enrollment, "id" | "full_name" | "email" | "phone" | "payment_method" | "trx_id" | "amount" | "status" | "submitted_at">;

export function OverviewPanel({ onReviewPayments }: { onReviewPayments: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [range, setRange] = useState<RangeDays>(30);
  const [error, setError] = useState(false);

  useEffect(() => {
    const db = supabase!;
    Promise.all([
      db
        .from("enrollments")
        .select("id, full_name, email, phone, payment_method, trx_id, amount, status, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(5000),
      db
        .from("classes")
        .select("*")
        .gte("starts_at", new Date(Date.now() - 3 * 3600_000).toISOString())
        .order("starts_at")
        .limit(5),
    ]).then(([enr, cls]) => {
      if (enr.error) return setError(true);
      setRows(enr.data as Row[]);
      const now = Date.now();
      setClasses(
        ((cls.data ?? []) as CourseClass[]).filter(
          (c) => c.starts_at && Date.parse(c.starts_at) + c.duration_minutes * 60_000 > now,
        ),
      );
    });
  }, []);

  const stats = useMemo(() => {
    if (!rows) return null;
    const today = dayKey(Date.now());
    const withAge = rows.map((r) => ({ ...r, age: daysAgo(r.submitted_at, today) }));
    const inRange = withAge.filter((r) => r.age < range);
    const prev = withAge.filter((r) => r.age >= range && r.age < range * 2);
    const verified = inRange.filter((r) => r.status === "verified");

    // Daily columns for 7/30 days; weekly for 90 so each column stays readable on a phone.
    const step = range === 90 ? 7 : 1;
    const count = Math.ceil(range / step);
    const buckets: Bucket[] = Array.from({ length: count }, (_, i) => {
      const startAgo = (count - 1 - i) * step + (step - 1); // oldest day in the bucket
      const start = shortDate.format(new Date(Date.parse(today) - startAgo * DAY));
      const end = shortDate.format(new Date(Date.parse(today) - (startAgo - step + 1) * DAY));
      return { label: step === 1 ? start : `${start} – ${end}`, short: start, value: 0 };
    });
    for (const r of inRange) buckets[count - 1 - Math.floor(r.age / step)].value++;

    const methods = (Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => ({
      label: PAYMENT_LABELS[m],
      value: inRange.filter((r) => r.payment_method === m).length,
    }));

    return {
      submitted: inRange.length,
      prevSubmitted: prev.length,
      verified: verified.length,
      rejected: inRange.filter((r) => r.status === "rejected").length,
      revenue: verified.reduce((s, r) => s + r.amount, 0),
      pending: rows.filter((r) => r.status === "pending").sort((a, b) => a.submitted_at.localeCompare(b.submitted_at)),
      buckets,
      weekly: step === 7,
      methods,
    };
  }, [rows, range]);

  const exportCsv = () => {
    if (!rows) return;
    // Leading = + - @ would be run as a formula by spreadsheet apps; prefix them so names stay text.
    const cell = (v: string | number) => {
      const s = String(v);
      const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const header = ["নাম", "ইমেইল", "ফোন", "মাধ্যম", "TrxID", "পরিমাণ", "জমার সময়"];
    const lines = rows
      .filter((r) => r.status === "verified")
      .map((r) =>
        [r.full_name, r.email ?? "", r.phone, PAYMENT_LABELS[r.payment_method], r.trx_id, r.amount, r.submitted_at]
          .map(cell)
          .join(","),
      );
    // BOM so Excel opens the Bangla text as UTF-8.
    const blob = new Blob(["﻿" + [header.map(cell).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nextbuildbd-students-${dayKey(Date.now())}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (error) return <ErrorNote>ওভারভিউ লোড করা যায়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।</ErrorNote>;
  if (!stats) {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="লোড হচ্ছে">
        <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
      </div>
    );
  }

  const rangeLabel = RANGES.find((r) => r.days === range)!.label;
  const nextClass = classes.find((c) => c.starts_at && Date.parse(c.starts_at) + c.duration_minutes * 60_000 > Date.now());

  return (
    <div className="flex flex-col gap-6">
      {/* Needs action now: not scoped by the date range */}
      <section aria-labelledby="todo-title" className={cn("card p-5 sm:p-6", stats.pending.length > 0 && "border-brand")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="todo-title" className="text-lg font-bold">
              যাচাই বাকি
            </h2>
            <p className="text-text-muted">
              {stats.pending.length > 0
                ? `${toBanglaNumber(stats.pending.length)}টি পেমেন্ট আপনার যাচাইয়ের অপেক্ষায়`
                : "সব পেমেন্ট যাচাই করা হয়েছে।"}
            </p>
          </div>
          {stats.pending.length > 0 && (
            <Button size="sm" onClick={onReviewPayments}>
              যাচাই শুরু করুন <ArrowRight aria-hidden />
            </Button>
          )}
        </div>
        {stats.pending.length > 0 && (
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
            {stats.pending.slice(0, 5).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-[15px]">
                <span className="min-w-0">
                  <span className="font-semibold">{r.full_name}</span>{" "}
                  <span className="font-en text-text-muted">· {PAYMENT_LABELS[r.payment_method]}</span>
                </span>
                <span className="num font-semibold tracking-wide">{r.trx_id}</span>
                <span className="w-full text-sm text-text-muted sm:w-auto">{formatDateTime(r.submitted_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Date range: scopes every number and chart below */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-border bg-bg-elevated p-1" role="group" aria-label="সময়সীমা">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              aria-pressed={range === r.days}
              onClick={() => setRange(r.days)}
              className={cn(
                "h-10 rounded-lg px-3.5 text-[15px] font-semibold transition-colors",
                range === r.days ? "bg-brand-soft text-brand-strong" : "text-text-muted hover:text-text",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={exportCsv} disabled={!rows?.some((r) => r.status === "verified")}>
          <Download aria-hidden /> স্টুডেন্ট তালিকা (CSV)
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={`গত ${rangeLabel}ের হিসাব`}>
        <StatTile label="নতুন জমা" value={toBanglaNumber(stats.submitted)} delta={stats.submitted - stats.prevSubmitted} period={rangeLabel} />
        <StatTile label="যাচাই হয়েছে" value={toBanglaNumber(stats.verified)} />
        <StatTile label="যাচাইকৃত আয়" value={`৳${toBanglaNumber(stats.revenue)}`} />
        <StatTile label="বাতিল" value={toBanglaNumber(stats.rejected)} />
      </ul>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ColumnChart
          title={stats.weekly ? "সাপ্তাহিক নতুন জমা" : "দৈনিক নতুন জমা"}
          subtitle={`গত ${rangeLabel}`}
          buckets={stats.buckets}
          unit="টি জমা"
        />
        <BarList title="পেমেন্ট মাধ্যম" subtitle={`গত ${rangeLabel}ের জমা`} items={stats.methods} unit="টি" />
      </div>

      <section aria-labelledby="next-classes-title" className="card p-5 sm:p-6">
        <h2 id="next-classes-title" className="mb-3 text-lg font-bold">
          আসন্ন ক্লাস
        </h2>
        {classes.length === 0 ? (
          <p className="text-text-muted">কোনো আসন্ন ক্লাস নেই। "ক্লাস" ট্যাব থেকে যোগ করুন।</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {classes.slice(0, 3).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-bg px-4 py-3">
                <span className="font-semibold">
                  {c.title}
                  {c === nextClass && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-strong">পরের ক্লাস</span>}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <CalendarClock className="h-4 w-4" aria-hidden />
                  {c.starts_at && formatDateTime(c.starts_at)}
                  {!c.meet_url && " · Meet লিংক নেই"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}

function StatTile({ label, value, delta, period }: { label: string; value: string; delta?: number; period?: string }) {
  const Icon = delta === undefined ? null : delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  return (
    <li className="card flex flex-col gap-1 p-4 sm:p-5">
      <span className="text-[15px] text-text-muted">{label}</span>
      <span className="text-[28px] font-bold leading-tight sm:text-3xl">{value}</span>
      {Icon && (
        <span className="inline-flex items-center gap-1 text-sm text-text-muted">
          <Icon className="h-4 w-4 shrink-0 text-text" aria-hidden />
          <span>
            {delta! > 0 ? "+" : delta! < 0 ? "−" : ""}
            {toBanglaNumber(Math.abs(delta!))} আগের {period}ের তুলনায়
          </span>
        </span>
      )}
    </li>
  );
}
