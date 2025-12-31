"use client";

import Link from "next/link";
import { ArrowRight, Crown, Settings, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { useGameStore, getPacks } from "@/lib/store";
import { useMemo } from "react";
import { Chip } from "@/components/ui/chip";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const { state, setStage } = useGameStore();
  const pack = useMemo(() => {
    if (!state.runtime.currentPackId) return getPacks()[0];
    return getPacks().find((p) => p.id === state.runtime.currentPackId) || getPacks()[0];
  }, [state.runtime.currentPackId]);

  return (
    <AppShell
      title="Party game listo para móvil"
      subtitle="Configura, reparte roles y juega en un solo dispositivo."
      actions={
        <Link href="/packs" className="hidden md:inline-flex">
          <Button variant="secondary">Ver paquetes</Button>
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 space-y-4 bg-gradient-to-br from-brand-500/20 via-surface-800 to-surface-900 border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
              🕹️
            </div>
            <div>
              <p className="text-xl font-semibold">Modo Clásico</p>
              <p className="text-white/60 text-sm">Ideal para grupos nuevos.</p>
            </div>
          </div>
          <p className="text-white/80 leading-relaxed">
            Civiles comparten palabra, impostores reciben una similar, el Sr. Blanco improvisa. Haz
            preguntas, vota y gana. Animaciones suaves, fuentes grandes y controles táctiles pensados
            para una sola mano.
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip color="green">Pass &amp; Play</Chip>
            <Chip color="blue">PWA offline</Chip>
            <Chip color="orange">600+ pares</Chip>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/setup" onClick={() => setStage("setup")}>
              <Button className="flex items-center gap-2">
                Comenzar partida <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/deal">
              <Button variant="secondary" className="gap-2">
                Repartir roles
                <Sparkle className="h-5 w-5 text-amber-300" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-300" />
            <div>
              <p className="text-lg font-semibold">Estado rápido</p>
              <p className="text-white/60 text-sm">Configuración en uso.</p>
            </div>
          </div>
          <ul className="space-y-2 text-white/80">
            <li>
              <strong>Jugadores:</strong> {state.players.length}
            </li>
            <li>
              <strong>Impostores:</strong> {state.settings.impostorCount} · Sr. Blanco:{" "}
              {state.settings.enableSrBlanco ? state.settings.srBlancoCount : 0}
            </li>
            <li>
              <strong>Modo:</strong> {state.settings.gameMode === "clasico" ? "Clásico" : "Misterioso"}
            </li>
            <li>
              <strong>Pack:</strong> {pack?.name}
            </li>
            <li>
              <strong>Temporizador:</strong> {state.settings.timerMinutes} min
            </li>
          </ul>
          <div className="flex gap-3 pt-2">
            <Link href="/players">
              <Button variant="secondary" className="gap-2">
                Editar jugadores <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/packs">
              <Button variant="ghost">Cambiar pack</Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <p className="text-lg font-semibold">Estadísticas locales</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Partidas" value={state.stats.gamesPlayed} />
          <Stat label="Victorias civiles" value={state.stats.civilWins} />
          <Stat label="Victorias impostor" value={state.stats.impostorWins} />
          <Stat label="Sr. Blanco" value={state.stats.srBlancoWins} />
        </div>
      </Card>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-center">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
