"use client";

import { useState } from "react";
import { AlertTriangle, Check, Users } from "lucide-react";
import { Player } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VotingModalProps {
  players: Player[];
  onConfirm: (playerId: string) => void;
  onTie?: () => void;
  allowTie?: boolean;
}

export function VotingModal({ players, onConfirm, onTie, allowTie }: VotingModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const alive = players.filter((p) => p.alive);

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(40);
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-brand-300" />
        <div>
          <p className="text-lg font-semibold">Votación</p>
          <p className="text-white/60 text-sm">Elige a quién expulsar.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {alive.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelected(player.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-brand-400/40",
              selected === player.id && "border-brand-400 bg-brand-500/10"
            )}
          >
            <span
              className="h-10 w-10 rounded-full"
              style={{ backgroundColor: player.color }}
              aria-hidden
            />
            <div className="flex-1">
              <p className="font-semibold">{player.name}</p>
              <p className="text-xs text-white/50">Pulsa para seleccionar</p>
            </div>
            {selected === player.id && <Check className="h-5 w-5 text-brand-200" />}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button
          className="flex-1"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            vibrate();
            onConfirm(selected);
          }}
        >
          Confirmar expulsión
        </Button>
        {allowTie && onTie && (
          <Button
            variant="ghost"
            onClick={() => {
              vibrate();
              onTie();
            }}
            className="border border-white/10"
          >
            Empate
          </Button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        Si hay Sr. Blanco activo, podrá intentar adivinar según las reglas.
      </div>
    </div>
  );
}
