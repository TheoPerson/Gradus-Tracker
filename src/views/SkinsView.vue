<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import {
  fetchAllSkins,
  filterSkins,
  sortSkins,
  type Skin,
} from "../services/skinsAPI"
import SkinCard from "../components/skins/SkinCard.vue"
import HextechLoader from "../components/common/HextechLoader.vue"
import SkinDetailModal from "../components/skins/SkinDetailModal.vue"

const skins = ref<Skin[]>([])
const isLoading = ref(true)
const searchQuery = ref("")
const sortBy = ref<"name" | "date" | "price">("date")

// Modal State
const showModal = ref(false)
const selectedSkin = ref<Skin | null>(null)

// Filters
const showPrestigeOnly = ref(false)
const showEsportsOnly = ref(false)
const showChromasOnly = ref(false)

onMounted(async () => {
  try {
    skins.value = await fetchAllSkins()
  } catch (error) {
    console.error("Failed to load skins:", error)
  } finally {
    isLoading.value = false
  }
})

const filteredAndSortedSkins = computed(() => {
  let result = filterSkins(skins.value, {
    search: searchQuery.value,
    prestige: showPrestigeOnly.value,
    esports: showEsportsOnly.value,
    chromas: showChromasOnly.value ? true : undefined,
  })

  result = sortSkins(result, sortBy.value)

  return result
})

const handleSelectSkin = (skin: Skin) => {
  selectedSkin.value = skin
  showModal.value = true
}

const clearFilters = () => {
  searchQuery.value = ""
  showPrestigeOnly.value = false
  showEsportsOnly.value = false
  showChromasOnly.value = false
  sortBy.value = "date"
}
</script>

<template>
  <div class="skins-view">
    <div class="view-header">
      <h1>Skins</h1>
      <p class="view-subtitle">
        Browse {{ skins.length.toLocaleString() }}+ League of Legends skins
      </p>
    </div>

    <HextechLoader v-if="isLoading" message="Loading Skins..." />

    <div v-else class="skins-content">
      <!-- Search & Filters -->
      <div class="controls">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search skins or champions..."
            class="search-input"
          />
        </div>

        <div class="filters-row">
          <div class="filters-group">
            <h3 class="filters-title">Filters</h3>
            <div class="filters">
              <label class="filter-checkbox">
                <input v-model="showPrestigeOnly" type="checkbox" />
                <span>Prestige Only</span>
              </label>
              <label class="filter-checkbox">
                <input v-model="showEsportsOnly" type="checkbox" />
                <span>Esports Only</span>
              </label>
              <label class="filter-checkbox">
                <input v-model="showChromasOnly" type="checkbox" />
                <span>Has Chromas</span>
              </label>
            </div>
          </div>

          <div class="sort-group">
            <h3 class="filters-title">Sort By</h3>
            <select v-model="sortBy" class="sort-select">
              <option value="date">Release Date</option>
              <option value="name">Name (A-Z)</option>
              <option value="price">Price</option>
            </select>
          </div>

          <button class="clear-button" @click="clearFilters">Clear All</button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-info">
        <p>
          <strong>{{ filteredAndSortedSkins.length.toLocaleString() }}</strong>
          skins found
        </p>
      </div>

      <!-- Skins Grid -->
      <div v-if="filteredAndSortedSkins.length > 0" class="skins-grid">
        <SkinCard
          v-for="skin in filteredAndSortedSkins"
          :key="`${skin.id}-${skin.num}`"
          :skin="skin"
          @select="handleSelectSkin"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h2>No skins found</h2>
        <p>Try adjusting your search or filters</p>
        <button class="cta-button" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <!-- Skin Detail Modal -->
    <SkinDetailModal
      :visible="showModal"
      :skin="selectedSkin"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.skins-view {
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

.skins-content {
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

.filters-row {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
  flex-wrap: wrap;
  padding: var(--spacing-lg);
  background: rgba(28, 35, 51, 0.4);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(240, 230, 210, 0.1);
}

.filters-group {
  flex: 1;
  min-width: 200px;
}

.filters-title {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 0.9rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-sm);
}

.filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color var(--transition-base);
}

.filter-checkbox:hover {
  color: var(--text-primary);
}

.filter-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
}

.sort-group {
  flex: 0 0 auto;
}

.sort-select {
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary);
}

.clear-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(200, 155, 60, 0.1);
  border: 2px solid var(--primary-dark);
  border-radius: var(--radius-md);
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clear-button:hover {
  background: var(--primary-dark);
  color: var(--bg-primary);
}

.results-info {
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.results-info strong {
  color: var(--primary);
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

.empty-state .cta-button {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  border: 2px solid var(--primary);
  border-radius: var(--radius-lg);
  color: var(--bg-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.empty-state .cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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
  .skins-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--spacing-md);
  }

  .filters-row {
    flex-direction: column;
  }
}
</style>
