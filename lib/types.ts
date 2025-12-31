export type RoleType = "civil" | "impostor" | "srblanco";

export type GameMode = "clasico" | "misterioso";

export type WinState = "ongoing" | "civiles" | "impostores" | "srblanco";

export interface Pair {
  real: string;
  fake: string;
  hint: string;
}

export interface Pack {
  id: string;
  name: string;
  icon: string;
  cover: string;
  pairs: Pair[];
  locked?: boolean;
  description?: string;
  tags?: string[];
}

export interface CustomPack extends Pack {
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  alive: boolean;
  role?: RoleType;
  avatar?: string;
}

export interface GameSettings {
  playersCount: number;
  impostorCount: number;
  srBlancoCount: number;
  enableSrBlanco: boolean;
  showHintToImpostor: boolean;
  timerMinutes: number;
  revealRoleOnEliminate: boolean;
  allowTie: boolean;
  srBlancoGuessMode: "final" | "onEliminated";
  gameMode: GameMode;
  soundEnabled: boolean;
  contrastEnabled: boolean;
}

export interface Assignment {
  realWord: string;
  fakeWord: string;
  hint?: string;
  packId?: string;
}

export interface GameRuntime {
  currentPackId?: string;
  assignment?: Assignment;
  stage:
    | "home"
    | "packs"
    | "players"
    | "setup"
    | "deal"
    | "round"
    | "vote"
    | "results"
    | "end";
  currentRevealIndex: number;
  eliminatedPlayerId?: string;
  tie?: boolean;
  winState: WinState;
  history: { eliminated?: string; guess?: string; winState: WinState }[];
}

export interface Stats {
  gamesPlayed: number;
  civilWins: number;
  impostorWins: number;
  srBlancoWins: number;
}

export interface GameState {
  players: Player[];
  settings: GameSettings;
  runtime: GameRuntime;
  favorites: string[];
  customPacks: CustomPack[];
  stats: Stats;
}
