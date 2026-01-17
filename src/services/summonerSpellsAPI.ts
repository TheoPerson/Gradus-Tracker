/**
 * Summoner Spells API Service
 * League of Legends summoner spells from Data Dragon
 */

import { cache } from "./cache"
import { getLatestVersion, getCurrentPatch } from "./versionService"

const DD_BASE = "https://ddragon.leagueoflegends.com/cdn"
const DD_VERSION = getCurrentPatch() // Dynamic version (26.1.1+)

export interface SummonerSpellData {
  id: string
  name: string
  description: string
  tooltip: string
  maxrank: number
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  key: string
  summonerLevel: number
  modes: string[]
  costType: string
  maxammo: string
  range: number[]
  rangeBurn: string
  image: {
    full: string
    sprite: string
    group: string
    x: number
    y: number
    w: number
    h: number
  }
}

/**
 * Fetch all summoner spells from Data Dragon
 */
export async function fetchAllSummonerSpells(): Promise<
  Record<string, SummonerSpellData>
> {
  return cache.get("summoner-spells-all", async () => {
    const version = await getLatestVersion()
    const res = await fetch(
      `${DD_BASE}/${version}/data/en_US/summoner.json`
    )
    if (!res.ok) {
      throw new Error("Failed to load summoner spells data")
    }
    const json = await res.json()
    return json.data
  })
}

/**
 * Get summoner spell icon URL
 */
export function getSummonerSpellIcon(imageName: string): string {
  return `${DD_BASE}/${DD_VERSION}/img/spell/${imageName}`
}

/**
 * Filter summoner spells
 */
export function filterSummonerSpells(
  spells: Array<[string, SummonerSpellData]>,
  filters: {
    search?: string
    modesFilter?: string
  }
): Array<[string, SummonerSpellData]> {
  let result = spells

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      ([_, spell]) =>
        spell.name.toLowerCase().includes(query) ||
        spell.description.toLowerCase().includes(query)
    )
  }

  if (filters.modesFilter) {
    result = result.filter(([_, spell]) =>
      spell.modes?.includes(filters.modesFilter!)
    )
  }

  return result
}

/**
 * Sort summoner spells
 */
export function sortSummonerSpells(
  spells: Array<[string, SummonerSpellData]>,
  sortBy: "name" | "cooldown" | "level"
): Array<[string, SummonerSpellData]> {
  const sorted = [...spells]

  switch (sortBy) {
    case "name":
      sorted.sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
      break
    case "cooldown":
      sorted.sort(([_, a], [__, b]) => {
        const cdA = a.cooldown?.[0] ?? 0
        const cdB = b.cooldown?.[0] ?? 0
        return cdA - cdB
      })
      break
    case "level":
      sorted.sort(([_, a], [__, b]) => a.summonerLevel - b.summonerLevel)
      break
  }

  return sorted
}

export default {
  fetchAllSummonerSpells,
  getSummonerSpellIcon,
  filterSummonerSpells,
  sortSummonerSpells,
}
