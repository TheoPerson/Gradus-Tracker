/**
 * Items API Service
 * League of Legends items from Data Dragon
 */

import { cache } from "./cache"
import { getLatestVersion } from "./versionService"

// Helper to get base URL dynamically
const getDDragonBase = async () => {
  const version = await getLatestVersion()
  return `https://ddragon.leagueoflegends.com/cdn/${version}`
}

export interface ItemData {
  name: string
  description: string
  plaintext: string
  gold: {
    base: number
    total: number
    sell: number
    purchasable: boolean
  }
  tags: string[] // ["Damage", "CriticalStrike", "AttackSpeed"]
  maps: Record<string, boolean>
  stats: Record<string, number> // { FlatPhysicalDamageMod: 55, etc }
  depth?: number // Build depth (1 = basic, 2 = advanced, 3 = legendary, 4 = mythic)
  into?: string[] // IDs of items this builds into
  from?: string[] // IDs of items this builds from
  image: {
    full: string
  }
}

/**
 * Fetch all items from Data Dragon
 */
export async function fetchAllItems(): Promise<Record<string, ItemData>> {
  return cache.get("items-all", async () => {
    const baseUrl = await getDDragonBase()
    const res = await fetch(`${baseUrl}/data/en_US/item.json`)
    if (!res.ok) throw new Error("Failed to fetch items")
    const data = await res.json()
    return data.data as Record<string, ItemData>
  })
}

/**
 * Get item icon URL
 */
export function getItemIcon(itemImageName: string): string {
    // Note: DDragon requires version for images.
    // If we need sync function, we must use CDragon or specific version assumption.
    // CDragon is safer for sync usage.
  return `https://raw.communitydragon.org/latest/game/assets/items/icons2d/${itemImageName.toLowerCase()}`
}

/**
 * Filter items by criteria
 */
export function filterItems(
  items: Array<[string, ItemData]>,
  filters: {
    search?: string
    tags?: string[]
    priceMin?: number
    priceMax?: number
    purchasableOnly?: boolean
  }
): Array<[string, ItemData]> {
  let result = items

  if (filters.search) {
    const query = filters.search.toLowerCase()
    result = result.filter(
      ([_, item]) =>
        item.name.toLowerCase().includes(query) ||
        item.plaintext?.toLowerCase().includes(query)
    )
  }

  if (filters.tags && filters.tags.length > 0) {
    result = result.filter(([_, item]) =>
      filters.tags!.some((tag) => item.tags?.includes(tag))
    )
  }

  if (filters.priceMin !== undefined) {
    result = result.filter(([_, item]) => item.gold.total >= filters.priceMin!)
  }

  if (filters.priceMax !== undefined) {
    result = result.filter(([_, item]) => item.gold.total <= filters.priceMax!)
  }

  if (filters.purchasableOnly) {
    result = result.filter(([_, item]) => item.gold.purchasable)
  }

  return result
}

/**
 * Sort items
 */
export function sortItems(
  items: Array<[string, ItemData]>,
  sortBy: "name" | "price" | "popular"
): Array<[string, ItemData]> {
  const sorted = [...items]

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) => a[1].name.localeCompare(b[1].name))
      break
    case "price":
      sorted.sort((a, b) => b[1].gold.total - a[1].gold.total)
      break
    case "popular":
      // Keep default order (most popular items first in Data Dragon)
      break
  }

  return sorted
}

/**
 * Get item type/tier
 */
export function getItemTier(item: ItemData): string {
  const name = item.name.toLowerCase()
  
  if (name.includes("mythic") || item.description?.includes("Mythic Passive")) {
    return "Mythic"
  }
  
  if (item.gold.total >= 3000) {
    return "Legendary"
  }
  
  if (item.gold.total >= 1000) {
    return "Epic"
  }
  
  if (item.tags?.includes("Boots")) {
    return "Boots"
  }
  
  if (item.gold.total < 500) {
    return "Basic"
  }
  
  return "Component"
}

export default {
  fetchAllItems,
  getItemIcon,
  filterItems,
  sortItems,
  getItemTier,
}
