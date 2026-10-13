import { useCallback, useEffect, useId, useState, type FormEvent, type ReactElement } from "react";
import { CalendarClock, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { supabase, type CourseClass } from "@/lib/supabase";
import { formatDateTime } from "@/lib/utils";
import { ErrorNote } from "./ErrorNote";

type Draft = {
  title: string;
  description: string;
  startsAt: string; // datetime-local value (admin's local time)
  duration: string;
  meetUrl: string;
  recordingUrl: string;
  position: string;
  published: boolean;
};

const EMPTY: Draft = {
  title: "",
  description: "",
  startsAt: "",
  duration: "90",
  meetUrl: "",
  recordingUrl: "",
  position: "0",
  published: true,
};

const pad = (n: number) => String(n).padStart(2, "0");
/** ISO -> "YYYY-MM-DDTHH:mm" in the browser's local time (what <input type=datetime-local> expects). */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const isHttps = (v: string) => /^https:\/\/\S+$/.test(v);

function toDraft(c: CourseClass): Draft {
  return {
    title: c.title,
    description: c.description ?? "",
    startsAt: toLocalInput(c.starts_at),
    duration: String(c.duration_minutes),
    meetUrl: c.meet_url ?? "",
    recordingUrl: c.recording_url ?? "",
    position: String(c.position),
    published: c.published,
  };
}

function validate(d: Draft) {
  const e: Partial<Record<keyof Draft, string>> = {};
  if (!d.title.trim()) e.title = "ক্লাসের নাম দিন।";
  const dur = Number(d.duration);
  if (!Number.isInteger(dur) || dur < 5 || dur > 600) e.duration = "৫ থেকে ৬০০ মিনিটের মধ্যে দিন।";
  if (d.meetUrl && !isHttps(d.meetUrl.trim())) e.meetUrl = "https:// দিয়ে শুরু হওয়া লিংক দিন।";
  if (d.recordingUrl && !isHttps(d.recordingUrl.trim())) e.recordingUrl = "https:// দিয়ে শুরু হওয়া লিংক দিন।";
  if (!Number.isInteger(Number(d.position))) e.position = "পূর্ণসংখ্যা দিন।";
  return e;
}

export function ClassesPanel() {
  const [classes, setClasses] = useState<CourseClass[] | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase!
      .from("classes")
      .select("*")
      .order("position")
      .order("starts_at", { nullsFirst: false });
    if (error) setError("ক্লাস লোড করা যায়নি।");
    else {
      setError(null);
      setClasses(data as CourseClass[]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (c: CourseClass) => {
    if (!window.confirm(`"${c.title}" ক্লাসটি মুছে ফেলবেন?`)) return;
    const { error } = await supabase!.from("classes").delete().eq("id", c.id);
    if (error) setError("মুছে ফেলা যায়নি।");
    else setClasses((cs) => cs?.filter((x) => x.id !== c.id) ?? null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-text-muted">যাচাই হওয়া স্টুডেন্টরা প্রকাশিত ক্লাসগুলো ড্যাশবোর্ডে দেখবে।</p>
        {editing !== "new" && (
          <Button onClick={() => setEditing("new")} size="sm">
            <Plus aria-hidden /> নতুন ক্লাস
          </Button>
        )}
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
      {editing === "new" && (
        <ClassForm
          onCancel={() => setEditing(null)}
          onSaved={(c) => {
            setClasses((cs) => [...(cs ?? []), c]);
            setEditing(null);
          }}
        />
      )}
      {!classes ? (
        <div className="flex justify-center py-16" role="status" aria-label="লোড হচ্ছে">
          <Loader2 className="h-8 w-8 animate-spin text-brand-strong" aria-hidden />
        </div>
      ) : classes.length === 0 ? (
        <p className="card p-6 text-center text-text-muted">এখনো কোনো ক্লাস নেই।</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {classes.map((c) =>
            editing === c.id ? (
              <li key={c.id}>
                <ClassForm
                  existing={c}
                  onCancel={() => setEditing(null)}
                  onSaved={(saved) => {
                    setClasses((cs) => cs?.map((x) => (x.id === saved.id ? saved : x)) ?? null);
                    setEditing(null);
                  }}
                />
              </li>
            ) : (
              <li key={c.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {c.title}
                    {!c.published && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-2 py-0.5 text-xs text-text-muted">
                        <EyeOff className="h-3 w-3" aria-hidden /> খসড়া
                      </span>
                    )}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
                    {c.starts_at ? formatDateTime(c.starts_at) : "সময় ঠিক হয়নি"}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {c.meet_url ? "Meet লিংক আছে" : "Meet লিংক নেই"} · {c.recording_url ? "রেকর্ডিং আছে" : "রেকর্ডিং নেই"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(c.id)}>
                    <Pencil aria-hidden /> এডিট
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c)} aria-label={`${c.title} মুছুন`}>
                    <Trash2 className="text-danger" aria-hidden />
                  </Button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function ClassForm({
  existing,
  onCancel,
  onSaved,
}: {
  existing?: CourseClass;
  onCancel: () => void;
  onSaved: (c: CourseClass) => void;
}) {
  const [d, setD] = useState<Draft>(existing ? toDraft(existing) : EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const id = useId();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(d);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const row = {
      title: d.title.trim(),
      description: d.description.trim() || null,
      starts_at: d.startsAt ? new Date(d.startsAt).toISOString() : null,
      duration_minutes: Number(d.duration),
      meet_url: d.meetUrl.trim() || null,
      recording_url: d.recordingUrl.trim() || null,
      position: Number(d.position),
      published: d.published,
    };
    setSaving(true);
    const q = existing
      ? supabase!.from("classes").update(row).eq("id", existing.id).select().single()
      : supabase!.from("classes").insert(row).select().single();
    const { data, error } = await q;
    setSaving(false);
    if (error) setSaveError("সেভ করা যায়নি। আবার চেষ্টা করুন।");
    else onSaved(data as CourseClass);
  };

  const field = (k: keyof Draft, label: string, input: ReactElement, hint?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-${k}`} className="text-[15px] font-semibold">
        {label}
      </label>
      {input}
      {errors[k] ? (
        <p id={`${id}-${k}-err`} className="text-sm font-medium text-danger">
          {errors[k]}
        </p>
      ) : (
        hint && <p className="text-sm text-text-muted">{hint}</p>
      )}
    </div>
  );
  const a11y = (k: keyof Draft) => ({
    id: `${id}-${k}`,
    name: k,
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="card flex flex-col gap-4 border-brand p-5 sm:p-6" aria-label={existing ? "ক্লাস এডিট" : "নতুন ক্লাস"}>
      <p className="text-lg font-bold">{existing ? "ক্লাস এডিট করুন" : "নতুন ক্লাস যোগ করুন"}</p>
      {field("title", "ক্লাসের নাম", <Input {...a11y("title")} value={d.title} onChange={(e) => set("title", e.target.value)} />)}
      {field(
        "description",
        "বিবরণ (ঐচ্ছিক)",
        <Textarea {...a11y("description")} value={d.description} maxLength={2000} onChange={(e) => set("description", e.target.value)} />,
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {field(
          "startsAt",
          "শুরুর সময়",
          <Input {...a11y("startsAt")} type="datetime-local" value={d.startsAt} onChange={(e) => set("startsAt", e.target.value)} />,
          "আপনার ডিভাইসের সময় অনুযায়ী",
        )}
        {field(
          "duration",
          "সময়কাল (মিনিট)",
          <Input {...a11y("duration")} type="number" inputMode="numeric" min={5} max={600} value={d.duration} onChange={(e) => set("duration", e.target.value)} />,
        )}
      </div>
      {field(
        "meetUrl",
        "Google Meet লিংক (ঐচ্ছিক)",
        <Input {...a11y("meetUrl")} type="url" placeholder="https://meet.google.com/…" value={d.meetUrl} onChange={(e) => set("meetUrl", e.target.value)} />,
        "খালি রাখলে সেটিংসের ডিফল্ট Meet লিংক দেখাবে",
      )}
      {field(
        "recordingUrl",
        "রেকর্ডিং লিংক (ঐচ্ছিক)",
        <Input {...a11y("recordingUrl")} type="url" placeholder="https://…" value={d.recordingUrl} onChange={(e) => set("recordingUrl", e.target.value)} />,
        "YouTube (Unlisted) বা Google Drive লিংক",
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {field(
          "position",
          "ক্রম",
          <Input {...a11y("position")} type="number" inputMode="numeric" value={d.position} onChange={(e) => set("position", e.target.value)} />,
          "ছোট সংখ্যা আগে দেখাবে",
        )}
        <label className="flex min-h-12 cursor-pointer items-center gap-3 self-end rounded-xl border border-input px-4 py-3">
          <input
            type="checkbox"
            checked={d.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-5 w-5 accent-[var(--brand)]"
          />
          <span className="font-semibold">স্টুডেন্টদের দেখাও (প্রকাশিত)</span>
        </label>
      </div>
      {saveError && <ErrorNote>{saveError}</ErrorNote>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="animate-spin" aria-hidden />}
          সেভ করুন
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          বাতিল
        </Button>
      </div>
    </form>
  );
}
