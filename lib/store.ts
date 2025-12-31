import { create } from "zustand";
import { persist } from "zustand/middleware";
import { computeWinState, validateSettings } from "./game-logic";
import { Assignment, GameMode, GameState, Pack, Player, RoleType } from "./types";
import { shuffle, uuid } from "./utils";
import packsData from "@/data/packs.es.json";

const defaultSettings: GameState["settings"] = {
  playersCount: 4,
  impostorCount: 1,
  srBlancoCount: 1,
  enableSrBlanco: true,
  showHintToImpostor: true,
  timerMinutes: 4,
  revealRoleOnEliminate: true,
  allowTie: true,
  srBlancoGuessMode: "onEliminated",
  gameMode: "clasico",
  soundEnabled: true,
  contrastEnabled: false
};

const defaultPlayers: Player[] = Array.from({ length: 4 }).map((_, i) => ({
  id: uuid(),
  name: `Jugador ${i + 1}`,
  color: defaultColor(i),
  alive: true
}));

function defaultColor(index: number) {
  const palette = [
    "#8B5CF6",
    "#22D3EE",
    "#F59E0B",
    "#10B981",
    "#F43F5E",
    "#6366F1",
    "#14B8A6",
    "#EC4899"
  ];
  return palette[index % palette.length];
}

export type GameStore = {
  state: GameState;
  setPlayers: (players: Player[]) => void;
  addPlayer: (name?: string) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  setSettings: (settings: Partial<GameState["settings"]>) => void;
  selectPack: (packId: string) => void;
  toggleFavorite: (packId: string) => void;
  addCustomPack: (pack: Omit<Pack, "id">) => void;
  assignRoles: () => { error?: string };
  nextReveal: () => void;
  resetRound: () => void;
  eliminate: (playerId: string) => void;
  markTie: () => void;
  setGameMode: (mode: GameMode) => void;
  resetAll: () => void;
  setStage: (stage: GameState["runtime"]["stage"]) => void;
  recordGuess: (guess: string, success: boolean) => void;
  persistCustomPacks: (packs: GameState["customPacks"]) => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: {
        players: defaultPlayers,
        settings: defaultSettings,
        runtime: {
          stage: "home",
          currentRevealIndex: 0,
          winState: "ongoing",
          history: []
        },
        favorites: [],
        customPacks: [],
        stats: { gamesPlayed: 0, civilWins: 0, impostorWins: 0, srBlancoWins: 0 }
      },
      setPlayers: (players) =>
        set((s) => ({
          state: {
            ...s.state,
            players,
            settings: { ...s.state.settings, playersCount: players.length }
          }
        })),
      addPlayer: (name) =>
        set((s) => {
          const nextNumber = s.state.players.length + 1;
          const candidate = name || `Jugador ${nextNumber}`;
          const uniqueName = ensureUniqueName(candidate, s.state.players);
          const newPlayer: Player = {
            id: uuid(),
            name: uniqueName,
            color: defaultColor(nextNumber),
            alive: true
          };
          return {
            state: {
              ...s.state,
              players: [...s.state.players, newPlayer],
              settings: { ...s.state.settings, playersCount: s.state.players.length + 1 }
            }
          };
        }),
      updatePlayer: (id, updates) =>
        set((s) => ({
          state: {
            ...s.state,
            players: s.state.players.map((p) => (p.id === id ? { ...p, ...updates } : p))
          }
        })),
      removePlayer: (id) =>
        set((s) => ({
          state: {
            ...s.state,
            players: s.state.players.filter((p) => p.id !== id),
            settings: {
              ...s.state.settings,
              playersCount: Math.max(3, s.state.players.length - 1)
            }
          }
        })),
      setSettings: (settings) =>
        set((s) => ({
          state: { ...s.state, settings: { ...s.state.settings, ...settings } }
        })),
      selectPack: (packId) =>
        set((s) => ({
          state: { ...s.state, runtime: { ...s.state.runtime, currentPackId: packId } }
        })),
      toggleFavorite: (packId) =>
        set((s) => {
          const exists = s.state.favorites.includes(packId);
          return {
            state: {
              ...s.state,
              favorites: exists
                ? s.state.favorites.filter((id) => id !== packId)
                : [...s.state.favorites, packId]
            }
          };
        }),
      addCustomPack: (pack) =>
        set((s) => ({
          state: {
            ...s.state,
            customPacks: [
              ...s.state.customPacks,
              { ...pack, id: `custom-${uuid()}`, createdAt: Date.now() }
            ]
          }
        })),
      assignRoles: () => {
        const { state } = get();
        const validation = validateSettings({ players: state.players, settings: state.settings });
        if (validation) return { error: validation };

        const pack = getPacks().find((p) => p.id === state.runtime.currentPackId) || getPacks()[0];
        if (!pack) return { error: "Selecciona un paquete de palabras." };
        const pair = pack ? shuffle(pack.pairs)[0] : undefined;
        if (!pair) return { error: "El paquete seleccionado no tiene suficientes pares." };

        const playersShuffled = shuffle(state.players);
        const assignments: RoleType[] = [];
        assignments.push(...Array(state.settings.impostorCount).fill("impostor"));
        if (state.settings.enableSrBlanco) {
          assignments.push(...Array(state.settings.srBlancoCount).fill("srblanco"));
        }
        const civilianCount = Math.max(playersShuffled.length - assignments.length, 0);
        assignments.push(...Array(civilianCount).fill("civil"));
        const roles = shuffle(assignments);

        const updatedPlayers = playersShuffled.map((p, idx) => ({
          ...p,
          alive: true,
          role: roles[idx]
        }));

        set((s) => ({
          state: {
            ...s.state,
            players: updatedPlayers,
            runtime: {
              ...s.state.runtime,
              assignment: {
                realWord: pair.real,
                fakeWord: pair.fake,
                hint: pair.hint,
                packId: pack.id
              },
              currentRevealIndex: 0,
              eliminatedPlayerId: undefined,
              tie: false,
              stage: "deal",
              winState: "ongoing"
            }
          }
        }));
        return {};
      },
      nextReveal: () =>
        set((s) => {
          const nextIndex = s.state.runtime.currentRevealIndex + 1;
          if (nextIndex >= s.state.players.length) {
            return { state: { ...s.state, runtime: { ...s.state.runtime, stage: "round" } } };
          }
          return { state: { ...s.state, runtime: { ...s.state.runtime, currentRevealIndex: nextIndex } } };
        }),
      resetRound: () =>
        set((s) => ({
          state: {
            ...s.state,
            players: s.state.players.map((p) => ({ ...p, alive: true, role: p.role })),
            runtime: {
              ...s.state.runtime,
              stage: "home",
              eliminatedPlayerId: undefined,
              tie: false,
              winState: "ongoing",
              currentRevealIndex: 0
            }
          }
        })),
      markTie: () =>
        set((s) => ({
          state: {
            ...s.state,
            runtime: {
              ...s.state.runtime,
              tie: true,
              stage: "results",
              eliminatedPlayerId: undefined,
              winState: "ongoing"
            }
          }
        })),
      eliminate: (playerId) =>
        set((s) => {
          const players = s.state.players.map((p) =>
            p.id === playerId ? { ...p, alive: false } : p
          );
          const winState = computeWinState({ ...s.state, players });
          const stats = updateStats(s.state.stats, winState);
          return {
            state: {
              ...s.state,
              players,
              runtime: {
                ...s.state.runtime,
                eliminatedPlayerId: playerId,
                tie: false,
                stage: winState === "ongoing" ? "results" : "end",
                winState
              },
              stats
            }
          };
        }),
      setStage: (stage) =>
        set((s) => ({
          state: { ...s.state, runtime: { ...s.state.runtime, stage } }
        })),
      setGameMode: (mode) =>
        set((s) => ({
          state: { ...s.state, settings: { ...s.state.settings, gameMode: mode } }
        })),
      resetAll: () =>
        set(() => ({
          state: {
            players: defaultPlayers,
            settings: defaultSettings,
            runtime: {
              stage: "home",
              currentRevealIndex: 0,
              winState: "ongoing",
              history: []
            },
            favorites: [],
            customPacks: [],
            stats: { gamesPlayed: 0, civilWins: 0, impostorWins: 0, srBlancoWins: 0 }
          }
        })),
      recordGuess: (guess, success) =>
        set((s) => {
          const winState = success ? "srblanco" : s.state.runtime.winState;
          const stats = updateStats(s.state.stats, winState);
          return {
            state: {
              ...s.state,
              runtime: {
                ...s.state.runtime,
                history: [...s.state.runtime.history, { guess, winState, eliminated: s.state.runtime.eliminatedPlayerId }],
                winState
              },
              stats
            }
          };
        }),
      persistCustomPacks: (packs) =>
        set((s) => ({
          state: { ...s.state, customPacks: packs }
        }))
    }),
    {
      name: "impostor-espia-store",
      partialize: (state) => ({
        state: {
          players: state.state.players.map((p) => ({ ...p, role: undefined, alive: true })),
          settings: state.state.settings,
          favorites: state.state.favorites,
          customPacks: state.state.customPacks,
          stats: state.state.stats,
          runtime: {
            stage: "home",
            currentRevealIndex: 0,
            winState: "ongoing",
            history: []
          }
        }
      })
    }
  )
);

export function getPacks(): Pack[] {
  return [...(packsData as Pack[])];
}

function ensureUniqueName(name: string, players: Player[]) {
  let unique = name;
  let counter = 1;
  const names = new Set(players.map((p) => p.name));
  while (names.has(unique)) {
    counter += 1;
    unique = `${name} ${counter}`;
  }
  return unique;
}

function updateStats(stats: GameState["stats"], winState: GameState["runtime"]["winState"]) {
  const updated = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
  if (winState === "civiles") updated.civilWins += 1;
  if (winState === "impostores") updated.impostorWins += 1;
  if (winState === "srblanco") updated.srBlancoWins += 1;
  return updated;
}
