import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { EMAIL } from "@/lib/validation";

/**
 * Passwordless sign-in. The email contains a magic link (opens /dashboard signed in) and, if the
 * Supabase email template includes {{ .Token }}, a code that can be typed here instead — handy when
 * the mail app opens links in a different browser.
 */
export function LoginPage({ next }: { next: string }) {
  const [email, setEmail] = useState(() => new URLSearchParams(window.location.search).get("email") ?? "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailId = useId();
  const codeId = useId();
  const errId = useId();

  const sendLink = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    setBusy(false);
    if (error) {
      setError(
        error.status === 429
          ? "অনেকবার চেষ্টা হয়েছে। এক মিনিট পরে আবার চেষ্টা করুন।"
          : "লিংক পাঠানো যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
      );
      return;
    }
    setEmail(value);
    setStep("sent");
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    const token = code.replace(/\s/g, "");
    if (!/^\d{6,10}$/.test(token)) {
      setError("ইমেইলে পাওয়া সংখ্যার কোডটি দিন।");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.verifyOtp({ email, token, type: "email" });
    setBusy(false);
    // On success onAuthStateChange fires and PortalApp redirects to `next`.
    if (error) setError("কোডটি সঠিক নয় বা মেয়াদ শেষ। নতুন লিংক চেয়ে আবার চেষ্টা করুন।");
  };

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      {step === "email" ? (
        <form onSubmit={sendLink} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-white">
              <Mail className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="text-2xl font-bold">স্টুডেন্ট লগইন</h1>
            <p className="text-text-muted">এনরোল ফর্মে যে ইমেইল দিয়েছিলেন, সেটি লিখুন। আমরা একটি লগইন লিংক পাঠাব।</p>
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
            {error && (
              <p id={errId} className="text-sm font-medium text-danger">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={busy} className="w-full">
            {busy && <Loader2 className="animate-spin" aria-hidden />}
            লগইন লিংক পাঠান
          </Button>
          <p className="text-center text-sm text-text-muted">
            এখনো এনরোল করেননি?{" "}
            <a href="/#enroll" className="font-semibold text-brand-strong underline underline-offset-4">
              এনরোল করুন
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={verifyCode} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 text-center" role="status">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-success-soft text-success">
              <MailCheck className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="text-2xl font-bold">ইমেইল চেক করুন</h1>
            <p className="text-text-muted">
              <span className="num break-all font-semibold text-text">{email}</span> ঠিকানায় লগইন লিংক পাঠানো হয়েছে।
              লিংকে ক্লিক করলেই ড্যাশবোর্ড খুলবে। ইনবক্সে না পেলে Spam ফোল্ডার দেখুন।
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={codeId} className="text-[15px] font-semibold">
              অথবা ইমেইলে পাওয়া কোড দিন
            </label>
            <Input
              id={codeId}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className="num tracking-[0.3em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errId : undefined}
            />
            {error && (
              <p id={errId} className="text-sm font-medium text-danger">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={busy} className="w-full">
            {busy && <Loader2 className="animate-spin" aria-hidden />}
            কোড দিয়ে লগইন
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
          >
            <ArrowLeft aria-hidden /> অন্য ইমেইল দিন
          </Button>
        </form>
      )}
    </div>
  );
}
