import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { CalendarClock, CheckCircle2, Clock, Film, Loader2, PlayCircle, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { CONFIG, PAYMENT_LABELS } from "@/config";
import { supabase, type CourseClass, type CourseSettings, type Enrollment } from "@/lib/supabase";
import { cn, formatDateTime, toBanglaNumber, waLink } from "@/lib/utils";

type Data = { enrollments: Enrollment[]; classes: CourseClass[]; settings: CourseSettings | null };

/** A class counts as "upcoming" until its scheduled end. */
const endsAt = (c: CourseClass) => (c.starts_at ? new Date(c.starts_at).getTime() + c.duration_minutes * 60_000 : null);

export function DashboardPage({ session }: { session: Session }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const db = supabase!;
    const enr = await db
      .from("enrollments")
      .select("id, full_name, phone, email, payment_method, sender_number, trx_id, amount, status, admin_note, submitted_at, reviewed_at")
      .order("submitted_at", { ascending: false });
    if (enr.error) {
      setError(true);
      setRefreshing(false);
      return;
    }
    const enrollments = (enr.data ?? []) as Enrollment[];
    let classes: CourseClass[] = [];
    let settings: CourseSettings | null = null;
    if (enrollments.some((e) => e.status === "verified")) {
      const [cls, st] = await Promise.all([
        db.from("classes").select("*").order("position").order("starts_at", { nullsFirst: false }),
        db.from("course_settings").select("whatsapp_group_link, meet_link").maybeSingle(),
      ]);
      classes = (cls.data ?? []) as CourseClass[];
      settings = (st.data ?? null) as CourseSettings | null;
    }
    setError(false);
    setData({ enrollments, classes, settings });
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    // Access switches on as soon as an admin verifies: re-check whenever the student comes back to the tab.
    const onFocus = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [load]);

  if (error) {
    return (
      <StateCard tone="danger" icon={<XCircle className="h-8 w-8" aria-hidden />} title="তথ্য লোড করা যায়নি">
        <p>ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>
        <Button onClick={load} className="mt-5">
          <RefreshCw aria-hidden /> আবার চেষ্টা করুন
        </Button>
      </StateCard>
    );
  }
  if (!data) {
    return (
      <div className="flex justify-center py-24" role="status" aria-label="লোড হচ্ছে">
        <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
      </div>
    );
  }

  const email = session.user.email ?? "";
  const verified = data.enrollments.find((e) => e.status === "verified");
  const latest = data.enrollments[0];
  const refreshBtn = (
    <Button variant="secondary" onClick={load} disabled={refreshing} className="mt-5">
      <RefreshCw className={cn(refreshing && "animate-spin")} aria-hidden /> স্ট্যাটাস রিফ্রেশ করুন
    </Button>
  );

  if (!verified) {
    if (!latest) {
      return (
        <StateCard icon={<Clock className="h-8 w-8" aria-hidden />} title="কোনো এনরোলমেন্ট পাওয়া যায়নি">
          <p>
            <span className="num break-all font-semibold text-text">{email}</span> ইমেইলে কোনো পেমেন্ট জমা নেই। এনরোল
            ফর্মে যে ইমেইল দিয়েছিলেন, সেটি দিয়ে লগইন করুন — অথবা এখনই এনরোল করুন।
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <a href="/#enroll">এনরোল করুন</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={waLink(CONFIG.whatsappPaymentMessage)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="text-whatsapp" /> সাহায্য নিন
              </a>
            </Button>
          </div>
        </StateCard>
      );
    }
    if (latest.status === "rejected") {
      return (
        <StateCard tone="danger" icon={<XCircle className="h-8 w-8" aria-hidden />} title="পেমেন্ট যাচাই হয়নি">
          <EnrollmentSummary e={latest} />
          {latest.admin_note && (
            <p className="mt-4 rounded-xl bg-bg-soft p-4 text-left text-text">
              <span className="font-semibold">কারণ:</span> {latest.admin_note}
            </p>
          )}
          <p className="mt-4">ভুল মনে হলে WhatsApp-এ TrxID সহ মেসেজ দিন, অথবা সঠিক TrxID দিয়ে আবার জমা দিন।</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="whatsapp">
              <a href={waLink(CONFIG.whatsappPaymentMessage)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp-এ মেসেজ করুন
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/#enroll">আবার জমা দিন</a>
            </Button>
          </div>
        </StateCard>
      );
    }
    return (
      <StateCard icon={<Clock className="h-8 w-8" aria-hidden />} title="পেমেন্ট যাচাই চলছে">
        <EnrollmentSummary e={latest} />
        <p className="mt-4">
          অ্যাডমিন যাচাই করলেই এই পেজে আপনার ড্যাশবোর্ড চালু হয়ে যাবে। সাধারণত অল্প সময় লাগে; দেরি হলে WhatsApp-এ
          মেসেজ দিন।
        </p>
        {refreshBtn}
      </StateCard>
    );
  }

  return <StudentHome name={verified.full_name} classes={data.classes} settings={data.settings} />;
}

function StudentHome({ name, classes, settings }: { name: string; classes: CourseClass[]; settings: CourseSettings | null }) {
  const now = Date.now();
  const upcoming = classes
    .filter((c) => (endsAt(c) ?? Infinity) >= now)
    .sort((a, b) => (a.starts_at ?? "9").localeCompare(b.starts_at ?? "9"));
  const past = classes.filter((c) => (endsAt(c) ?? Infinity) < now).sort((a, b) => b.starts_at!.localeCompare(a.starts_at!));
  const next = upcoming[0];
  const meetUrl = next?.meet_url ?? settings?.meet_link ?? null;
  const groupLink = settings?.whatsapp_group_link ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="inline-flex items-center gap-2 font-semibold text-success">
          <CheckCircle2 className="h-5 w-5" aria-hidden /> পেমেন্ট যাচাই হয়েছে
        </p>
        <h1 className="text-[26px] font-bold sm:text-3xl">স্বাগতম, {name}!</h1>
        <p className="text-text-muted">আপনার সব ক্লাস, Meet লিংক ও রেকর্ডিং এখানে।</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Next live class */}
        <section aria-labelledby="next-class-title" className="card flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/5">
              <BrandLogo name="googleMeet" className="h-5 w-6" />
            </span>
            <h2 id="next-class-title" className="text-lg font-bold">
              পরের Live Class
            </h2>
          </div>
          {next ? (
            <div>
              <p className="font-semibold">{next.title}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-text-muted">
                <CalendarClock className="h-4 w-4" aria-hidden />
                {next.starts_at ? formatDateTime(next.starts_at) : "সময় শীঘ্রই জানানো হবে"}
              </p>
            </div>
          ) : (
            <p className="text-text-muted">নতুন ক্লাসের সময় শীঘ্রই জানানো হবে।</p>
          )}
          {meetUrl ? (
            <Button asChild className="mt-auto self-start">
              <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                <PlayCircle aria-hidden /> Google Meet-এ জয়েন করুন
              </a>
            </Button>
          ) : (
            <p className="mt-auto text-sm text-text-muted">Meet লিংক ক্লাসের আগে এখানে দেখাবে।</p>
          )}
        </section>

        {/* Community */}
        <section aria-labelledby="community-title" className="card flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-whatsapp text-white">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <h2 id="community-title" className="text-lg font-bold">
              WhatsApp কমিউনিটি
            </h2>
          </div>
          <p className="text-text-muted">গ্রুপে জয়েন করুন — ক্লাসের আপডেট পাবেন, আটকে গেলে প্রশ্ন করতে পারবেন।</p>
          {groupLink ? (
            <Button asChild variant="whatsapp" className="mt-auto self-start">
              <a href={groupLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> গ্রুপে জয়েন করুন
              </a>
            </Button>
          ) : (
            <p className="mt-auto text-sm text-text-muted">গ্রুপ লিংক শীঘ্রই যুক্ত হবে।</p>
          )}
        </section>
      </div>

      <ClassList title="আসন্ন ক্লাস" id="upcoming-title" classes={upcoming} empty="এখনো কোনো আসন্ন ক্লাস যোগ করা হয়নি।" />
      <ClassList title="ক্লাস রেকর্ডিং" id="past-title" classes={past} past empty="ক্লাস শেষ হলে রেকর্ডিং এখানে পাবেন।" />
    </div>
  );
}

function ClassList({
  title,
  id,
  classes,
  past = false,
  empty,
}: {
  title: string;
  id: string;
  classes: CourseClass[];
  past?: boolean;
  empty: string;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-xl font-bold">
        {title} {classes.length > 0 && <span className="text-text-muted">({toBanglaNumber(classes.length)})</span>}
      </h2>
      {classes.length === 0 ? (
        <p className="card p-5 text-text-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {classes.map((c) => (
            <li key={c.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold">{c.title}</h3>
                {c.description && <p className="mt-1 text-[15px] text-text-muted">{c.description}</p>}
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
                  {c.starts_at ? formatDateTime(c.starts_at) : "সময় শীঘ্রই জানানো হবে"}
                </p>
              </div>
              {past ? (
                c.recording_url ? (
                  <Button asChild variant="secondary" className="shrink-0 self-start sm:self-center">
                    <a href={c.recording_url} target="_blank" rel="noopener noreferrer">
                      <Film aria-hidden /> রেকর্ডিং দেখুন
                    </a>
                  </Button>
                ) : (
                  <span className="shrink-0 text-sm text-text-muted">রেকর্ডিং শীঘ্রই আসবে</span>
                )
              ) : (
                c.meet_url && (
                  <Button asChild variant="secondary" className="shrink-0 self-start sm:self-center">
                    <a href={c.meet_url} target="_blank" rel="noopener noreferrer">
                      <PlayCircle aria-hidden /> Meet লিংক
                    </a>
                  </Button>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EnrollmentSummary({ e }: { e: Enrollment }) {
  return (
    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl border border-border bg-bg p-4 text-left text-[15px]">
      <dt className="text-text-muted">মাধ্যম</dt>
      <dd className="font-en font-semibold text-text">{PAYMENT_LABELS[e.payment_method]}</dd>
      <dt className="text-text-muted">TrxID</dt>
      <dd className="num break-all font-semibold text-text">{e.trx_id}</dd>
      <dt className="text-text-muted">জমার সময়</dt>
      <dd className="text-text">{formatDateTime(e.submitted_at)}</dd>
    </dl>
  );
}

function StateCard({
  icon,
  title,
  tone = "brand",
  children,
}: {
  icon: ReactNode;
  title: string;
  tone?: "brand" | "danger";
  children: ReactNode;
}) {
  return (
    <div className="card mx-auto max-w-xl p-6 text-center text-text-muted sm:p-8">
      <span
        className={cn(
          "mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full",
          tone === "danger" ? "bg-bg-soft text-danger" : "bg-brand-soft text-brand-strong",
        )}
      >
        {icon}
      </span>
      <h1 className="mb-3 text-2xl font-bold text-text">{title}</h1>
      {children}
    </div>
  );
}
