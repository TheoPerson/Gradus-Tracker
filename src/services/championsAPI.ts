import { cache } from "./cache"
import { getLatestVersion } from "./versionService"

// Helper to get base URL dynamically
const getDDragonBase = async () => {
  const version = await getLatestVersion()
  return `https://ddragon.leagueoflegends.com/cdn/${version}`
}

export interface ChampionData {
  id: string
  key: string
  name: string
  title: string
  blurb: string
  tags: string[]
  partype: string
  stats: {
    hp: number
    hpperlevel: number
    mp: number
    mpperlevel: number
    movespeed: number
    armor: number
    armorperlevel: number
    spellblock: number
    spellblockperlevel: number
    attackrange: number
    hpregen: number
    hpregenperlevel: number
    mpregen: number
    mpregenperlevel: number
    crit: number
    critperlevel: number
    attackdamage: number
    attackdamageperlevel: number
    attackspeedperlevel: number
    attackspeed: number
  }
}

export interface ChampionDetails extends ChampionData {
  lore: string
  allytips: string[]
  enemytips: string[]
  spells: Array<{
    id: string
    name: string
    description: string
    tooltip: string
    cooldown: number[]
    cost: number[]
    range: number[]
    image: {
      full: string
    }
  }>
  passive: {
    name: string
    description: string
    image: {
      full: string
    }
  }
  skins: Array<{
    id: string
    num: number
    name: string
    chromas: boolean
  }>
}

/**
 * Fetch all champions (summary list)
 */
export async function fetchAllChampions(): Promise<ChampionData[]> {
  return cache.get("champions-list", async () => {
    const baseUrl = await getDDragonBase()
    const res = await fetch(`${baseUrl}/data/en_US/champion.json`)
    if (!res.ok) throw new Error("Failed to fetch champions")
    const data = await res.json()
    return Object.values(data.data) as ChampionData[]
  })
}

/**
 * Fetch latest champions based on a manually curated list of recent releases.
 * This ensures accuracy as ID sorting is unreliable.
 */
export async function fetchLatestChampions(count: number = 4): Promise<ChampionData[]> {
  const all = await fetchAllChampions()
  
  // List of recent champions in order (Newest first)
  // Updated with user provided list
  const LATEST_IDS = [
    "Zaahen",   // 2025
    "Yunara",   // 2025
    "Mel",      // 2025
    "Ambessa",  // 2024
    "Aurora",   // 2024
    "Smolder",  // 2024
    "Hwei",     // 2023
    "Briar",    // 2023
    "Naafiri",  // 2023
    "Milio",    // 2023
  ]

  // Filter champions that exist in the All list and match the latest IDs
  const latest = LATEST_IDS
    .map(id => all.find(c => c.id === id || c.name === id)) // Try finding by ID then Name
    .filter((c): c is ChampionData => !!c) // Remove undefined

  return latest.slice(0, count)
}

/**
 * Fetch detailed champion data
 */
export async function fetchChampionDetails(
  championId: string
): Promise<ChampionDetails> {
  return cache.get(`champion-${championId}`, async () => {
    const baseUrl = await getDDragonBase()
    const res = await fetch(
      `${baseUrl}/data/en_US/champion/${championId}.json`
    )
    if (!res.ok) throw new Error(`Failed to fetch details for ${championId}`)
    const data = await res.json()
    return data.data[championId] as ChampionDetails
  })
}

/**
 * Get champion square icon URL
 */
export function getChampionIcon(championId: string): string {
    // Note: Version independent or we'd need async. 
    // Ideally we use latest known or a fixed fallback if sync is required.
    // For icons, using 'latest' from community dragon is a safe sync alternative 
    // or we can just use the latest fetched version cached in memory if we wanted to be strict.
    // simpler: use cdn with "img" path which often redirects or works.
    // actually, ddragon requires version for images too.
    // We'll use a widely compatible approach or assume a recent version for sync calls
    // OR we can make this returns a URL that doesn't need version if possible?
    // DataDragon always needs version.
    // workaround: use community dragon for sync image urls
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`
}

/**
 * Get champion splash art URL
 */
export function getChampionSplash(championId: string, skinNum: number = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNum}.jpg`
}

/**
 * Get champion loading screen art URL
 */
export function getChampionLoading(championId: string, skinNum: number = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_${skinNum}.jpg`
}

/**
 * Get ability icon URL
 */
export function getAbilityIcon(imageName: string): string {
    // Ability icons are also versioned in DDragon.
    // CDragon is safer for sync usage if we don't want to async fetch version
   return `https://raw.communitydragon.org/latest/game/assets/characters/shared/spells/icons2d/${imageName.toLowerCase()}`
}

/**
 * Get passive icon URL
 */
export function getPassiveIcon(imageName: string): string {
    // Similar to abilities
    return `https://raw.communitydragon.org/latest/game/assets/characters/shared/spells/icons2d/${imageName.toLowerCase()}`
}

export default {
  fetchAllChampions,
  fetchLatestChampions,
  fetchChampionDetails,
  getChampionIcon,
  getChampionSplash,
  getChampionLoading,
  getAbilityIcon,
  getPassiveIcon,
}
