// Simple in-memory cache for API responses

class DataCache {
  private cache: Map<string, { data: any; timestamp: number }>

  constructor() {
    this.cache = new Map()
  }

  /**
   * Get cached data or fetch it
   * @param key Cache key
   * @param fetcher Function to fetch data if not cached
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.cache.get(key)

    // Check if cache exists and is still valid
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log(`[Cache HIT] ${key}`)
      return cached.data as T
    }

    // Fetch fresh data
    console.log(`[Cache MISS] ${key}`)
    const data = await fetcher()

    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })

    return data
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear()
    console.log("[Cache] Cleared all entries")
  }

  /**
   * Remove specific key from cache
   */
  remove(key: string) {
    this.cache.delete(key)
    console.log(`[Cache] Removed ${key}`)
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }
}

// Export singleton instance
export const cache = new DataCache()

export default cache
