"use client";

import { GameState, Player } from "@/lib/types";
import { Button } from "./ui/button";
import { BadgeCheck, Skull, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  eliminated?: Player;
  revealRole: boolean;
  winState: GameState["runtime"]["winState"];
  onContinue: () => void;
  onFinish: () => void;
}

export function ResultsScreen({ eliminated, revealRole, winState, onContinue, onFinish }: Props) {
  const title =
    winState === "civiles"
      ? "¡Ganan los civiles!"
      : winState === "impostores"
        ? "¡Ganan los impostores!"
        : winState === "srblanco"
          ? "¡El Sr. Blanco acertó!"
          : "Resultado de la votación";

  return (
    <div className="rounded-3xl border border-white/10 bg-surface-800/80 p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-2xl">
          {winState === "ongoing" ? "🌀" : "🏁"}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-white/60">Actualiza la mesa con el resultado.</p>
        </div>
      </div>

      {eliminated ? (
        <div className="mt-4 rounded-2xl bg-white/5 p-4 flex items-center gap-3">
          <Skull className="h-6 w-6 text-rose-300" />
          <div>
            <p className="text-lg font-semibold">{eliminated.name} fue expulsado/a</p>
            {revealRole ? (
              <p className="text-white/70">
                Rol: <span className={cn(roleColors[eliminated.role ?? "civil"])}>{roleLabel(eliminated.role)}</span>
              </p>
            ) : (
              <p className="text-white/60">El rol se mantiene oculto.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-white/5 p-4 flex items-center gap-3 text-white/70">
          <BadgeCheck className="h-6 w-6 text-emerald-300" />
          <span>No hubo expulsados.</span>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {winState === "ongoing" ? (
          <Button onClick={onContinue}>Continuar ronda</Button>
        ) : (
          <Button onClick={onFinish} className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ver final de partida
          </Button>
        )}
      </div>
    </div>
  );
}

function roleLabel(role?: string) {
  if (role === "impostor") return "Impostor";
  if (role === "srblanco") return "Sr. Blanco";
  return "Civil";
}

const roleColors: Record<string, string> = {
  civil: "text-cyan-200",
  impostor: "text-rose-300",
  srblanco: "text-amber-200"
};
