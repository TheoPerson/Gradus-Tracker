<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { getLatestVersion } from "../services/versionService"
import { cache } from "../services/cache"

const version = ref("Checking...")
const cacheSize = ref(0)
const cacheEntries = ref(0)
const apiLatency = ref<number | null>(null)
const uptime = ref(0)
const startTime = Date.now()
const activeRequests = ref(0)
const recentLogs = ref<{ time: string; msg: string; type: 'info' | 'error' | 'warn' }[]>([])

// Simulate Log
const addLog = (msg: string, type: 'info' | 'error' | 'warn' = 'info') => {
  recentLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    msg,
    type
  })
  if (recentLogs.value.length > 50) recentLogs.value.pop()
}

onMounted(async () => {
  // Update uptime
  setInterval(() => {
    uptime.value = Math.floor((Date.now() - startTime) / 1000)
  }, 1000)

  // Fetch Version
  try {
    activeRequests.value++
    const v = await getLatestVersion()
    version.value = v
    addLog(`Version validated: ${v}`, 'info')
  } catch (e) {
    addLog("Failed to check version", "error")
  } finally {
    activeRequests.value--
  }

  // Check Latency
  checkLatency()

  // Monitor Cache
  updateCacheStats()
})

const checkLatency = async () => {
  activeRequests.value++
  const start = performance.now()
  try {
    await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`, { method: 'HEAD' })
    apiLatency.value = Math.round(performance.now() - start)
    addLog(`Latency check: ${apiLatency.value}ms`)
  } catch (e) {
    apiLatency.value = -1
    addLog("Latency check failed", "error")
  } finally {
    activeRequests.value--
  }
}

const updateCacheStats = () => {
    // We can't easily get localStorage size directly across all keys efficiently without iteration, 
    // but assuming our cache service uses localStorage:
    let total = 0
    let count = 0
    for(let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length
            count++
        }
    }
    cacheSize.value = parseFloat((total / 1024).toFixed(2)) // KB
    cacheEntries.value = count
}

const clearCache = () => {
    cache.clear()
    localStorage.clear()
    updateCacheStats()
    addLog("System Cache Cleared", "warn")
}

const formattedUptime = computed(() => {
    const h = Math.floor(uptime.value / 3600)
    const m = Math.floor((uptime.value % 3600) / 60)
    const s = uptime.value % 60
    return `${h}h ${m}m ${s}s`
})
</script>

<template>
  <div class="tech-dashboard">
    <div class="dashboard-header">
      <h1>🛠️ Tech Monitor</h1>
      <p>System Status & Diagnostics</p>
    </div>

    <div class="metrics-grid">
      <!-- System Status -->
      <div class="metric-card status-card">
        <div class="metric-icon">🟢</div>
        <div class="metric-info">
            <h3>System Status</h3>
            <p class="status-text">Operational</p>
        </div>
      </div>

       <!-- Version -->
      <div class="metric-card">
        <div class="metric-icon">📦</div>
        <div class="metric-info">
            <h3>Patch Version</h3>
            <p>{{ version }}</p>
        </div>
      </div>

       <!-- API Latency -->
      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-info">
            <h3>API Latency</h3>
            <p :class="{ 'high-latency': (apiLatency || 0) > 200 }">
                {{ apiLatency !== null ? `${apiLatency}ms` : 'Checking...' }}
            </p>
        </div>
      </div>
      
       <!-- Session Uptime -->
      <div class="metric-card">
        <div class="metric-icon">⏱️</div>
        <div class="metric-info">
            <h3>Session Uptime</h3>
            <p>{{ formattedUptime }}</p>
        </div>
      </div>

      <!-- Cache Stats -->
      <div class="metric-card">
        <div class="metric-icon">💾</div>
        <div class="metric-info">
            <h3>Local Cache</h3>
            <p>{{ cacheEntries }} Items ({{ cacheSize }} KB)</p>
        </div>
        <button class="action-btn" @click="clearCache">Clear</button>
      </div>

      <!-- Active Requests -->
      <div class="metric-card">
        <div class="metric-icon">📡</div>
        <div class="metric-info">
            <h3>Active Requests</h3>
            <p>{{ activeRequests }}</p>
        </div>
      </div>
    </div>

    <div class="logs-section">
        <h2>📜 System Logs</h2>
        <div class="terminal-logs">
            <div 
                v-for="(log, i) in recentLogs" 
                :key="i" 
                class="log-line"
                :class="log.type"
            >
                <span class="log-time">[{{ log.time }}]</span>
                <span class="log-msg">{{ log.msg }}</span>
            </div>
            <div v-if="recentLogs.length === 0" class="log-line info">
                Waiting for system events...
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.tech-dashboard {
  padding: var(--spacing-2xl);
  color: var(--text-primary);
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.dashboard-header h1 {
  font-family: "BeaufortforLOL Bold", serif;
  color: var(--primary);
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
}

.metric-card {
    background: rgba(28, 35, 51, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(200, 155, 60, 0.2);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    transition: all var(--transition-base);
}

.metric-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.metric-icon {
    font-size: 2rem;
    background: rgba(0,0,0,0.2);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.metric-info h3 {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.metric-info p {
    font-family: "BeaufortforLOL Bold", serif;
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0;
}

.high-latency {
    color: var(--accent-red);
}

.status-text {
    color: #0ac8b9;
    text-shadow: 0 0 10px rgba(10, 200, 185, 0.4);
}

.action-btn {
    margin-left: auto;
    background: rgba(232, 64, 87, 0.1);
    color: var(--accent-red);
    border: 1px solid var(--accent-red);
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.8rem;
}

.action-btn:hover {
    background: var(--accent-red);
    color: white;
}

.logs-section {
    background: #0a0e1b;
    border: 1px solid var(--primary-dark);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.logs-section h2 {
    background: rgba(28, 35, 51, 0.8);
    padding: var(--spacing-md) var(--spacing-lg);
    margin: 0;
    font-size: 1.1rem;
    border-bottom: 1px solid var(--primary-dark);
}

.terminal-logs {
    padding: var(--spacing-md);
    height: 300px;
    overflow-y: auto;
    font-family: 'Consolas', monospace;
    font-size: 0.9rem;
}

.log-line {
    padding: 4px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.log-time {
    color: var(--text-muted);
    margin-right: 12px;
}

.log-line.error .log-msg { color: var(--accent-red); }
.log-line.warn .log-msg { color: var(--brand-gold); }
.log-line.info .log-msg { color: var(--text-primary); }

</style>
