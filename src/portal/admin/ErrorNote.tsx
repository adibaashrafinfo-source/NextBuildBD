import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger bg-bg-elevated p-3 text-[15px] font-medium text-danger">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}
