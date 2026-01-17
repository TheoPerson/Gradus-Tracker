<template>
  <div class="wards-view">
    <!-- Header -->
    <div class="header">
      <h1>Ward Skins</h1>
      <p class="subtitle">
        {{ filteredWards.length }} ward{{ filteredWards.length !== 1 ? "s" : "" }}
      </p>
    </div>

    <!-- Search & Sort -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search wards..."
          class="search-input"
        />
      </div>
      <div class="sort-box">
        <select v-model="sortBy" class="sort-select">
          <option value="name">Name</option>
          <option value="id">Release</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <HextechLoader v-if="loading" message="Summoning Ward Skins..." />

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Wards Grid -->
    <div v-else class="wards-grid">
      <WardCard 
        v-for="ward in filteredWards" 
        :key="ward.id" 
        :ward="ward" 
        @select="handleSelectWard"
      />
    </div>

    <!-- Asset Detail Modal -->
    <AssetDetailModal
      :visible="showModal"
      :title="selectedWard?.name || ''"
      :image-url="selectedWard ? getWardImageUrl(selectedWard.wardImagePath) : ''"
      :description="selectedWard?.description"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import WardCard from "../components/wards/WardCard.vue"
import {
  fetchAllWardSkins,
  filterWardSkins,
  sortWardSkins,
  type WardSkinData,
} from "../services/wardsAPI"

import AssetDetailModal from "../components/common/AssetDetailModal.vue"
import HextechLoader from "../components/common/HextechLoader.vue"

const wards = ref<WardSkinData[]>([])
const loading = ref(true)
const error = ref("")
const searchQuery = ref("")
const sortBy = ref<"name" | "id">("name")

// Modal State
const showModal = ref(false)
const selectedWard = ref<WardSkinData | null>(null)

const filteredWards = computed(() => {
  let result = filterWardSkins(wards.value, {
    search: searchQuery.value,
  })
  result = sortWardSkins(result, sortBy.value)
  return result
})

const handleSelectWard = (ward: WardSkinData) => {
  selectedWard.value = ward
  showModal.value = true
}

const getWardImageUrl = (path: string) => {
   // We need to access the helper from the service to generate the URL for the modal
   // Ideally we'd import getWardSkinImage, let's do that
   return `https://raw.communitydragon.org/latest${path.toLowerCase()}`
}

onMounted(async () => {
  try {
    wards.value = await fetchAllWardSkins()
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load ward skins"
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wards-view {
  padding: var(--spacing-xl);
  /* max-width removed for full width */
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
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
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

.sort-select {
  padding: 12px 16px;
  background: rgba(9, 15, 25, 0.6);
  border: 1px solid rgba(200, 170, 110, 0.3);
  border-radius: 8px;
  color: #f0e6d2;
  font-size: 14px;
  font-family: "Spiegel", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-select:focus {
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

.wards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .wards-view {
    padding: 16px;
  }

  .wards-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
}
</style>
