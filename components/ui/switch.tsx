"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (value: boolean) => void;
  label?: string;
}

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={label}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "w-14 h-8 rounded-full px-1 flex items-center transition-all",
        checked ? "bg-brand-500" : "bg-white/10"
      )}
    >
      <motion.span
        layout
        className="w-6 h-6 rounded-full bg-white shadow-card"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );
}
