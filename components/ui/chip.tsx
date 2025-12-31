import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  color?: "green" | "blue" | "orange" | "pink";
  className?: string;
}

const colors = {
  green: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/50",
  blue: "bg-cyan-500/10 text-cyan-100 border border-cyan-300/40",
  orange: "bg-orange-500/10 text-orange-100 border border-orange-300/40",
  pink: "bg-pink-500/10 text-pink-100 border border-pink-300/40"
};

export function Chip({ children, color = "blue", className }: ChipProps) {
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", colors[color], className)}>
      {children}
    </span>
  );
}
