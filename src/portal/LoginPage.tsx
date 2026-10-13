import { useId, useState, type FormEvent } from "react";
import { Loader2, Phone, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

/**
 * Student login: phone number (from enrollment form) → direct access.
 * Payment verification is enforced by database (RLS) — unverified students see pending status in dashboard.
 *
 * Admin login with password for direct access.
 */
export function LoginPage({ next }: { next: string }) {
  const [phone, setPhone] = useState(() => new URLSearchParams(window.location.search).get("phone") ?? "");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"student" | "admin">("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const phoneId = useId();
  const passwordId = useId();
  const errId = useId();

  const loginStudent = async (e: FormEvent) => {
    e.preventDefault();
    const phoneNum = phone.trim();
    if (!phoneNum) {
      setError("ফোন নম্বর দিন।");
      return;
    }
    setBusy(true);
    setError(null);
    // Students log in with their phone number from enrollment.
    // Check if phone exists in enrollments table via Supabase RPC/direct query
    try {
      const { data, error: fetchError } = await supabase!
        .from("enrollments")
        .select("email")
        .eq("phone", phoneNum)
        .single();

      if (fetchError || !data) {
        setError("এই ফোন নম্বরে কোনো এনরোলমেন্ট খুঁজে পাওয়া যায়নি।");
        setBusy(false);
        return;
      }

      // Sign in with the student's email from enrollment
      const { error: signError } = await supabase!.auth.signInWithOtp({
        email: data.email,
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });

      if (signError) {
        setError("লগইন ব্যর্থ। আবার চেষ্টা করুন।");
      }
    } catch {
      setError("লগইন ব্যর্থ। আবার চেষ্টা করুন।");
    }
    setBusy(false);
  };

  const loginWithPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== "112233") {
      setError("পাসওয়ার্ড সঠিক নয়।");
      return;
    }
    setBusy(true);
    setError(null);
    // Admin login: send OTP to admin email
    const { error } = await supabase!.auth.signInWithOtp({
      email: "asrafulislam2000@gmail.com",
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      setError("লগইন ব্যর্থ। আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant={step === "admin" ? "primary" : "secondary"}
          onClick={() => {
            setStep("admin");
            setError(null);
            setPassword("");
          }}
          className="flex items-center gap-2"
        >
          <Lock className="h-4 w-4" aria-hidden />
          অ্যাডমিন লগইন
        </Button>
        <Button
          type="button"
          variant={step === "admin" ? "secondary" : "primary"}
          onClick={() => {
            setStep("student");
            setError(null);
            setPhone("");
          }}
          className="flex items-center gap-2"
        >
          <Phone className="h-4 w-4" aria-hidden />
          স্টুডেন্ট লগইন
        </Button>
      </div>

      {/* Admin Login */}
      {step === "admin" && (
        <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
          <form onSubmit={loginWithPassword} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-white">
                <Lock className="h-7 w-7" aria-hidden />
              </span>
              <h1 className="text-2xl font-bold">অ্যাডমিন লগইন</h1>
              <p className="text-text-muted">পাসওয়ার্ড দিয়ে সরাসরি লগইন করুন।</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={passwordId} className="text-[15px] font-semibold">
                পাসওয়ার্ড
              </label>
              <Input
                id={passwordId}
                type="password"
                placeholder="পাসওয়ার্ড"
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
              <LogIn className="h-4 w-4" aria-hidden />
              লগইন
            </Button>
          </form>
        </div>
      )}

      {/* Student Phone Login */}
      {step === "student" && (
        <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
          <form onSubmit={loginStudent} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-white">
                <Phone className="h-7 w-7" aria-hidden />
              </span>
              <h1 className="text-2xl font-bold">স্টুডেন্ট লগইন</h1>
              <p className="text-text-muted">এনরোল করার সময় যে ফোন নম্বর দিয়েছিলেন, সেটি লিখুন।</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={phoneId} className="text-[15px] font-semibold">
                ফোন নম্বর
              </label>
              <Input
                id={phoneId}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              <LogIn className="h-4 w-4" aria-hidden />
              লগইন
            </Button>
            <p className="text-center text-sm text-text-muted">
              এখনো এনরোল করেননি?{" "}
              <a href="/#enroll" className="font-semibold text-brand-strong underline underline-offset-4">
                এনরোল করুন
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
