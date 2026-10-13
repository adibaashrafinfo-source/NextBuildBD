import { useId, useState, type FormEvent } from "react";
import { Loader2, LogIn, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { BD_PHONE, normalizePhone } from "@/lib/validation";
import { CONFIG } from "@/config";
import { waLink } from "@/lib/utils";

/**
 * Sign in with a mobile number or an email, plus the password chosen while enrolling.
 *
 * Supabase Auth signs in by email, and a student may have given none, so public.login_email()
 * turns whichever identifier was typed into the address to sign in with. It answers only when the
 * password is right, so it reveals nothing about who has enrolled.
 *
 * Admins are created by hand (see README) and sign in here with their email.
 */
export function LoginPage() {
  const [identifier, setIdentifier] = useState(
    () => new URLSearchParams(window.location.search).get("id") ?? "",
  );
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idFieldId = useId();
  const passwordId = useId();
  const errId = useId();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const typed = identifier.trim();
    if (!typed || !password) {
      setError("মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }
    // A mobile number may arrive with +88, spaces or Bangla digits; the database stores 01XXXXXXXXX.
    const asPhone = normalizePhone(typed);
    const lookup = BD_PHONE.test(asPhone) ? asPhone : typed.toLowerCase();

    setBusy(true);
    setError(null);
    const { data: loginEmail, error: failed } = await supabase!.rpc("login_email", {
      identifier: lookup,
      password,
    });

    if (failed || !loginEmail) {
      setBusy(false);
      setError(
        failed
          ? "লগইন করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
          : "মোবাইল নম্বর/ইমেইল বা পাসওয়ার্ড ভুল।",
      );
      return;
    }

    const { error: signInFailed } = await supabase!.auth.signInWithPassword({
      email: loginEmail as string,
      password,
    });
    setBusy(false);
    if (signInFailed) {
      setError("লগইন করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।");
    }
    // On success onAuthStateChange fires and PortalApp redirects.
  };

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-white">
            <UserRound className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold">লগইন</h1>
          <p className="text-text-muted">এনরোল করার সময় যে মোবাইল নম্বর ও পাসওয়ার্ড দিয়েছিলেন, সেটি দিন।</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={idFieldId} className="text-[15px] font-semibold">
            মোবাইল নম্বর অথবা ইমেইল
          </label>
          <Input
            id={idFieldId}
            type="text"
            autoComplete="username"
            placeholder="01XXXXXXXXX"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            autoComplete="current-password"
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
        </div>

        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {busy && <Loader2 className="animate-spin" aria-hidden />}
          <LogIn aria-hidden /> লগইন
        </Button>

        <p className="text-center text-sm text-text-muted">
          এখনো এনরোল করেননি?{" "}
          <a href="/#enroll" className="font-semibold text-brand-strong underline underline-offset-4">
            এনরোল করুন
          </a>
        </p>
        <p className="text-center text-sm text-text-muted">
          পাসওয়ার্ড ভুলে গেছেন?{" "}
          <a
            href={waLink(CONFIG.whatsappPaymentMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-strong underline underline-offset-4"
          >
            WhatsApp-এ জানান
          </a>
        </p>
      </form>
    </div>
  );
}
