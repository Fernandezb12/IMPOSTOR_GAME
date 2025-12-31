"use client";

import { AppShell } from "@/components/app-shell";
import { PlayerListEditor } from "@/components/player-list-editor";
import { useGameStore } from "@/lib/store";

export default function PlayersPage() {
  const { state, addPlayer, updatePlayer, removePlayer } = useGameStore();

  return (
    <AppShell title="Jugadores" subtitle="Edita nombres, colores y prepara la mesa.">
      <PlayerListEditor
        players={state.players}
        onAdd={addPlayer}
        onRemove={removePlayer}
        onUpdate={updatePlayer}
      />
    </AppShell>
  );
}
