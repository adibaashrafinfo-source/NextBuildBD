import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-cta text-white shadow-[0_8px_24px_-12px_var(--brand)] hover:shadow-glow hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        secondary: "border border-border bg-transparent text-text hover:border-brand hover:bg-brand-soft",
        ghost: "text-text hover:bg-brand-soft",
        white: "bg-white text-[#2E24C9] hover:bg-white/90 shadow-lg",
        outlineWhite: "border border-white/70 text-white hover:bg-white/10",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
      },
      size: {
        sm: "h-11 px-4 text-[15px]",
        md: "h-12 px-5 text-base",
        lg: "min-h-14 px-6 py-3 text-[17px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
