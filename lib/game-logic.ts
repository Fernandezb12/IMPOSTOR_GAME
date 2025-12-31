import { GameState, RoleType, WinState } from "./types";

function countRole(players: GameState["players"], role: RoleType) {
  return players.filter((p) => p.role === role && p.alive).length;
}

export function computeWinState(state: GameState): WinState {
  const impostores = countRole(state.players, "impostor");
  const civiles = countRole(state.players, "civil");
  const blancos = countRole(state.players, "srblanco");

  if (impostores <= 0) return "civiles";
  if (civiles <= 0) return "impostores";
  if (blancos > 0 && civiles === 0 && impostores === 0) return "srblanco";
  if (impostores >= civiles && civiles > 0) return "impostores";
  return "ongoing";
}

export function validateSettings({
  players,
  settings
}: {
  players: GameState["players"];
  settings: GameState["settings"];
}) {
  const total = players.length;
  const impostores = settings.impostorCount;
  const blancos = settings.enableSrBlanco ? settings.srBlancoCount : 0;

  if (total < 3) {
    return "Debe haber al menos 3 jugadores.";
  }
  if (impostores < 1 || impostores >= total) {
    return "La cantidad de impostores debe ser menor que la cantidad de jugadores.";
  }
  if (blancos < 0 || blancos > 2) {
    return "El Sr. Blanco debe estar entre 0 y 2.";
  }
  if (impostores + blancos >= total) {
    return "Deja espacio para civiles: ajusta impostores o Sr. Blanco.";
  }
  return null;
}
