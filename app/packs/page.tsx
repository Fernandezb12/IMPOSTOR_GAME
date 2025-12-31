"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PackGrid } from "@/components/pack-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore, getPacks } from "@/lib/store";
import { Pair, Pack } from "@/lib/types";
import { Chip } from "@/components/ui/chip";

export default function PacksPage() {
  const { state, selectPack, toggleFavorite, addCustomPack } = useGameStore();
  const [customName, setCustomName] = useState("");
  const [customHint, setCustomHint] = useState("");
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [real, setReal] = useState("");
  const [fake, setFake] = useState("");
  const [hint, setHint] = useState("");
  const mergedPacks: Pack[] = [...getPacks(), ...state.customPacks];

  const handleAddPair = () => {
    if (!real || !fake || !hint) return;
    setPairs((prev) => [...prev, { real, fake, hint }]);
    setReal("");
    setFake("");
    setHint("");
  };

  const handleSaveCustom = () => {
    if (!customName || pairs.length < 3) return;
    addCustomPack({
      name: customName,
      cover: "/assets/packs/cover-custom.jpg",
      icon: "/assets/packs/icon-custom.png",
      pairs,
      description: customHint || "Pack personalizado",
      tags: ["personalizado"]
    });
    setCustomName("");
    setCustomHint("");
    setPairs([]);
  };

  return (
    <AppShell
      title="Paquetes de palabras"
      subtitle="Elige tu categoría favorita o crea una propia. Los datos se guardan en tu dispositivo."
    >
      <PackGrid
        packs={mergedPacks}
        favorites={state.favorites}
        selected={state.runtime.currentPackId}
        onSelect={selectPack}
        onToggleFavorite={toggleFavorite}
        allowCreate={() => {
          document.getElementById("custom-pack")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div id="custom-pack" className="space-y-3 rounded-3xl border border-white/5 bg-surface-800/80 p-5">
        <div className="flex items-center gap-2">
          <Chip color="pink">Beta</Chip>
          <h3 className="text-xl font-semibold">Crear pack personalizado</h3>
        </div>
        <p className="text-white/70">
          Añade pares real/falsa + pista. Se guardan en localStorage y aparecen en la lista.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Nombre del pack"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Input
            placeholder="Descripción corta (opcional)"
            value={customHint}
            onChange={(e) => setCustomHint(e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Palabra real" value={real} onChange={(e) => setReal(e.target.value)} />
          <Input placeholder="Palabra impostor" value={fake} onChange={(e) => setFake(e.target.value)} />
          <Input placeholder="Pista" value={hint} onChange={(e) => setHint(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={handleAddPair} className="w-full md:w-auto">
          Añadir par
        </Button>
        {pairs.length > 0 && (
          <div className="grid gap-2 md:grid-cols-2">
            {pairs.map((p, idx) => (
              <div key={idx} className="rounded-2xl bg-white/5 p-3 text-sm text-white/80">
                <p className="font-semibold text-white">Real: {p.real}</p>
                <p className="text-rose-200">Falsa: {p.fake}</p>
                <p className="text-white/60">Pista: {p.hint}</p>
              </div>
            ))}
          </div>
        )}
        <Button onClick={handleSaveCustom} disabled={!customName || pairs.length < 3}>
          Guardar pack personalizado ({pairs.length} pares)
        </Button>
      </div>
    </AppShell>
  );
}
