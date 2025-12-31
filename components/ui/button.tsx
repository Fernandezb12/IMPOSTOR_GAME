import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-card",
        secondary:
          "bg-surface-700 text-white border border-white/10 hover:border-brand-300/40",
        ghost: "bg-transparent text-white hover:bg-white/5",
        outline:
          "bg-transparent border border-white/15 text-white hover:border-brand-400 hover:text-brand-100"
      },
      size: {
        md: "px-4 py-3 text-base",
        lg: "px-5 py-3.5 text-lg",
        icon: "p-3"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  }
);
Button.displayName = "Button";
