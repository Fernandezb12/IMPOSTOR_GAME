import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

export function Card({ className, gradient, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card relative overflow-hidden",
        gradient && "bg-gradient-to-br from-surface-700/80 via-surface-800 to-surface-900",
        className
      )}
      {...props}
    />
  );
}
