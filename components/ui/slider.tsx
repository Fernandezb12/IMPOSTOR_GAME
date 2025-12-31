"use client";

import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Slider({ className, label, ...props }: SliderProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/80">
      {label && <span>{label}</span>}
      <input
        type="range"
        className={cn(
          "w-full accent-brand-500 bg-surface-700 rounded-full appearance-none h-2",
          className
        )}
        {...props}
      />
    </label>
  );
}
