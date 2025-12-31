import Link from "next/link";
import { Gamepad2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, subtitle, actions }: AppShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:pb-12">
      <header className="flex items-center justify-between gap-3 rounded-3xl bg-surface-800/60 px-4 py-3 border border-white/5 backdrop-blur">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-400 text-2xl font-bold shadow-card">
            🕵️
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-white/60">Impostor</span>
            <span className="text-base font-semibold text-white">¿Quién es el Espía?</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {actions}
          <Link
            href="/setup"
            className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-white/80"
          >
            <Menu className="h-5 w-5" />
            Configurar
          </Link>
        </div>
      </header>
      {(title || subtitle) && (
        <div className="mt-6 space-y-1">
          {title && <h1 className="text-3xl font-bold">{title}</h1>}
          {subtitle && <p className="text-white/70 text-lg">{subtitle}</p>}
        </div>
      )}
      <main className={cn("mt-6 space-y-6")}>{children}</main>
      <footer className="mt-10 flex items-center justify-between text-sm text-white/40">
        <span>Hecho para jugar en una sola pantalla.</span>
        <span className="inline-flex items-center gap-2">
          <Gamepad2 className="h-4 w-4" /> Pass &amp; Play
        </span>
      </footer>
    </div>
  );
}
