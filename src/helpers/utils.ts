import { LCUCredentials, RawChallenge } from "../types/lcu"
import {
  AramStats,
  Challenge,
  Champion,
  GameMode,
  ChallengeCategory,
  ChallengeTier,
  Stat,
} from "../types/lol"

export async function makeLCURequest<T = any>(
  credentials: LCUCredentials,
  path: string
): Promise<T> {
  const { address, port, username, password, protocol } = credentials
  const url = `${protocol}://${address}:${port}`
  const headers = new Headers({
    accept: "application/json",
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
      "base64"
    )}`,
  })

  const res = await fetch(`${url}${path}`, { headers })
  return await res.json()
}

const formatStat = (stat: Stat) => {
  return Math.round((stat.flat * 100 - 100) * 10) / 10
}

export function parseMerakiFile(json: object): AramStats {
  const result: AramStats = {}
  for (let [champion, value] of Object.entries(json)) {
    if (champion === "Fiddlesticks") {
      champion = "FiddleSticks"
    }
    result[champion] = {
      aramAbilityHaste: value.stats.aramAbilityHaste.flat,
      aramAttackSpeed: formatStat(value.stats.aramAttackSpeed),
      aramDamageDealt: formatStat(value.stats.aramDamageDealt),
      aramDamageTaken: formatStat(value.stats.aramDamageTaken),
      aramEnergyRegen: formatStat(value.stats.aramEnergyRegen),
      aramHealing: formatStat(value.stats.aramHealing),
      aramShielding: formatStat(value.stats.aramShielding),
      aramTenacity: formatStat(value.stats.aramTenacity),
    }
  }

  return result
}

export function challengeFromCompletedIds(
  raw: RawChallenge,
  allChamps: Champion[],
  mode: GameMode,
  category: ChallengeCategory,
  challengeId: string
): Challenge {
  const totalDone = raw.completedIds.length
  const total = allChamps.length
  
  return {
    id: challengeId,
    name: raw.name,
    description: raw.description,
    category,
    champions: allChamps.map((c) => ({
      ...c,
      done: raw.completedIds.includes(c.id),
    })),
    totalDone,
    mode,
    progress: {
      current: totalDone,
      total,
      percentage: Math.round((totalDone / total) * 100),
    },
    currentTier: calculateChallengeTier(totalDone, total),
  }
}

export function calculateChallengeTier(
  completedCount: number,
  total: number
): ChallengeTier {
  const percent = (completedCount / total) * 100

  if (percent === 0) return "UNRANKED"
  if (percent < 10) return "IRON"
  if (percent < 25) return "BRONZE"
  if (percent < 40) return "SILVER"
  if (percent < 60) return "GOLD"
  if (percent < 75) return "PLATINUM"
  if (percent < 90) return "DIAMOND"
  return "MASTER"
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    UNRANKED: "#4A4A4A",
    IRON: "#6C6C6C",
    BRONZE: "#8B4513",
    SILVER: "#C0C0C0",
    GOLD: "#FFD700",
    PLATINUM: "#2ECC71",
    DIAMOND: "#3498DB",
    MASTER: "#9B59B6",
    GRANDMASTER: "#E74C3C",
    CHALLENGER: "#F39C12",
  }
  return colors[tier] || colors.UNRANKED
}
