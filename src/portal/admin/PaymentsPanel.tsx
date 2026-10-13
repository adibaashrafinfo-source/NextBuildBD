import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, RefreshCw, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { CONFIG, PAYMENT_LABELS } from "@/config";
import { supabase, type Enrollment, type EnrollmentStatus } from "@/lib/supabase";
import { cn, formatDateTime, formatPhone, toBanglaNumber } from "@/lib/utils";
import { ErrorNote } from "./ErrorNote";

const FILTERS: { id: EnrollmentStatus | "all"; label: string }[] = [
  { id: "pending", label: "অপেক্ষমাণ" },
  { id: "verified", label: "যাচাই হয়েছে" },
  { id: "rejected", label: "বাতিল" },
  { id: "all", label: "সব" },
];

const STATUS_STYLE: Record<EnrollmentStatus, string> = {
  pending: "bg-brand-soft text-brand-strong",
  verified: "bg-success-soft text-text",
  rejected: "bg-bg-soft text-danger",
};
const STATUS_LABEL: Record<EnrollmentStatus, string> = { pending: "অপেক্ষমাণ", verified: "যাচাই হয়েছে", rejected: "বাতিল" };

/** Loads the newest enrollments (enough for a course of this size); filtering/search run client-side. */
const LIMIT = 1000;

export function PaymentsPanel() {
  const [rows, setRows] = useState<Enrollment[] | null>(null);
  const [filter, setFilter] = useState<EnrollmentStatus | "all">("pending");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase!
      .from("enrollments")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(LIMIT);
    setLoading(false);
    if (error) setError("তালিকা লোড করা যায়নি।");
    else {
      setError(null);
      setRows(data as Enrollment[]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { pending: 0, verified: 0, rejected: 0, all: rows?.length ?? 0 };
    rows?.forEach((r) => c[r.status]++);
    return c;
  }, [rows]);

  // Only a shared email flags a repeat applicant; a missing one says nothing.
  const emailCounts = useMemo(() => {
    const m = new Map<string, number>();
    rows?.forEach((r) => {
      const key = r.email?.toLowerCase();
      if (key) m.set(key, (m.get(key) ?? 0) + 1);
    });
    return m;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q || [r.trx_id, r.phone, r.sender_number, r.email, r.full_name].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [rows, filter, query]);

  const update = async (id: string, status: EnrollmentStatus, note: string | null) => {
    const { data, error } = await supabase!
      .from("enrollments")
      .update({ status, admin_note: note })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      setError("আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      return false;
    }
    setError(null);
    setRows((rs) => rs?.map((r) => (r.id === id ? (data as Enrollment) : r)) ?? null);
    return true;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="স্ট্যাটাস ফিল্টার">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[15px] font-semibold transition-colors",
                filter === f.id ? "border-brand bg-brand-soft text-brand-strong" : "border-border bg-bg-elevated text-text-muted hover:text-text",
              )}
            >
              {f.label}
              <span className="num rounded-full bg-bg px-2 text-xs">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" aria-hidden />
            <Input
              type="search"
              aria-label="TrxID, ফোন, ইমেইল বা নাম দিয়ে খুঁজুন"
              placeholder="TrxID / ফোন / ইমেইল"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <Button variant="secondary" size="icon" onClick={load} disabled={loading} aria-label="রিফ্রেশ করুন">
            <RefreshCw className={cn(loading && "animate-spin")} aria-hidden />
          </Button>
        </div>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      {!rows ? (
        <div className="flex justify-center py-16" role="status" aria-label="লোড হচ্ছে">
          <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
        </div>
      ) : visible.length === 0 ? (
        <p className="card p-6 text-center text-text-muted">এই তালিকায় কিছু নেই।</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((r) => (
            <EnrollmentRow key={r.id} row={r} sameEmail={(emailCounts.get(r.email?.toLowerCase() ?? "") ?? 1) > 1} onUpdate={update} />
          ))}
        </ul>
      )}
      {rows && rows.length >= LIMIT && (
        <p className="text-center text-sm text-text-muted">সর্বশেষ {toBanglaNumber(LIMIT)}টি এনরোলমেন্ট দেখানো হচ্ছে।</p>
      )}
    </div>
  );
}

function EnrollmentRow({
  row: r,
  sameEmail,
  onUpdate,
}: {
  row: Enrollment;
  sameEmail: boolean;
  onUpdate: (id: string, status: EnrollmentStatus, note: string | null) => Promise<boolean>;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState(r.admin_note ?? "");
  const [busy, setBusy] = useState<EnrollmentStatus | null>(null);
  const [noteError, setNoteError] = useState(false);

  const act = async (status: EnrollmentStatus) => {
    if (status === "rejected" && !note.trim()) {
      setNoteError(true);
      return;
    }
    setBusy(status);
    const ok = await onUpdate(r.id, status, status === "pending" ? null : note.trim() || null);
    setBusy(null);
    if (ok) setRejecting(false);
  };

  const amountMismatch = r.amount !== CONFIG.price;

  return (
    <li className="card flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-bold">{r.full_name}</p>
          <p className="num text-[15px] text-text-muted">
            {r.email && (
              <>
                <span className="break-all">{r.email}</span> ·{" "}
              </>
            )}
            <span className="whitespace-nowrap">{formatPhone(r.phone)}</span>
          </p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", STATUS_STYLE[r.status])}>{STATUS_LABEL[r.status]}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-border bg-bg p-4 text-[15px] sm:grid-cols-4">
        <div>
          <dt className="text-sm text-text-muted">মাধ্যম</dt>
          <dd className="font-en font-semibold">{PAYMENT_LABELS[r.payment_method]}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-text-muted">TrxID</dt>
          <dd className="num break-all font-bold tracking-wide">{r.trx_id}</dd>
        </div>
        <div>
          <dt className="text-sm text-text-muted">যে নম্বর থেকে</dt>
          <dd className="num font-semibold">{formatPhone(r.sender_number)}</dd>
        </div>
        <div>
          <dt className="text-sm text-text-muted">পরিমাণ</dt>
          <dd className={cn("num font-semibold", amountMismatch && "text-danger")}>৳{r.amount}</dd>
        </div>
      </dl>

      <p className="text-sm text-text-muted">
        জমা: {formatDateTime(r.submitted_at)}
        {r.reviewed_at && <> · রিভিউ: {formatDateTime(r.reviewed_at)}</>}
      </p>
      {(sameEmail || amountMismatch) && (
        <p className="inline-flex items-start gap-2 text-sm font-medium text-text">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          {sameEmail && "এই ইমেইলে একাধিক এনরোলমেন্ট আছে। "}
          {amountMismatch && `পরিমাণ কোর্স ফি (৳${CONFIG.price}) থেকে আলাদা।`}
        </p>
      )}
      {r.admin_note && !rejecting && <p className="rounded-xl bg-bg-soft p-3 text-[15px]">নোট: {r.admin_note}</p>}

      {rejecting && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`note-${r.id}`} className="text-[15px] font-semibold">
            বাতিলের কারণ (স্টুডেন্ট দেখতে পাবে)
          </label>
          <Textarea
            id={`note-${r.id}`}
            value={note}
            maxLength={500}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteError(false);
            }}
            aria-invalid={noteError}
            aria-describedby={noteError ? `note-err-${r.id}` : undefined}
            placeholder="যেমন: এই TrxID-এ কোনো পেমেন্ট পাওয়া যায়নি"
          />
          {noteError && (
            <p id={`note-err-${r.id}`} className="text-sm font-medium text-danger">
              কারণ লিখুন।
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {r.status !== "verified" && !rejecting && (
          <Button variant="whatsapp" size="sm" onClick={() => act("verified")} disabled={busy !== null}>
            {busy === "verified" ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
            যাচাই করুন ও অ্যাক্সেস দিন
          </Button>
        )}
        {r.status !== "rejected" &&
          (rejecting ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => act("rejected")} disabled={busy !== null} className="text-danger">
                {busy === "rejected" ? <Loader2 className="animate-spin" aria-hidden /> : <X aria-hidden />}
                বাতিল নিশ্চিত করুন
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
                থাক
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setRejecting(true)} disabled={busy !== null}>
              <X aria-hidden /> বাতিল করুন
            </Button>
          ))}
        {r.status !== "pending" && !rejecting && (
          <Button variant="ghost" size="sm" onClick={() => act("pending")} disabled={busy !== null}>
            {busy === "pending" ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCcw aria-hidden />}
            অপেক্ষমাণে ফেরত
          </Button>
        )}
      </div>
    </li>
  );
}
