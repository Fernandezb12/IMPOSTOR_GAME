"use client";

import { useMemo, useState } from "react";
import { Heart, Search, Sparkles } from "lucide-react";
import { Pack } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Chip } from "./ui/chip";

interface PackGridProps {
  packs: Pack[];
  favorites: string[];
  selected?: string;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  allowCreate?: () => void;
}

export function PackGrid({
  packs,
  favorites,
  selected,
  onSelect,
  onToggleFavorite,
  allowCreate
}: PackGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return packs;
    const lower = query.toLowerCase();
    return packs.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.pairs.some(
          (pair) =>
            pair.real.toLowerCase().includes(lower) ||
            pair.fake.toLowerCase().includes(lower) ||
            pair.hint.toLowerCase().includes(lower)
        )
    );
  }, [packs, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl bg-surface-800 border border-white/10 pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Buscar packs o palabras..."
          />
        </div>
        {allowCreate && (
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => allowCreate()}
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            Crear pack personalizado
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((pack) => {
          const isFavorite = favorites.includes(pack.id);
          const isSelected = selected === pack.id;
          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack.id)}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-white/5 bg-surface-800/80 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                isSelected && "ring-2 ring-brand-400/80 border-brand-500/60"
              )}
            >
              <div className="absolute inset-0 opacity-30">
                <Image
                  src={pack.cover || "/assets/ui/bg-gradient.svg"}
                  alt={pack.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-surface-800/90 via-surface-900/90 to-brand-900/30" />
              </div>
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                    <span aria-hidden>🧩</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{pack.name}</p>
                    <p className="text-sm text-white/60">
                      {pack.pairs.length} pares · {pack.tags?.join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pack.locked && <Chip color="orange">Bloqueado</Chip>}
                  <button
                    type="button"
                    className={cn(
                      "rounded-full bg-white/10 p-2 transition hover:bg-white/20",
                      isFavorite && "text-pink-300"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pack.id);
                    }}
                  >
                    <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
              {isSelected && (
                <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                  <span>Seleccionado para esta partida</span>
                  <Chip color="green">Listo</Chip>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
