import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, CheckCircle2, Copy, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CONFIG, PAYMENT_LABELS, type PaymentMethod } from "@/config";
import { cn, formatPhone, priceLabel, toBanglaNumber, waLink } from "@/lib/utils";
import { BD_PHONE, EMAIL, ROCKET_ACCOUNT, TRX_ID, normalizePhone } from "@/lib/validation";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  method: PaymentMethod | "";
  senderNumber: string;
  trxId: string;
};
type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { fullName: "", phone: "", email: "", method: "", senderNumber: "", trxId: "" };
const FIELD_ORDER: (keyof FormValues)[] = ["fullName", "phone", "email", "method", "senderNumber", "trxId"];

function validate(v: FormValues): Errors {
  const e: Errors = {};
  if (v.fullName.trim().length < 2) e.fullName = "আপনার পূর্ণ নাম লিখুন।";

  const phone = normalizePhone(v.phone);
  if (!phone) e.phone = "মোবাইল নম্বর দিন।";
  else if (!BD_PHONE.test(phone)) e.phone = "সঠিক বাংলাদেশি নম্বর দিন (যেমন 01XXXXXXXXX, ১১ ডিজিট)।";

  if (!v.email.trim()) e.email = "ইমেইল দিন।";
  else if (!EMAIL.test(v.email.trim())) e.email = "সঠিক ইমেইল ঠিকানা দিন।";

  if (!v.method) e.method = "পেমেন্ট মাধ্যম বেছে নিন।";

  const sender = normalizePhone(v.senderNumber);
  const senderOk = v.method === "rocket" ? ROCKET_ACCOUNT.test(sender) : BD_PHONE.test(sender);
  if (!sender) e.senderNumber = "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি দিন।";
  else if (!senderOk) e.senderNumber = "সঠিক নম্বর দিন (01XXXXXXXXX)।";

  const trx = v.trxId.trim().toUpperCase();
  if (!trx) e.trxId = "Transaction ID (TrxID) দিন।";
  else if (!TRX_ID.test(trx)) e.trxId = "সঠিক TrxID দিন (শুধু ইংরেজি অক্ষর ও সংখ্যা)।";

  return e;
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const METHOD_COLORS: Record<PaymentMethod, string> = {
  bkash: "#E2136E",
  nagad: "#F6921E",
  rocket: "#8C3494",
};

export function Enroll() {
  return (
    <section id="enroll" aria-labelledby="enroll-title" className="section bg-bg-soft">
      <div className="container">
        <SectionHeading id="enroll-title" eyebrow="এনরোল" title="আজই আপনার যাত্রা শুরু করুন" />

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <PaymentSteps />
          </Reveal>
          <Reveal delay={0.08}>
            <EnrollForm />
          </Reveal>
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="font-semibold text-text">পেমেন্টে সমস্যা? সরাসরি মেসেজ করুন</p>
          <Button asChild variant="whatsapp" size="lg">
            <a href={waLink(CONFIG.whatsappPaymentMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              WhatsApp-এ মেসেজ করুন
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-cta font-bold text-white">
        {toBanglaNumber(n)}
      </span>
      <div className="min-w-0 flex-1 pt-1 text-text">{children}</div>
    </li>
  );
}

function PaymentSteps() {
  const methods = Object.keys(CONFIG.payment) as PaymentMethod[];
  return (
    <div className="card p-5 sm:p-7">
      <h3 className="mb-5 text-xl font-bold text-text">পেমেন্ট নির্দেশনা</h3>
      <ol className="flex flex-col gap-5">
        <Step n={1}>
          <p>
            নিচের যেকোনো নাম্বারে <strong>{priceLabel()} Send Money</strong> করুন:
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {methods.map((m) => (
              <li
                key={m}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-border bg-bg p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="h-9 w-1.5 shrink-0 rounded-full"
                    style={{ background: METHOD_COLORS[m] }}
                  />
                  <div className="min-w-0 leading-tight">
                    <div className="font-en font-bold text-text">{PAYMENT_LABELS[m]}</div>
                    <div className="num break-all text-[17px] font-semibold tracking-wide text-text">
                      {formatPhone(CONFIG.payment[m].number)}
                    </div>
                    <div className="font-en text-xs text-text-muted">{CONFIG.payment[m].type}</div>
                  </div>
                </div>
                <CopyButton value={CONFIG.payment[m].number} label={`${PAYMENT_LABELS[m]} নম্বর`} />
              </li>
            ))}
          </ul>
        </Step>
        <Step n={2}>
          পেমেন্ট শেষে SMS-এ পাওয়া <strong>Transaction ID (TrxID)</strong> কপি করুন
        </Step>
        <Step n={3}>
          <span className="lg:hidden">নিচের</span>
          <span className="hidden lg:inline">ডানের</span> ফর্মে তথ্য ও TrxID জমা দিন
        </Step>
        <Step n={4}>
          অ্যাডমিন যাচাই করলে অটো আপনার <strong>Student Dashboard</strong> চালু হবে
        </Step>
        <Step n={5}>
          সেখান থেকে <strong>WhatsApp গ্রুপে জয়েন</strong> করুন
        </Step>
      </ol>
    </div>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older mobile browsers / non-secure contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  const onCopy = async () => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? `${label} কপি হয়েছে` : `${label} কপি করুন`}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-semibold transition-colors",
        copied
          ? "border-success bg-success-soft text-text"
          : "border-border bg-bg-elevated text-text hover:border-brand hover:text-brand-strong",
      )}
    >
      {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? "কপি হয়েছে" : "Copy"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

function EnrollForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key] || errors[key]) setErrors(validate(next));
  };
  const blur = (key: keyof FormValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const firstBad = FIELD_ORDER.find((k) => errs[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    const payload = {
      full_name: values.fullName.trim(),
      phone: normalizePhone(values.phone),
      email: values.email.trim().toLowerCase(),
      payment_method: values.method,
      sender_number: normalizePhone(values.senderNumber),
      trx_id: values.trxId.trim().toUpperCase(),
      amount: CONFIG.price,
      status: "pending",
      submitted_at: new Date().toISOString(),
    };

    // TODO: Supabase insert into enrollments
    // const { error } = await supabase.from("enrollments").insert(payload);
    // if (error) { show an error state and return; }
    console.log("[NextBuildBD] Enrollment submitted:", payload);

    setStatus("success");
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const showErr = (k: keyof FormValues) => (touched[k] ? errors[k] : undefined);

  return (
    <div className="card p-5 sm:p-7">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            ref={successRef}
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-10 text-center focus:outline-none"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            </span>
            <p className="max-w-sm text-lg font-semibold text-text">
              আপনার তথ্য জমা হয়েছে। যাচাই শেষে ড্যাশবোর্ড চালু হবে।
            </p>
            <Button variant="secondary" onClick={reset}>
              আরেকটি জমা দিন
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="enroll-form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 id="enroll-form-title" className="text-xl font-bold text-text">
              এনরোল ফর্ম
            </h3>

            <Field label="পূর্ণ নাম" error={showErr("fullName")}>
              {(p) => (
                <input
                  {...p}
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  onBlur={() => blur("fullName")}
                />
              )}
            </Field>

            <Field label="মোবাইল নম্বর" hint="যেমন: 01712345678" error={showErr("phone")}>
              {(p) => (
                <input
                  {...p}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                />
              )}
            </Field>

            <Field label="ইমেইল" error={showErr("email")}>
              {(p) => (
                <input
                  {...p}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                />
              )}
            </Field>

            <MethodPicker
              value={values.method}
              error={showErr("method")}
              onChange={(m) => {
                setTouched((t) => ({ ...t, method: true }));
                set("method", m);
              }}
            />

            <Field label="যে নম্বর থেকে পাঠিয়েছেন" error={showErr("senderNumber")}>
              {(p) => (
                <input
                  {...p}
                  name="senderNumber"
                  type="tel"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={values.senderNumber}
                  onChange={(e) => set("senderNumber", e.target.value)}
                  onBlur={() => blur("senderNumber")}
                />
              )}
            </Field>

            <Field label="Transaction ID (TrxID)" hint="SMS-এ পাওয়া আইডি, যেমন: 9ABC1DEF2G" error={showErr("trxId")}>
              {(p) => (
                <input
                  {...p}
                  name="trxId"
                  type="text"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  className={cn(p.className, "font-en uppercase tracking-wider")}
                  value={values.trxId}
                  onChange={(e) => set("trxId", e.target.value)}
                  onBlur={() => blur("trxId")}
                />
              )}
            </Field>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={status === "submitting"}>
              {status === "submitting" ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
              পেমেন্ট জমা দিন
            </Button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-bg px-4 text-base text-text placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand-soft aria-[invalid=true]:border-danger";

type FieldInputProps = {
  id: string;
  required: true;
  className: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (props: FieldInputProps) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold text-text">
        {label}{" "}
        <span className="text-danger" aria-hidden>
          *
        </span>
      </label>
      {children({
        id,
        required: true,
        className: inputClass,
        "aria-invalid": Boolean(error),
        "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function MethodPicker({
  value,
  error,
  onChange,
}: {
  value: PaymentMethod | "";
  error?: string;
  onChange: (m: PaymentMethod) => void;
}) {
  const id = useId();
  const methods = Object.keys(CONFIG.payment) as PaymentMethod[];
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined} aria-invalid={Boolean(error)}>
      <legend className="mb-1.5 text-[15px] font-semibold text-text">
        পেমেন্ট মাধ্যম{" "}
        <span className="text-danger" aria-hidden>
          *
        </span>
      </legend>
      <div className="grid grid-cols-3 gap-2">
        {methods.map((m) => {
          const checked = value === m;
          return (
            <label
              key={m}
              className={cn(
                "relative flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-bg font-en text-[15px] font-semibold text-text transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand-strong",
                checked ? "border-brand bg-brand-soft" : "border-input hover:border-brand",
                error && !value && "border-danger",
              )}
            >
              <input
                type="radio"
                name="method"
                value={m}
                checked={checked}
                onChange={() => onChange(m)}
                className="sr-only"
              />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: METHOD_COLORS[m] }} />
              {PAYMENT_LABELS[m]}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
