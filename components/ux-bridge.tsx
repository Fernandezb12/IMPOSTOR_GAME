"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";

export function UXBridge() {
  const { state } = useGameStore();

  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.contrastEnabled) {
      root.classList.add("contrast");
    } else {
      root.classList.remove("contrast");
    }
  }, [state.settings.contrastEnabled]);

  return null;
}
