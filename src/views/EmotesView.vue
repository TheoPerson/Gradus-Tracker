<template>
  <div class="emotes-view">
    <!-- Header -->
    <div class="header">
      <h1>Emotes</h1>
      <p class="subtitle">
        {{ filteredEmotes.length }} emote{{ filteredEmotes.length !== 1 ? "s" : "" }}
      </p>
    </div>

    <!-- Search -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search emotes..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Loading State -->
    <HextechLoader v-if="loading" message="Gathering Emotes..." />

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Emotes Grid -->
    <div v-else class="emotes-grid">
      <EmoteCard 
        v-for="emote in filteredEmotes" 
        :key="emote.id" 
        :emote="emote" 
        @select="handleSelectEmote"
      />
    </div>

    <!-- Asset Detail Modal -->
    <AssetDetailModal
      :visible="showModal"
      :title="selectedEmote?.name || ''"
      :image-url="selectedEmote ? getEmoteIcon(selectedEmote.inventoryIcon) : ''"
      description="Emote from League of Legends"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import EmoteCard from "../components/emotes/EmoteCard.vue"
import AssetDetailModal from "../components/common/AssetDetailModal.vue"
import HextechLoader from "../components/common/HextechLoader.vue"
import { fetchAllEmotes, filterEmotes, type EmoteData, getEmoteIcon } from "../services/emotesAPI"

const emotes = ref<EmoteData[]>([])
const loading = ref(true)
const error = ref("")
const searchQuery = ref("")

// Modal State
const showModal = ref(false)
const selectedEmote = ref<EmoteData | null>(null)

const filteredEmotes = computed(() => {
  return filterEmotes(emotes.value, {
    search: searchQuery.value,
  })
})

const handleSelectEmote = (emote: EmoteData) => {
  selectedEmote.value = emote
  showModal.value = true
}

onMounted(async () => {
  try {
    emotes.value = await fetchAllEmotes()
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load emotes"
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.emotes-view {
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

.emotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .emotes-view {
    padding: 16px;
  }

  .emotes-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
}
</style>
