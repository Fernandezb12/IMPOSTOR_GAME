"use client";

import { useMemo, useState } from "react";
import { Plus, Trash, User, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Player } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  players: Player[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Player>) => void;
  onRemove: (id: string) => void;
}

const colors = [
  "#8B5CF6",
  "#22D3EE",
  "#F59E0B",
  "#10B981",
  "#F43F5E",
  "#6366F1",
  "#14B8A6",
  "#EC4899",
  "#EAB308",
  "#0EA5E9",
  "#F97316",
  "#84CC16"
];

export function PlayerListEditor({ players, onAdd, onRemove, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const alivePlayers = useMemo(() => players.filter(Boolean), [players]);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Jugadores</h3>
            <p className="text-white/60 text-sm">Entre 3 y 24 personas.</p>
          </div>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {alivePlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
                style={{ backgroundColor: player.color }}
              >
                <User className="h-5 w-5" />
              </div>
              <Input
                defaultValue={player.name}
                onFocus={() => setEditingId(player.id)}
                onBlur={(e) => {
                  onUpdate(player.id, { name: e.target.value || player.name });
                  setEditingId(null);
                }}
                className="bg-transparent"
              />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {colors.slice(0, 6).map((color) => (
                    <button
                      key={color}
                      aria-label="Elegir color"
                      onClick={() => onUpdate(player.id, { color })}
                      className={cn(
                        "h-6 w-6 rounded-full border border-white/10 transition hover:scale-105",
                        player.color === color && "ring-2 ring-white/70"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Palette className="h-5 w-5 text-white/50" />
              </div>
              <button
                type="button"
                onClick={() => onRemove(player.id)}
                className="ml-auto rounded-full bg-white/10 p-2 text-white/60 transition hover:bg-white/20"
                aria-label="Eliminar jugador"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
          {alivePlayers.length === 0 && (
            <p className="text-center text-white/60">Agrega jugadores para comenzar.</p>
          )}
        </div>
      </div>
    </section>
  );
}
