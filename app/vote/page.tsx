"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { VotingModal } from "@/components/voting-modal";
import { useGameStore } from "@/lib/store";
import { validateSettings } from "@/lib/game-logic";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function VotePage() {
  const router = useRouter();
  const { state, eliminate, markTie, setStage } = useGameStore();
  const validation = validateSettings({ players: state.players, settings: state.settings });

  if (validation) {
    return (
      <AppShell title="No puedes votar aún" subtitle="Revisa la configuración.">
        <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-300" />
          <p className="text-amber-100">{validation}</p>
        </div>
        <Button onClick={() => router.push('/setup')}>Volver</Button>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Votación"
      subtitle="Elige a quién expulsar. Confirma antes de mostrar el resultado."
    >
      <VotingModal
        players={state.players}
        allowTie={state.settings.allowTie}
        onConfirm={(id) => {
          eliminate(id);
          setStage("results");
          router.push("/results");
        }}
        onTie={() => {
          markTie();
          router.push("/results");
        }}
      />
    </AppShell>
  );
}
