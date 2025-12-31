"use client";

import { AppShell } from "@/components/app-shell";
import { useGameStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Gamepad2, ShieldQuestion, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const { state, setSettings, setGameMode } = useGameStore();

  return (
    <AppShell
      title="Roles y reglas"
      subtitle="Ajusta la experiencia para tu grupo. Todas las opciones se guardan localmente."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-6 w-6 text-brand-300" />
            <div>
              <h3 className="text-xl font-semibold">Modo de juego</h3>
              <p className="text-white/60 text-sm">Define cómo se revelan los roles.</p>
            </div>
          </div>
          <div className="space-y-3">
            <ModeCard
              title="Clásico"
              emoji="🕵️"
              description="Los impostores saben que lo son. Ritmo directo y claro."
              active={state.settings.gameMode === "clasico"}
              onClick={() => setGameMode("clasico")}
            />
            <ModeCard
              title="Misterioso"
              emoji="🎭"
              description="Los impostores no están seguros de su rol. Nadie confía en nadie."
              active={state.settings.gameMode === "misterioso"}
              onClick={() => setGameMode("misterioso")}
              accent="from-rose-500/20"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 space-y-4">
          <h3 className="text-xl font-semibold">Cantidad de roles</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberBox
              label="Impostores"
              value={state.settings.impostorCount}
              onChange={(v) => setSettings({ impostorCount: v })}
              min={1}
              max={Math.max(1, state.players.length - 1)}
            />
            <NumberBox
              label="Sr. Blanco"
              value={state.settings.enableSrBlanco ? state.settings.srBlancoCount : 0}
              onChange={(v) => setSettings({ srBlancoCount: v })}
              min={0}
              max={2}
              disabled={!state.settings.enableSrBlanco}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
            <div>
              <p className="font-semibold">Activar Sr. Blanco</p>
              <p className="text-white/60 text-sm">Recibe palabra vacía y puede adivinar.</p>
            </div>
            <Switch
              checked={state.settings.enableSrBlanco}
              onCheckedChange={(v) => setSettings({ enableSrBlanco: v })}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
            <div>
              <p className="font-semibold">Pista para impostores</p>
              <p className="text-white/60 text-sm">Muestra la pista/categoría sin palabra.</p>
            </div>
            <Switch
              checked={state.settings.showHintToImpostor}
              onCheckedChange={(v) => setSettings({ showHintToImpostor: v })}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
            <div>
              <p className="font-semibold">Revelar rol al expulsar</p>
              <p className="text-white/60 text-sm">Muestra el rol solo si está activado.</p>
            </div>
            <Switch
              checked={state.settings.revealRoleOnEliminate}
              onCheckedChange={(v) => setSettings({ revealRoleOnEliminate: v })}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
            <div>
              <p className="font-semibold">Empate permitido</p>
              <p className="text-white/60 text-sm">Si nadie decide, nadie sale.</p>
            </div>
            <Switch
              checked={state.settings.allowTie}
              onCheckedChange={(v) => setSettings({ allowTie: v })}
            />
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldQuestion className="h-6 w-6 text-amber-300" />
          <div>
            <h3 className="text-xl font-semibold">Temporizador y accesibilidad</h3>
            <p className="text-white/60 text-sm">Mantén el ritmo en rondas móviles.</p>
          </div>
        </div>
        <Slider
          label={`Duración de ronda: ${state.settings.timerMinutes} min`}
          min={1}
          max={10}
          value={state.settings.timerMinutes}
          onChange={(e) => setSettings({ timerMinutes: Number(e.target.value) })}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            checked={state.settings.soundEnabled}
            onCheckedChange={(v) => setSettings({ soundEnabled: v })}
          />
          <span>Sonidos y vibración</span>
          <Switch
            checked={state.settings.contrastEnabled}
            onCheckedChange={(v) => setSettings({ contrastEnabled: v })}
          />
          <span>Modo alto contraste</span>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/deal">
            <Button className="gap-2">
              Ir a repartir
              <Sparkles className="h-5 w-5 text-amber-200" />
            </Button>
          </Link>
          <Link href="/players">
            <Button variant="secondary">Editar jugadores</Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function NumberBox({
  label,
  value,
  onChange,
  min,
  max,
  disabled
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 flex flex-col gap-2">
      <p className="text-sm text-white/60">{label}</p>
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 rounded-full bg-white/10 text-2xl"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled}
        >
          −
        </button>
        <div className="flex-1 text-center text-2xl font-bold">{value}</div>
        <button
          className="h-10 w-10 rounded-full bg-white/10 text-2xl"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  description,
  emoji,
  active,
  onClick,
  accent = "from-brand-500/30"
}: {
  title: string;
  description: string;
  emoji: string;
  active?: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
        active
          ? `border-brand-400 bg-gradient-to-br ${accent} to-surface-800`
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span>{emoji}</span>
          {title}
        </div>
        {active && <Chip color="green">Activo</Chip>}
      </div>
      <p className="mt-1 text-white/70">{description}</p>
    </button>
  );
}
