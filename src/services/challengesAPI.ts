/**
 * Challenges API Service
 * League of Legends challenges from Community Dragon
 */

import { cache } from "./cache"

const CD_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1"

export interface ChallengeData {
  id: number
  name: string
  description: string
  shortDescription: string
  iconPath: string
  category: string // "VETERANCY", "TEAMWORK", etc.
  levelToIconPath: Record<string, string>
}

/**
 * Fetch all challenges from Community Dragon
 */
export async function fetchAllChallenges(): Promise<ChallengeData[]> {
  return cache.get("challenges-all", async () => {
    const res = await fetch(`${CD_BASE}/challenges.json`)
    if (!res.ok) {
      throw new Error("Failed to load challenges data")
    }
    const data = await res.json()
    // Transform object to array if needed, CDragon usually returns explicit array or object map.
    // CDragon challenges.json is usually an object keyed by ID.
    // Let's verify structure or assume array of values.
    return Object.values(data) as ChallengeData[]
  })
}

/**
 * Get challenge icon URL
 */
export function getChallengeIcon(iconPath: string): string {
    if (!iconPath) return ""
    return `https://raw.communitydragon.org/latest${iconPath.toLowerCase()}`
}

/**
 * Filter challenges
 */
export function filterChallenges(
    challenges: ChallengeData[],
    filters: {
        search?: string
        category?: string
    }
): ChallengeData[] {
    let result = challenges.filter(c => c.name) // valid only

    if (filters.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.description?.toLowerCase().includes(q) ||
            c.shortDescription?.toLowerCase().includes(q)
        )
    }
    
    // Note: Category filtering might need inspection of data values (veterancy vs collection etc)
    
    return result
}

export default {
    fetchAllChallenges,
    getChallengeIcon,
    filterChallenges
}
