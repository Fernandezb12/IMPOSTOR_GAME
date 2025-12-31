"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useGameStore } from "@/lib/store";
import { RoleRevealCard } from "@/components/role-reveal-card";
import { validateSettings } from "@/lib/game-logic";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles } from "lucide-react";

export default function DealPage() {
  const router = useRouter();
  const { state, assignRoles, nextReveal, setStage } = useGameStore();
  const [error, setError] = useState<string | null>(null);

  const currentPlayer = useMemo(
    () => state.players[state.runtime.currentRevealIndex],
    [state.players, state.runtime.currentRevealIndex]
  );

  useEffect(() => {
    const validation = validateSettings({ players: state.players, settings: state.settings });
    if (validation) {
      setError(validation);
      return;
    }
    if (!state.runtime.assignment) {
      const result = assignRoles();
      if (result.error) setError(result.error);
      setStage("deal");
    }
  }, [assignRoles, setStage, state.players, state.runtime.assignment, state.settings]);
  }, []);

  if (error) {
    return (
      <AppShell title="Falta algo..." subtitle="Corrige la configuración para continuar.">
        <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-300" />
          <p className="text-amber-100">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/setup")}>Volver a configuración</Button>
        </div>
      </AppShell>
    );
  }

  if (!state.runtime.assignment || !currentPlayer) return null;

  return (
    <AppShell
      title="Reparto secreto"
      subtitle="Entrega el teléfono a cada jugador. Nadie más debe ver su palabra."
      actions={
        <Button variant="secondary" onClick={() => assignRoles()} className="gap-2">
          <Sparkles className="h-5 w-5" /> Re-barajar
        </Button>
      }
    >
      <RoleRevealCard
        player={currentPlayer}
        assignment={state.runtime.assignment}
        gameMode={state.settings.gameMode}
        showHint={state.settings.showHintToImpostor}
        index={state.runtime.currentRevealIndex}
        total={state.players.length}
        onNext={() => {
          if (state.runtime.currentRevealIndex + 1 >= state.players.length) {
            setStage("round");
            router.push("/round");
          } else {
            nextReveal();
          }
        }}
      />
    </AppShell>
  );
}
