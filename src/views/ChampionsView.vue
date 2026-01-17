<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { fetchAllChampions, fetchChampionDetails, type ChampionData, type ChampionDetails } from "../services/championsAPI"
import ChampionCard from "../components/champions/ChampionCard.vue"
import HextechLoader from "../components/common/HextechLoader.vue"
import ChampionDetailModal from "../components/champions/ChampionDetailModal.vue"

const champions = ref<ChampionData[]>([])
const isLoading = ref(true)
const selectedRole = ref("all")
const searchQuery = ref("")

import { useRoute } from "vue-router"

const route = useRoute()

// Modal State
const showModal = ref(false)
const selectedChampion = ref<ChampionDetails | null>(null)

onMounted(async () => {
  try {
    champions.value = await fetchAllChampions()
    
    // Check for deep link
    const openId = route.query.open as string
    if (openId) {
       // Find champion object to ensure it exists before opening
       const champ = champions.value.find(c => c.id === openId)
       if (champ) {
          handleSelectChampion(champ)
       }
    }
  } catch (error) {
    console.error("Failed to load champions:", error)
  } finally {
    isLoading.value = false
  }
})

const roles = ["all", "Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank"]

const filteredChampions = computed(() => {
  let result = champions.value

  // Filter by role
  if (selectedRole.value !== "all") {
    result = result.filter((c) => c.tags.includes(selectedRole.value))
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query)
    )
  }

  return result
})

const handleSelectChampion = async (champion: ChampionData) => {
  showModal.value = true
  selectedChampion.value = null // Reset to show loading state in modal

  // Update URL without reloading to reflect current state (optional but good for sharing)
  // router.replace({ query: { open: champion.id } })

  try {
    selectedChampion.value = await fetchChampionDetails(champion.id)
  } catch (error) {
    console.error("Failed to fetch champion details:", error)
    // TODO: Show error notification
  }
}
</script>

<template>
  <div class="champions-view">
    <div class="view-header">
      <h1>Champions</h1>
      <p class="view-subtitle">Browse all {{ champions.length }} League of Legends champions</p>
    </div>

    <HextechLoader v-if="isLoading" message="Summoning Champions..." />

    <div v-else class="champions-content">
      <!-- Search & Filters -->
      <div class="controls">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search champions..."
            class="search-input"
          />
        </div>

        <div class="filters">
          <button
            v-for="role in roles"
            :key="role"
            :class="['filter-chip', { active: selectedRole === role }]"
            @click="selectedRole = role"
          >
            {{ role === "all" ? "All Roles" : role }}
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-info">
        <p>{{ filteredChampions.length }} champions found</p>
      </div>

      <!-- Champion Grid -->
      <div v-if="filteredChampions.length > 0" class="champions-grid">
        <ChampionCard
          v-for="champ in filteredChampions"
          :key="champ.id"
          :champion="champ"
          @select="handleSelectChampion"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h2>No champions found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    </div>


    <!-- Details Modal -->
    <ChampionDetailModal
      :visible="showModal"
      :champion="selectedChampion"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.champions-view {
  padding: var(--spacing-xl);
}

.view-header {
  margin-bottom: var(--spacing-xl);
}

.view-header h1 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 2.5rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: var(--spacing-sm);
}

.view-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.champions-content {
  animation: fadeIn 0.5s ease-out;
}

.controls {
  margin-bottom: var(--spacing-xl);
}

.search-wrapper {
  margin-bottom: var(--spacing-lg);
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: "Spiegel", sans-serif;
  transition: all var(--transition-base);
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(28, 35, 51, 0.8);
  box-shadow: 0 0 0 4px rgba(200, 155, 60, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-chip:hover {
  border-color: var(--primary);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.filter-chip.active {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  border-color: var(--primary);
  color: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.results-info {
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.champions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  animation: fadeIn 0.5s ease-out;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--text-muted);
}

.empty-state h2 {
  color: var(--text-secondary);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .champions-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .filters {
    flex-direction: column;
  }

  .filter-chip {
    width: 100%;
    justify-content: center;
  }
}
</style>
