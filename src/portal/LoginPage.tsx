import { useId, useState, type FormEvent } from "react";
import { Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { EMAIL } from "@/lib/validation";

/**
 * Email + password sign-in for students and admins alike — no magic link, no emailed code.
 * Who sees what is decided by the database: `is_admin()` opens /admin, and a student's dashboard
 * only unlocks once an admin marks their enrollment verified (see supabase/migrations).
 *
 * Needs Auth → Providers → Email → "Confirm email" turned OFF, otherwise a new account has no
 * session until its address is confirmed.
 */

const MIN_PASSWORD = 6;

function messageFor(error: { message: string; status?: number }, mode: Mode) {
  const m = error.message.toLowerCase();
  if (m.includes("invalid login credentials")) return "ইমেইল বা পাসওয়ার্ড ভুল।";
  if (m.includes("already registered") || m.includes("already exists"))
    return "এই ইমেইলে অ্যাকাউন্ট আগে থেকেই আছে। লগইন করুন।";
  if (m.includes("password")) return `পাসওয়ার্ড কমপক্ষে ${MIN_PASSWORD} অক্ষরের দিন।`;
  if (m.includes("email not confirmed")) return "অ্যাকাউন্টটি এখনো চালু হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।";
  if (error.status === 429) return "অনেকবার চেষ্টা হয়েছে। এক মিনিট পরে আবার চেষ্টা করুন।";
  return mode === "login" ? "লগইন করা যায়নি। আবার চেষ্টা করুন।" : "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
}

type Mode = "login" | "signup";

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState(() => new URLSearchParams(window.location.search).get("email") ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const emailId = useId();
  const passwordId = useId();
  const errId = useId();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`পাসওয়ার্ড কমপক্ষে ${MIN_PASSWORD} অক্ষরের দিন।`);
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);

    const auth = supabase!.auth;
    const { data, error: failed } =
      mode === "login"
        ? await auth.signInWithPassword({ email: value, password })
        : await auth.signUp({ email: value, password });

    setBusy(false);
    if (failed) {
      setError(messageFor(failed, mode));
      return;
    }
    // Sign-up only returns a session while "Confirm email" is off; say so rather than hanging.
    if (!data.session) {
      setNotice("অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু এখনো চালু হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।");
      return;
    }
    // On success onAuthStateChange fires and PortalApp redirects to `next`.
  };

  const switchTo = (to: Mode) => {
    setMode(to);
    setError(null);
    setNotice(null);
  };

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-white">
            {mode === "login" ? <Lock className="h-7 w-7" aria-hidden /> : <UserPlus className="h-7 w-7" aria-hidden />}
          </span>
          <h1 className="text-2xl font-bold">{mode === "login" ? "লগইন" : "অ্যাকাউন্ট তৈরি করুন"}</h1>
          <p className="text-text-muted">
            {mode === "login"
              ? "ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।"
              : "এনরোল ফর্মে যে ইমেইল দিয়েছিলেন সেটি দিন, আর একটি পাসওয়ার্ড ঠিক করুন।"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="text-[15px] font-semibold">
            ইমেইল
          </label>
          <Input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errId : undefined}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={passwordId} className="text-[15px] font-semibold">
            পাসওয়ার্ড
          </label>
          <Input
            id={passwordId}
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errId : undefined}
            required
          />
          {error && (
            <p id={errId} className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-sm font-medium text-text-muted" role="status">
              {notice}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {busy && <Loader2 className="animate-spin" aria-hidden />}
          {mode === "login" ? (
            <>
              <LogIn aria-hidden /> লগইন
            </>
          ) : (
            <>
              <UserPlus aria-hidden /> অ্যাকাউন্ট তৈরি করুন
            </>
          )}
        </Button>

        {mode === "login" ? (
          <p className="text-center text-sm text-text-muted">
            প্রথমবার আসছেন?{" "}
            <button
              type="button"
              onClick={() => switchTo("signup")}
              className="font-semibold text-brand-strong underline underline-offset-4"
            >
              অ্যাকাউন্ট তৈরি করুন
            </button>
          </p>
        ) : (
          <p className="text-center text-sm text-text-muted">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <button
              type="button"
              onClick={() => switchTo("login")}
              className="font-semibold text-brand-strong underline underline-offset-4"
            >
              লগইন করুন
            </button>
          </p>
        )}

        <p className="text-center text-sm text-text-muted">
          এখনো এনরোল করেননি?{" "}
          <a href="/#enroll" className="font-semibold text-brand-strong underline underline-offset-4">
            এনরোল করুন
          </a>
        </p>
      </form>
    </div>
  );
}
