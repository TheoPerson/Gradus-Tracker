/**
 * Data Dragon Version Service
 * Fetches and caches the latest League of Legends patch version
 * CRITICAL: Always use this instead of hardcoding versions
 */

import { cache } from "./cache"

const DD_VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json"

/**
 * Fetch the latest Data Dragon version dynamically
 * This ensures we always use the current patch
 */
export async function getLatestVersion(): Promise<string> {
  return cache.get("ddragon-version", async () => {
    try {
      const res = await fetch(DD_VERSIONS_URL)
      if (!res.ok) {
        throw new Error("Failed to fetch versions")
      }
      const versions: string[] = await res.json()
      // First item is always the latest patch
      return versions[0]
    } catch (error) {
      console.error("Failed to fetch latest DDragon version:", error)
      // Fallback to known current version (Season 2026, Patch 1)
      return "26.1.1"
    }
  }, 3600000) // Cache for 1 hour
}

/**
 * Get Data Dragon base URL with latest version
 */
export async function getDataDragonUrl(path: string): Promise<string> {
  const version = await getLatestVersion()
  return `https://ddragon.leagueoflegends.com/cdn/${version}${path}`
}

/**
 * Get current patch version (non-async, uses fallback)
 * Use this only when you need synchronous access
 */
export function getCurrentPatch(): string {
  return "26.1.1" // Updated for Season 2026
}
