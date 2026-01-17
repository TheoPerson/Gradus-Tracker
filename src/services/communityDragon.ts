import { getCurrentPatch } from "./versionService"

// Community Dragon API Client
// Official CDN: https://www.communitydragon.org/

const CD_BASE = "https://cdn.communitydragon.org"
const PATCH = "latest" // Can be specific like '14.1'

export const CDN_ENDPOINTS = {
  // Champions
  championSquare: (id: number) => `${CD_BASE}/${PATCH}/champion/${id}/square`,
  championData: (id: number) => `${CD_BASE}/${PATCH}/champion/${id}/data`,
  championSplash: (champId: number, skinId: number) =>
    `${CD_BASE}/${PATCH}/champion/${champId}/splash-art/skin/${skinId}`,
  championSplashCentered: (champId: number, skinId: number) =>
    `${CD_BASE}/${PATCH}/champion/${champId}/splash-art/centered/skin/${skinId}`,
  championTile: (champId: number, skinId: number) =>
    `${CD_BASE}/${PATCH}/champion/${champId}/tile/skin/${skinId}`,
  championPortrait: (champId: number, skinId: number) =>
    `${CD_BASE}/${PATCH}/champion/${champId}/portrait/skin/${skinId}`,

  // Abilities
  abilityIcon: (champId: number, slot: "p" | "q" | "w" | "e" | "r") =>
    `${CD_BASE}/${PATCH}/champion/${champId}/ability-icon/${slot}`,

  // Ward Skins
  wardIcon: (wardId: number) => `${CD_BASE}/${PATCH}/ward/${wardId}`,
  wardShadow: (wardId: number) => `${CD_BASE}/${PATCH}/ward/${wardId}/shadow`,

  // Profile Icons
  profileIcon: (iconId: number) =>
    `${CD_BASE}/${PATCH}/profile-icon/${iconId}`,

  // Honor
  honorIcon: (honorId: number, level: number) =>
    `${CD_BASE}/${PATCH}/honor/${honorId}/level/${level}`,
  honorEmblem: (honorId: number, level: number) =>
    `${CD_BASE}/${PATCH}/honor/emblem/${honorId}/level/${level}`,
}

/**
 * Fetch champion data from Community Dragon
 */
export async function fetchChampionData(championId: number) {
  const url = CDN_ENDPOINTS.championData(championId)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch champion ${championId}: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Fetch all champions list
 * Note: This is a simplified version. For production, you'd want to fetch
 * the full champion roster from DDragon or maintain a static list
 */
export async function fetchAllChampions() {
  // Use dynamic version instead of hardcoded
  const version = getCurrentPatch()
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  )
  const data = await response.json()
  return Object.values(data.data)
}

/**
 * Fetch skin data (similar to what Rareness uses)
 */
export async function fetchSkinData() {
  // This would be the skins_all.json equivalent
  // We'll implement this when we add the Skins section
  return []
}

/**
 * Get rune icon URL
 */
export function getRuneIcon(iconPath: string): string {
  // Community Dragon paths usually start with /lol-game-data/assets/
  // We need to strip that or handle it.
  // Actually, usually we just append to raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1
  // But let's check how other icons are handled.
  
  // Looking at previous patterns, simple append to latest is common for some assets.
  // For runes specifically, let's try the common pattern.
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${iconPath}`
}

export default {
  CDN_ENDPOINTS,
  fetchChampionData,
  fetchAllChampions,
  fetchSkinData,
  getRuneIcon,
}
