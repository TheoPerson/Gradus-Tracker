/**
 * Emotes API Service
 * League of Legends emotes from Community Dragon
 */

import { cache } from "./cache"

const CD_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1"

export interface EmoteData {
  id: number
  contentId: string
  name: string
  inventoryIcon: string
  taggedChampionsIds: number[]
  description: string
}

/**
 * Fetch all emotes from Community Dragon
 */
export async function fetchAllEmotes(): Promise<EmoteData[]> {
  return cache.get("emotes-all", async () => {
    const res = await fetch(`${CD_BASE}/summoner-emotes.json`)
    if (!res.ok) {
      throw new Error("Failed to load emotes data")
    }
    return res.json()
  })
}

/**
 * Get emote icon URL
 */
export function getEmoteIcon(iconPath: string): string {
  if (!iconPath) return ""
  return `https://raw.communitydragon.org/latest${iconPath.toLowerCase()}`
}

/**
 * Filter emotes
 */
export function filterEmotes(
  emotes: EmoteData[],
  filters: {
    search?: string
    championId?: number
  }
): EmoteData[] {
  let result = emotes.filter((e) => e.name && e.inventoryIcon) // Filter out empty entries

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
    )
  }

  if (filters.championId) {
    result = result.filter((e) =>
      e.taggedChampionsIds?.includes(filters.championId!)
    )
  }

  return result
}

export default {
  fetchAllEmotes,
  getEmoteIcon,
  filterEmotes,
}
