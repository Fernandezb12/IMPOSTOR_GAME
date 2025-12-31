"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Timer } from "@/components/timer";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sparkles, Vote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export default function RoundPage() {
  const router = useRouter();
  const { state, setStage } = useGameStore();

  useEffect(() => {
    if (!state.runtime.assignment) {
      router.replace("/deal");
    }
  }, [state.runtime.assignment, router]);

  return (
    <AppShell
      title="Ronda en curso"
      subtitle="Hablen, pregunten y mantengan la palabra en secreto."
      actions={
        <Button variant="secondary" onClick={() => router.push('/vote')}>
          Ir a votar
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-4">
          <Timer minutes={state.settings.timerMinutes} />
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-lg font-semibold">Consejo</p>
            <p className="text-white/70 text-sm">
              Haz preguntas indirectas. Evita decir palabras obvias. Si eres impostor, sé ambiguo pero coherente.
            </p>
          </div>
        </Card>
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <div>
              <p className="font-semibold">Recuerda</p>
              <p className="text-white/60 text-sm">Usa el botón de votar cuando estén listos.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoPill title="Civiles" value={state.players.filter((p) => p.role === 'civil' && p.alive).length} />
            <InfoPill title="Impostores" value={state.players.filter((p) => p.role === 'impostor' && p.alive).length} />
            <InfoPill title="Sr. Blanco" value={state.players.filter((p) => p.role === 'srblanco' && p.alive).length} />
            <InfoPill title="Vivos" value={state.players.filter((p) => p.alive).length} />
          </div>
          <Button
            className="w-full gap-2"
            onClick={() => {
              setStage("vote");
              router.push("/vote");
            }}
          >
            <Vote className="h-5 w-5" />
            Votar ahora
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}

function InfoPill({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-center">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
