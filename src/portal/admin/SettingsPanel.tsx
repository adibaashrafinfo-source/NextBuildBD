import { useEffect, useId, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, type CourseSettings } from "@/lib/supabase";
import { ErrorNote } from "./ErrorNote";

const isHttps = (v: string) => /^https:\/\/\S+$/.test(v);

/** Private links shown only to verified students (kept in the database, never in the public bundle). */
export function SettingsPanel() {
  const [values, setValues] = useState<{ group: string; meet: string } | null>(null);
  const [errors, setErrors] = useState<{ group?: string; meet?: string }>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const id = useId();

  useEffect(() => {
    supabase!
      .from("course_settings")
      .select("whatsapp_group_link, meet_link")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setStatus("error");
        const s = data as CourseSettings | null;
        setValues({ group: s?.whatsapp_group_link ?? "", meet: s?.meet_link ?? "" });
      });
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values) return;
    const errs: typeof errors = {};
    if (values.group && !isHttps(values.group.trim())) errs.group = "https:// দিয়ে শুরু হওয়া লিংক দিন।";
    if (values.meet && !isHttps(values.meet.trim())) errs.meet = "https:// দিয়ে শুরু হওয়া লিংক দিন।";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("saving");
    const { error } = await supabase!
      .from("course_settings")
      .update({ whatsapp_group_link: values.group.trim() || null, meet_link: values.meet.trim() || null })
      .eq("id", true);
    setStatus(error ? "error" : "saved");
  };

  if (!values) {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="লোড হচ্ছে">
        <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card flex max-w-2xl flex-col gap-5 p-5 sm:p-6">
      <p className="text-text-muted">এই লিংকগুলো শুধু যাচাই হওয়া স্টুডেন্টরা ড্যাশবোর্ডে দেখতে পাবে।</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-group`} className="text-[15px] font-semibold">
          WhatsApp গ্রুপ লিংক
        </label>
        <Input
          id={`${id}-group`}
          type="url"
          placeholder="https://chat.whatsapp.com/…"
          value={values.group}
          onChange={(e) => setValues({ ...values, group: e.target.value })}
          aria-invalid={Boolean(errors.group)}
          aria-describedby={errors.group ? `${id}-group-err` : undefined}
        />
        {errors.group && (
          <p id={`${id}-group-err`} className="text-sm font-medium text-danger">
            {errors.group}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-meet`} className="text-[15px] font-semibold">
          ডিফল্ট Google Meet লিংক
        </label>
        <Input
          id={`${id}-meet`}
          type="url"
          placeholder="https://meet.google.com/…"
          value={values.meet}
          onChange={(e) => setValues({ ...values, meet: e.target.value })}
          aria-invalid={Boolean(errors.meet)}
          aria-describedby={errors.meet ? `${id}-meet-err` : `${id}-meet-hint`}
        />
        {errors.meet ? (
          <p id={`${id}-meet-err`} className="text-sm font-medium text-danger">
            {errors.meet}
          </p>
        ) : (
          <p id={`${id}-meet-hint`} className="text-sm text-text-muted">
            কোনো ক্লাসে আলাদা Meet লিংক না থাকলে এটি দেখাবে।
          </p>
        )}
      </div>
      {status === "error" && <ErrorNote>সেভ বা লোড করা যায়নি। আবার চেষ্টা করুন।</ErrorNote>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" && <Loader2 className="animate-spin" aria-hidden />}
          সেভ করুন
        </Button>
        {status === "saved" && (
          <span role="status" className="inline-flex items-center gap-1.5 font-semibold text-success">
            <CheckCircle2 className="h-5 w-5" aria-hidden /> সেভ হয়েছে
          </span>
        )}
      </div>
    </form>
  );
}
