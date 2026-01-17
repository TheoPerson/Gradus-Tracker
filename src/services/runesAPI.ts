/**
 * Runes API Service
 * League of Legends runes (perks) from Community Dragon
 */

import { cache } from "./cache"

const CD_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1"

export interface RuneData {
  id: number
  name: string
  majorChangePatchVersion: string
  tooltip: string
  shortDesc: string
  longDesc: string
  recommendationDescriptor: string
  iconPath: string
  endOfGameStatDescs: string[]
}

/**
 * Fetch all runes from Community Dragon
 */
export async function fetchAllRunes(): Promise<RuneData[]> {
  return cache.get("runes-all", async () => {
    const res = await fetch(`${CD_BASE}/perks.json`)
    if (!res.ok) {
      throw new Error("Failed to load runes data")
    }
    return res.json()
  })
}

/**
 * Get rune icon URL
 */
export function getRuneIcon(iconPath: string): string {
  return `https://raw.communitydragon.org/latest${iconPath.toLowerCase()}`
}

/**
 * Filter runes
 */
export function filterRunes(
  runes: RuneData[],
  filters: {
    search?: string
    isKeystone?: boolean
  }
): RuneData[] {
  let result = runes

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.shortDesc.toLowerCase().includes(query)
    )
  }

  // Keystones typically have lower IDs (8000-8400 range)
  if (filters.isKeystone !== undefined) {
    if (filters.isKeystone) {
      result = result.filter((r) => r.id >= 8000 && r.id < 8500)
    }
  }

  return result
}

export default {
  fetchAllRunes,
  getRuneIcon,
  filterRunes,
}
