<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import ChallengeCard from "../components/challenges/ChallengeCard.vue"
import { fetchAllChallenges, filterChallenges, type ChallengeData } from "../services/challengesAPI"
import HextechLoader from "../components/common/HextechLoader.vue"

const challenges = ref<ChallengeData[]>([])
const isLoading = ref(true)
const searchQuery = ref("")

// Pagination / limit for rendering performance
const displayLimit = ref(50)

const filteredChallenges = computed(() => {
  return filterChallenges(challenges.value, {
    search: searchQuery.value
  })
})

const displayedChallenges = computed(() => {
    return filteredChallenges.value.slice(0, displayLimit.value)
})

const loadMore = () => {
    displayLimit.value += 50
}

// Infinite scroll handler
const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 200) {
        loadMore()
    }
}

onMounted(async () => {
  try {
    challenges.value = await fetchAllChallenges()
  } catch (error) {
    console.error("Failed to load challenges:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="challenges-view" @scroll="handleScroll">
    <div class="view-header">
      <h1>Challenges Database</h1>
      <p class="view-subtitle">Browse all {{ challenges.length }} League of Legends challenges</p>
    </div>

    <!-- Controls -->
    <div class="controls">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search challenges..."
          class="search-input"
        />
      </div>
    </div>

    <HextechLoader v-if="isLoading" message="Loading Challenges Database..." />

    <div v-else class="content-wrapper">
      <div v-if="filteredChallenges.length > 0" class="challenges-grid">
        <ChallengeCard
          v-for="challenge in displayedChallenges"
          :key="challenge.id"
          :challenge="challenge"
        />
      </div>
      
      <div v-else class="empty-state">
        <h2>No challenges found</h2>
        <p>Try adjusting your search</p>
      </div>

       <div v-if="displayedChallenges.length < filteredChallenges.length" class="load-more">
        <button class="league-button" @click="loadMore">Load More</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenges-view {
  padding: var(--spacing-xl);
  height: 100vh;
  overflow-y: auto;
}

.view-header {
  margin-bottom: var(--spacing-xl);
}

.view-header h1 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 2.5rem;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
}

.view-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.controls {
  margin-bottom: var(--spacing-xl);
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: "Spiegel", sans-serif;
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(28, 35, 51, 0.8);
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-3xl);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--text-muted);
}

.load-more {
    text-align: center;
    padding: var(--spacing-xl);
}
</style>
