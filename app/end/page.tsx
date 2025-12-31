"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";

export default function EndPage() {
  const { state, resetRound, resetAll } = useGameStore();
  const winnerText =
    state.runtime.winState === "civiles"
      ? "Civiles"
      : state.runtime.winState === "impostores"
        ? "Impostores"
        : state.runtime.winState === "srblanco"
          ? "Sr. Blanco"
          : "En juego";

  return (
    <AppShell title="Fin de partida" subtitle="Muestra los roles y planea la revancha.">
      <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-amber-300" />
          <div>
            <p className="text-xl font-bold">{winnerText}</p>
            <p className="text-white/60 text-sm">Revisa los roles antes de resetear.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {state.players.map((player) => (
            <div key={player.id} className="rounded-2xl bg-white/5 p-3">
              <p className="font-semibold">{player.name}</p>
              <p className="text-sm text-white/60">{roleLabel(player.role)}</p>
              <p className="text-xs text-white/40">{player.alive ? "Sobrevivió" : "Eliminado"}</p>
            </div>
          ))}
        </div>
        <p className="text-white/70 text-sm">
          Palabra real: {state.runtime.assignment?.realWord} · Palabra impostor: {state.runtime.assignment?.fakeWord}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => resetRound()} className="gap-2">
            <RotateCcw className="h-5 w-5" />
            Revancha misma configuración
          </Button>
          <Link href="/">
            <Button variant="secondary">Volver a inicio</Button>
          </Link>
          <Button variant="ghost" onClick={() => resetAll()}>
            Borrar todo
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function roleLabel(role?: string) {
  if (role === "impostor") return "Impostor";
  if (role === "srblanco") return "Sr. Blanco";
  return "Civil";
}
