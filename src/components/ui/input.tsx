import * as React from "react";
import { cn } from "@/lib/utils";

/** Shared text-field styling (input border token passes 3:1 against both backgrounds). */
export const inputClass =
  "h-12 w-full rounded-xl border border-input bg-bg px-4 text-base text-text placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand-soft aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClass, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputClass, "h-auto min-h-24 py-3", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
