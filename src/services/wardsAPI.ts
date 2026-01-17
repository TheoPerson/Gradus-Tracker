/**
 * Ward Skins API Service
 * League of Legends ward skins from Community Dragon
 */

import { cache } from "./cache"

const CD_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1"

export interface WardSkinData {
  id: number
  name: string
  description: string
  wardImagePath: string
  wardShadowImagePath: string
}

/**
 * Fetch all ward skins from Community Dragon
 */
export async function fetchAllWardSkins(): Promise<WardSkinData[]> {
  return cache.get("wardskins-all", async () => {
    const res = await fetch(`${CD_BASE}/ward-skins.json`)
    if (!res.ok) {
      throw new Error("Failed to load ward skins data")
    }
    return res.json()
  })
}

/**
 * Get ward skin image URL
 */
export function getWardSkinImage(imagePath: string): string {
  if (!imagePath) return ""
  return `https://raw.communitydragon.org/latest${imagePath.toLowerCase()}`
}

/**
 * Filter ward skins
 */
export function filterWardSkins(
  wards: WardSkinData[],
  filters: {
    search?: string
  }
): WardSkinData[] {
  let result = wards.filter((w) => w.name && w.wardImagePath) // Filter out empty entries

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query)
    )
  }

  return result
}

/**
 * Sort ward skins
 */
export function sortWardSkins(
  wards: WardSkinData[],
  sortBy: "name" | "id"
): WardSkinData[] {
  const sorted = [...wards]

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "id":
      sorted.sort((a, b) => b.id - a.id)
      break
  }

  return sorted
}

export default {
  fetchAllWardSkins,
  getWardSkinImage,
  filterWardSkins,
  sortWardSkins,
}
