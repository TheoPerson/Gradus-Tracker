<script setup lang="ts">
import { onMounted, ref, computed } from "vue"

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faGear } from "@fortawesome/free-solid-svg-icons"

import { StoredSettings } from "./types/app"
import { parseMerakiFile } from "./helpers/utils"

// Components
import Settings from "./components/Settings.vue"
import TabNavigation from "./components/navigation/TabNavigation.vue"

// Views are now handled by Router

// Static data for web version (no LCU integration)
// Note: These might need to be moved to a store if shared across views extensively
// For now, views manage their own data or use services/cache
const stats = ref<any>(null)

onMounted(async () => {
  // Fetch ARAM stats from public API
  await fetchAramStats()
})

const fetchAramStats = async () => {
  try {
    const res = await fetch(
      `https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json`,
      { cache: "no-cache" }
    )
    const parsed = parseMerakiFile(await res.json())
    stats.value = parsed
  } catch (e) {
    console.error("Failed to fetch ARAM stats:", e)
  }
}

const isColoredWhenDone = ref(false)
const showChampionNames = ref(false)

const updateSettings = (settings: StoredSettings) => {
  isColoredWhenDone.value = settings.isColoredWhenDone
  showChampionNames.value = settings.showChampionNames
}

// Settings
const settingsVisible = ref(false)

const onClickSettings = () => {
  settingsVisible.value = !settingsVisible.value
}
</script>

<template>
  <div class="app">
    <!-- Header with Settings -->
    <div class="app-header">
      <div class="app-logo">
        <router-link to="/">
          <h1>GRADUS DB</h1>
        </router-link>
      </div>
      <button class="league-button settings-button" @click="onClickSettings">
        <FontAwesomeIcon :icon="faGear" />
      </button>
    </div>

    <!-- Tab Navigation -->
    <TabNavigation />

    <!-- View Router -->
    <div class="view-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Settings Modal -->
    <Settings
      v-model:visible="settingsVisible"
      :isColoredWhenDone="isColoredWhenDone"
      :showChampionNames="showChampionNames"
      @update:isColoredWhenDone="
        (v) => updateSettings({ isColoredWhenDone: v, showChampionNames })
      "
      @update:showChampionNames="
        (v) => updateSettings({ isColoredWhenDone, showChampionNames: v })
      "
    />
  </div>
</template>

<style>
.app {
  background: transparent;
  position: relative;
  min-height: 100vh;
  color: var(--text-primary);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 2px solid var(--primary-dark);
  background: rgba(28, 35, 51, 0.8);
  backdrop-filter: blur(20px);
}

.app-logo h1 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.75rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.app-logo a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.view-container {
  min-height: calc(100vh - 150px);
}

.app-heading {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  position: relative;
  width: 300px;
}

.tab {
  cursor: pointer;
  padding: 8px;
  border: solid 2px transparent;
}

.tab:hover {
  border-bottom: solid 2px #785a28;
  border-right: solid 2px #785a28;
}

.tab.selected {
  border-bottom: solid 2px #785a28;
  border-right: solid 2px #785a28;
}

.challenges > * {
  margin-bottom: 32px;
}

button.settings-button {
  font-size: 16px;
  height: 40px;
  width: 40px;
  padding: 10px;
  border-radius: 50%;
}
</style>
