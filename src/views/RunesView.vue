<template>
  <div class="runes-view">
    <!-- Header -->
    <div class="header">
      <h1>Runes & Keystones</h1>
      <p class="subtitle">
        {{ filteredRunes.length }} rune{{ filteredRunes.length !== 1 ? "s" : "" }}
      </p>
    </div>

    <!-- Search & Filters -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search runes..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Loading State -->
    <HextechLoader v-if="loading" message="Consulting Runes..." />

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Runes Grid -->
    <div v-else class="runes-grid">
      <RuneCard 
        v-for="rune in filteredRunes" 
        :key="rune.id" 
        :rune="rune" 
        @click="handleSelectRune(rune)"
        class="interactive-card"
      />
    </div>

    <!-- Rule Detail Modal -->
    <RuneDetailModal
      :visible="showModal"
      :rune="selectedRune"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import RuneCard from "../components/runes/RuneCard.vue"
import { fetchAllRunes, filterRunes, type RuneData } from "../services/runesAPI"
import RuneDetailModal from "../components/runes/RuneDetailModal.vue"
import HextechLoader from "../components/common/HextechLoader.vue"

const runes = ref<RuneData[]>([])
const loading = ref(true)
const error = ref("")
const searchQuery = ref("")

// Modal State
const showModal = ref(false)
const selectedRune = ref<RuneData | null>(null)

const filteredRunes = computed(() => {
  return filterRunes(runes.value, {
    search: searchQuery.value,
  })
})

onMounted(async () => {
  try {
    runes.value = await fetchAllRunes()
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load runes"
  } finally {
  }
})

const handleSelectRune = (rune: RuneData) => {
  selectedRune.value = rune
  showModal.value = true
}
</script>

<style scoped>
.runes-view {
  padding: var(--spacing-xl);
  /* max-width removed */
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 42px;
  color: #f0e6d2;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 16px;
  color: #a09b8c;
  margin: 0;
}

.controls {
  margin-bottom: 24px;
}

.search-box {
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(9, 15, 25, 0.6);
  border: 1px solid rgba(200, 170, 110, 0.3);
  border-radius: 8px;
  color: #f0e6d2;
  font-size: 14px;
  font-family: "Spiegel", sans-serif;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: rgba(200, 170, 110, 0.6);
  background: rgba(9, 15, 25, 0.8);
}

.loading,
.error {
  text-align: center;
  padding: 64px 32px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(200, 170, 110, 0.2);
  border-top-color: #c8aa6e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p,
.error p {
  color: #a09b8c;
  font-size: 14px;
}

.runes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .runes-view {
    padding: 16px;
  }

  .runes-grid {
    grid-template-columns: 1fr;
  }
}

.interactive-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.interactive-card:hover {
  transform: translateY(-4px);
}
</style>
