<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import {
  fetchAllItems,
  filterItems,
  sortItems,
  type ItemData,
} from "../services/itemsAPI"
import ItemCard from "../components/items/ItemCard.vue"
import HextechLoader from "../components/common/HextechLoader.vue"
import ItemDetailModal from "../components/items/ItemDetailModal.vue"

const itemsData = ref<Record<string, ItemData>>({})
const isLoading = ref(true)
const searchQuery = ref("")
const sortBy = ref<"name" | "price" | "popular">("popular")
const selectedTags = ref<string[]>([])

// Modal State
const showModal = ref(false)
const selectedItem = ref<ItemData | null>(null)

// Common item tags
const itemTags = [
  "Damage",
  "CriticalStrike",
  "AttackSpeed",
  "LifeSteal",
  "SpellDamage",
  "Mana",
  "ManaRegen",
  "Armor",
  "SpellBlock",
  "Health",
  "HealthRegen",
  "Boots",
  "Jungle",
  "Lane",
  "Vision",
]

onMounted(async () => {
  try {
    itemsData.value = await fetchAllItems()
  } catch (error) {
    console.error("Failed to load items:", error)
  } finally {
    isLoading.value = false
  }
})

const itemsArray = computed(() => {
  return Object.entries(itemsData.value)
})

const filteredAndSortedItems = computed(() => {
  let result = filterItems(itemsArray.value, {
    search: searchQuery.value,
    tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    purchasableOnly: true, // Only show purchasable items
  })

  result = sortItems(result, sortBy.value)

  return result
})

const handleSelectItem = (itemId: string, item: ItemData) => {
  selectedItem.value = item
  showModal.value = true
}

const handleRelatedSelect = (itemId: string) => {
  if (itemsData.value[itemId]) {
    selectedItem.value = itemsData.value[itemId]
  }
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  searchQuery.value = ""
  selectedTags.value = []
  sortBy.value = "popular"
}
</script>

<template>
  <div class="items-view">
    <div class="view-header">
      <h1>Items</h1>
      <p class="view-subtitle">
        Browse {{ itemsArray.length }}+ League of Legends items
      </p>
    </div>

    <HextechLoader v-if="isLoading" message="Forging Items..." />

    <div v-else class="items-content">
      <!-- Search & Sort -->
      <div class="controls">
        <div class="top-controls">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="search-input"
          />

          <select v-model="sortBy" class="sort-select">
            <option value="popular">Most Popular</option>
            <option value="name">Name (A-Z)</option>
            <option value="price">Highest Price</option>
          </select>
        </div>

        <!-- Tag Filters -->
        <div class="tag-filters">
          <h3 class="filters-title">Filter by Stats</h3>
          <div class="tags-grid">
            <button
              v-for="tag in itemTags"
              :key="tag"
              :class="['tag-chip', { active: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
          <button
            v-if="selectedTags.length > 0 || searchQuery"
            class="clear-button"
            @click="clearFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-info">
        <p>
          <strong>{{ filteredAndSortedItems.length }}</strong>
          items found
        </p>
      </div>

      <!-- Items List -->
      <div v-if="filteredAndSortedItems.length > 0" class="items-list">
        <ItemCard
          v-for="[itemId, item] in filteredAndSortedItems"
          :key="itemId"
          :item-id="itemId"
          :item="item"
          @select="handleSelectItem"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h2>No items found</h2>
        <p>Try adjusting your search or filters</p>
        <button class="cta-button" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <!-- Item Detail Modal -->
    <ItemDetailModal
      :visible="showModal"
      :item="selectedItem"
      :all-items="itemsData"
      @close="showModal = false"
      @select-item="handleRelatedSelect"
    />
  </div>
</template>

<style scoped>
.items-view {
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

.items-content {
  animation: fadeIn 0.5s ease-out;
}

.controls {
  margin-bottom: var(--spacing-xl);
}

.top-controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-base);
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(28, 35, 51, 0.8);
  box-shadow: 0 0 0 4px rgba(200, 155, 60, 0.1);
}

.sort-select {
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-base);
  backdrop-filter: blur(10px);
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary);
}

.tag-filters {
  padding: var(--spacing-lg);
  background: rgba(28, 35, 51, 0.4);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(240, 230, 210, 0.1);
}

.filters-title {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 0.9rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-md);
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.tag-chip {
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
}

.tag-chip:hover {
  border-color: var(--primary-dark);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.tag-chip.active {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  border-color: var(--primary);
  color: var(--bg-primary);
  box-shadow: var(--shadow-md);
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

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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
  .top-controls {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

  .tags-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
