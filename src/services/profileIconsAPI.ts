/**
 * Profile Icons API Service
 * League of Legends summoner profile icons from Data Dragon
 */

import { cache } from "./cache"
import { getLatestVersion } from "./versionService"

// Helper to get base URL dynamically
const getDDragonBase = async () => {
  const version = await getLatestVersion()
  return `https://ddragon.leagueoflegends.com/cdn/${version}`
}

export interface ProfileIconData {
  id: string
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
 * Fetch all profile icons from Data Dragon
 */
export async function fetchAllProfileIcons(): Promise<
  Record<string, ProfileIconData>
> {
  return cache.get("profileicons-all", async () => {
    const baseUrl = await getDDragonBase()
    const res = await fetch(
      `${baseUrl}/data/en_US/profileicon.json`
    )
    if (!res.ok) {
      throw new Error("Failed to load profile icons data")
    }
    const json = await res.json()
    return json.data
  })
}

/**
 * Get profile icon URL
 */
export function getProfileIconUrl(iconId: string): string {
  // Use CDragon for sync URL generation without needing async version fetch
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
}

/**
 * Filter profile icons
 */
export function filterProfileIcons(
  icons: Array<[string, ProfileIconData]>,
  filters: {
    search?: string
    idMin?: number
    idMax?: number
  }
): Array<[string, ProfileIconData]> {
  let result = icons

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(([id]) => id.includes(query))
  }

  if (filters.idMin !== undefined) {
    result = result.filter(([id]) => parseInt(id) >= filters.idMin!)
  }

  if (filters.idMax !== undefined) {
    result = result.filter(([id]) => parseInt(id) <= filters.idMax!)
  }

  return result
}

/**
 * Sort profile icons
 */
export function sortProfileIcons(
  icons: Array<[string, ProfileIconData]>,
  sortBy: "id-asc" | "id-desc"
): Array<[string, ProfileIconData]> {
  const sorted = [...icons]

  sorted.sort(([idA], [idB]) => {
    const numA = parseInt(idA)
    const numB = parseInt(idB)
    return sortBy === "id-asc" ? numA - numB : numB - numA
  })

  return sorted
}

export default {
  fetchAllProfileIcons,
  getProfileIconUrl,
  filterProfileIcons,
  sortProfileIcons,
}
