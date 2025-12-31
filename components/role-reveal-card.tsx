"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldQuestion, User } from "lucide-react";
import { Assignment, Player } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  player: Player;
  assignment: Assignment;
  gameMode: "clasico" | "misterioso";
  showHint: boolean;
  onNext: () => void;
  index: number;
  total: number;
}

export function RoleRevealCard({
  player,
  assignment,
  gameMode,
  showHint,
  onNext,
  index,
  total
}: Props) {
  const roleLabel =
    gameMode === "misterioso" && player.role !== "civil" ? "???" : roleNames[player.role ?? "civil"];

  const word =
    player.role === "civil"
      ? assignment.realWord
      : player.role === "impostor"
        ? assignment.fakeWord
        : "—";

  const description =
    player.role === "srblanco"
      ? "No tienes palabra. Improvisa y trata de adivinar."
      : "La palabra es secreta, responde con cuidado.";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-brand-900/30 via-surface-800 to-surface-900 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between text-sm text-white/70">
        <span>Jugador {index + 1} de {total}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
          Desliza o pulsa para revelar
          <Eye className="h-4 w-4" />
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-4 text-center"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-4xl">
            <User />
          </div>
          <p className="text-xl font-semibold">{player.name}</p>
          <p className="text-sm text-white/60">Desliza hacia arriba para revelar tu rol</p>
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="mt-6 rounded-3xl bg-white/5 p-5 text-center"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className="text-sm uppercase tracking-wide text-white/60">Tu rol</p>
        <p className={cn("mt-1 text-3xl font-bold", roleColors[player.role ?? "civil"])}>
          {roleLabel}
        </p>
        <p className="mt-3 rounded-2xl bg-surface-700/70 px-4 py-3 text-lg font-semibold">
          {player.role === "srblanco" ? "Sin palabra" : `Tu palabra: ${word}`}
        </p>
        {showHint && player.role === "impostor" && (
          <p className="mt-2 text-sm text-amber-200/90">Pista: {assignment.hint}</p>
        )}
        <p className="mt-2 text-white/70 text-sm">{description}</p>
        {gameMode === "misterioso" && player.role === "impostor" && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80">
            <ShieldQuestion className="h-4 w-4 text-orange-300" /> Podrías ser impostor... o tal vez no.
          </p>
        )}
      </motion.div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <EyeOff className="h-5 w-5" />
          Oculta antes de pasar el móvil
        </div>
        <Button onClick={onNext} className="px-6">
          {index + 1 === total ? "Ir a la ronda" : "Siguiente jugador"}
        </Button>
      </div>
    </div>
  );
}

const roleNames: Record<string, string> = {
  civil: "Civil",
  impostor: "Impostor",
  srblanco: "Sr. Blanco"
};

const roleColors: Record<string, string> = {
  civil: "text-cyan-200",
  impostor: "text-rose-300",
  srblanco: "text-amber-200",
  "???": "text-white"
};
