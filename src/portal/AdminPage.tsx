import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewPanel } from "./admin/OverviewPanel";
import { PaymentsPanel } from "./admin/PaymentsPanel";
import { ClassesPanel } from "./admin/ClassesPanel";
import { SettingsPanel } from "./admin/SettingsPanel";

const TABS = [
  { id: "overview", label: "ওভারভিউ" },
  { id: "payments", label: "পেমেন্ট যাচাই" },
  { id: "classes", label: "ক্লাস" },
  { id: "settings", label: "সেটিংস" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function AdminPage({ isAdmin, session }: { isAdmin: boolean; session: Session }) {
  const [tab, setTab] = useState<TabId>("overview");

  if (!isAdmin) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-danger" aria-hidden />
        <h1 className="text-xl font-bold">অ্যাক্সেস নেই</h1>
        <p className="mt-2 text-text-muted">
          <span className="num break-all">{session.user.email}</span> অ্যাডমিন হিসেবে যুক্ত নয়।
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[26px] font-bold sm:text-3xl">অ্যাডমিন প্যানেল</h1>
      <div role="tablist" aria-label="অ্যাডমিন বিভাগ" className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-bg-elevated p-1 sm:flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              "h-11 flex-1 whitespace-nowrap rounded-xl px-4 font-semibold transition-colors",
              tab === t.id ? "bg-gradient-cta text-white" : "text-text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "overview" ? (
          <OverviewPanel onReviewPayments={() => setTab("payments")} />
        ) : tab === "payments" ? (
          <PaymentsPanel />
        ) : tab === "classes" ? (
          <ClassesPanel />
        ) : (
          <SettingsPanel />
        )}
      </div>
    </div>
  );
}
