/**
 * Skins API Service
 * Manages League of Legends skin data
 */

import { cache } from "./cache"

export interface Skin {
  id: number
  num: number
  name: string
  champion: string
  championId: number // Added for image fetching
  chromas: boolean
  price: number | string
  release_date: string
  sale: boolean
  distribution: string
  set: string[]
  region: string[]
  splash_image: string
  rarity?: string
}

/**
 * Fetch all skins from static data
 */
export async function fetchAllSkins(): Promise<Skin[]> {
  return cache.get("skins-all", async () => {
    const res = await fetch("/data/skins_all.json")
    if (!res.ok) {
      throw new Error("Failed to load skins data")
    }
    const rawData = await res.json()
    
    // Map raw data to Skin interface
    return rawData.map((item: any) => ({
      id: parseInt(item.skin_id),
      num: item.skin_num,
      name: item.skin_name,
      champion: item.champion,
      championId: parseInt(item.champion_id), // CRITICAL FIX: Need champ ID for images, not Skin ID
      chromas: item.chromas,
      price: item.price,
      release_date: item.release_date,
      sale: false, 
      distribution: item.isPrestige ? "Prestige" : (item.isEsports ? "Esports" : "Standard"),
      set: [],
      region: [],
      splash_image: item.splashPath,
      rarity: item.rarity
    }))
  })
}

/**
 * Get skin splash art URL from Community Dragon
 */
export function getSkinSplashArt(championId: number, skinNum: number): string {
  return `https://cdn.communitydragon.org/latest/champion/${championId}/splash-art/skin/${skinNum}`
}

/**
 * Get skin tile/card image
 */
export function getSkinTile(championId: number, skinNum: number): string {
  return `https://cdn.communitydragon.org/latest/champion/${championId}/tile/skin/${skinNum}`
}

/**
 * Filter skins by various criteria
 */
export function filterSkins(
  skins: Skin[],
  filters: {
    search?: string
    prestige?: boolean
    esports?: boolean
    chromas?: boolean
    priceMin?: number
    priceMax?: number
  }
): Skin[] {
  let result = skins

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.champion.toLowerCase().includes(query)
    )
  }

  if (filters.prestige) {
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes("prestige") ||
        s.distribution === "Prestige"
    )
  }

  if (filters.esports) {
    result = result.filter(
      (s) =>
        s.distribution === "Esports" ||
        s.name.includes("Championship") ||
        s.name.includes("Worlds")
    )
  }

  if (filters.chromas !== undefined) {
    result = result.filter((s) => s.chromas === filters.chromas)
  }

  if (filters.priceMin !== undefined) {
    result = result.filter((s) => {
      const price = typeof s.price === "number" ? s.price : 0
      return price >= filters.priceMin!
    })
  }

  if (filters.priceMax !== undefined) {
    result = result.filter((s) => {
      const price = typeof s.price === "number" ? s.price : 0
      return price <= filters.priceMax!
    })
  }

  return result
}

/**
 * Sort skins
 */
export function sortSkins(
  skins: Skin[],
  sortBy: "name" | "date" | "price"
): Skin[] {
  const sorted = [...skins]

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "date":
      sorted.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
      )
      break
    case "price":
      sorted.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : 0
        const priceB = typeof b.price === "number" ? b.price : 0
        return priceB - priceA
      })
      break
  }

  return sorted
}

export default {
  fetchAllSkins,
  getSkinSplashArt,
  getSkinTile,
  filterSkins,
  sortSkins,
}
