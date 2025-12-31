"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ResultsScreen } from "@/components/results-screen";
import { useGameStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const router = useRouter();
  const { state, setStage } = useGameStore();
  const eliminated = state.players.find((p) => p.id === state.runtime.eliminatedPlayerId);

  return (
    <AppShell
      title="Resultado"
      subtitle={state.runtime.tie ? "No hubo expulsión esta ronda." : "Muestra el resultado al grupo."}
    >
      <ResultsScreen
        eliminated={state.runtime.tie ? undefined : eliminated}
        revealRole={state.settings.revealRoleOnEliminate}
        winState={state.runtime.winState}
        onContinue={() => {
          setStage("round");
          router.push("/round");
        }}
        onFinish={() => {
          setStage("end");
          router.push("/end");
        }}
      />

      {state.settings.enableSrBlanco && state.settings.srBlancoGuessMode === "onEliminated" && state.runtime.winState === "ongoing" && (
        <Card className="p-4 space-y-3">
          <p className="font-semibold">Intento del Sr. Blanco</p>
          <p className="text-white/70 text-sm">
            Si el Sr. Blanco fue eliminado, puede intentar adivinar la palabra real en voz alta. Si acierta,
            gana inmediatamente.
          </p>
        </Card>
      )}

      {state.runtime.winState !== "ongoing" && (
        <Button onClick={() => router.push('/end')} className="gap-2">
          Ver fin de partida
        </Button>
      )}
    </AppShell>
  );
}
