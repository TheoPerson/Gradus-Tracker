export interface Summoner {
  accountId: string;
  gameName: string;
  profileIconId: number;
  puuid: string;
  summonerId: number;
  summonerLevel: number;
  tagLine: string;
}

export interface Champion {
  id: number;
  alias: string;
  name: string;
  roles: ChampionRole[];
  active: boolean;
}

export const ChampionRoles = [
  "assassin",
  "fighter",
  "mage",
  "marksman",
  "support",
  "tank",
] as const;
export type ChampionRole = (typeof ChampionRoles)[number];

export type ChallengeTier =
  | "UNRANKED"
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";

export type ChallengeCategory =
  | "Expertise"
  | "Teamwork & Strategy"
  | "Imagination"
  | "Veterancy"
  | "Collection";

export interface ChallengeProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  mode: GameMode;
  category: ChallengeCategory;

  // Progress
  progress: ChallengeProgress;
  currentTier: ChallengeTier;

  // Champions
  champions: Array<Champion & { done: boolean }>;
  totalDone: number;
}

export type GameMode = "Arena" | "Aram" | "Rift";

export interface Stat {
  flat: number;
  percent: number;
  perLevel: number;
  percentPerLevel: number;
}

export interface ChampionStats {
  aramAbilityHaste: number;
  aramAttackSpeed: number;
  aramDamageDealt: number;
  aramDamageTaken: number;
  aramEnergyRegen: number;
  aramHealing: number;
  aramShielding: number;
  aramTenacity: number;
}

export type AramStats = Record<string, ChampionStats>;
