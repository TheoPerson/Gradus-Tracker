<template>
  <div class="icons-view">
    <!-- Header -->
    <div class="header">
      <h1>Profile Icons</h1>
      <p class="subtitle">
        {{ filteredIcons.length }} icon{{ filteredIcons.length !== 1 ? "s" : "" }}
      </p>
    </div>

    <!-- Search & Sort -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by ID..."
          class="search-input"
        />
      </div>
      <div class="sort-box">
        <select v-model="sortBy" class="sort-select">
          <option value="id-desc">Newest First</option>
          <option value="id-asc">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <HextechLoader v-if="loading" message="Loading Icons Collection..." />

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Icons Grid -->
    <div v-else class="icons-grid">
      <IconCard 
        v-for="[iconId] in filteredIcons" 
        :key="iconId" 
        :icon-id="iconId" 
        @select="handleSelectIcon"
      />
    </div>

    <!-- Asset Detail Modal -->
    <AssetDetailModal
      :visible="showModal"
      :title="`Profile Icon #${selectedIconId}`"
      :image-url="selectedIconId ? getProfileIconUrl(selectedIconId) : ''"
      description="Profile Icon from League of Legends"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import IconCard from "../components/icons/IconCard.vue"
import {
  fetchAllProfileIcons,
  filterProfileIcons,
  sortProfileIcons,
  type ProfileIconData,
} from "../services/profileIconsAPI"

import AssetDetailModal from "../components/common/AssetDetailModal.vue"
import HextechLoader from "../components/common/HextechLoader.vue"
import { getProfileIconUrl } from "../services/profileIconsAPI"

const icons = ref<Record<string, ProfileIconData>>({})
const loading = ref(true)
const error = ref("")
const searchQuery = ref("")
const sortBy = ref<"id-asc" | "id-desc">("id-desc")

// Modal State
const showModal = ref(false)
const selectedIconId = ref<string | null>(null)

const filteredIcons = computed(() => {
  let result = Object.entries(icons.value)
  result = filterProfileIcons(result, {
    search: searchQuery.value,
  })
  result = sortProfileIcons(result, sortBy.value)
  return result
})

const handleSelectIcon = (iconId: string) => {
  selectedIconId.value = iconId
  showModal.value = true
}

onMounted(async () => {
  try {
    icons.value = await fetchAllProfileIcons()
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load profile icons"
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.icons-view {
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

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .icons-view {
    padding: 16px;
  }

  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }
}
</style>
