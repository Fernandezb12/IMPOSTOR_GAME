"use client";

import { useEffect, useState } from "react";
import { TimerIcon, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { formatMinutes } from "@/lib/utils";

interface TimerProps {
  minutes: number;
}

export function Timer({ minutes }: TimerProps) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSeconds(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
      <TimerIcon className="h-6 w-6 text-brand-300" />
      <div className="flex-1">
        <p className="text-xs uppercase text-white/60">Temporizador</p>
        <p className="text-2xl font-bold tabular-nums">{formatMinutes(seconds)}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="md" onClick={() => setRunning((v) => !v)}>
          {running ? "Pausar" : "Iniciar"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSeconds(minutes * 60);
            setRunning(false);
          }}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
