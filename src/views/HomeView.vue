<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { fetchLatestChampions, type ChampionData, getChampionSplash } from "../services/championsAPI"

const router = useRouter()

// We can define section types locally or import them, 
// for simplicity let's just use string to allow easy routing
type Section = 
  | "champions"
  | "skins"
  | "items"
  | "runes"
  | "challenges"
  | "emotes"
  | "wards"
  | "icons"

// Stats data removed


const featuredChampions = ref<ChampionData[]>([])

onMounted(async () => {
  try {
    // Fetch top 4 latest champions
    featuredChampions.value = await fetchLatestChampions(4)
  } catch (e) {
    console.error("Failed to fetch featured champions", e)
  }
})

const navigateTo = (section: string) => {
  router.push(`/${section}`)
}

const navigateToChampion = (championId: string) => {
  // Deep link to champions page with ?open=ID
  router.push({ path: "/champions", query: { open: championId } })
}
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">GRADUS</h1>
        <p class="hero-tagline">The Ultimate League of Legends Data Encyclopedia</p>
        <p class="hero-description">
          Powered by <strong>Gradus DB</strong>. Explore every champion, skin, item, rune, challenge, emote, and ward.
          Your comprehensive guide to all League of Legends content and statistics.
        </p>
        <button class="cta-button" @click="navigateTo('champions')">
          Start Exploring →
        </button>
      </div>
    </div>

    <!-- Stats Grid Removed per user request -->


    <!-- Featured Champions -->
    <div class="featured-section">
      <h2 class="section-title">Latest Champions</h2>
      <div v-if="featuredChampions.length > 0" class="featured-grid">
        <div
          v-for="champ in featuredChampions"
          :key="champ.id"
          class="featured-card"
          @click="navigateToChampion(champ.id)"
        >
          <div class="featured-image">
            <img :src="getChampionSplash(champ.id)" :alt="champ.name" />
            <div class="featured-overlay">
              <h3>{{ champ.name }}</h3>
              <p>{{ champ.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loading-featured">
         <!-- Simple Loading State -->
         <p>Loading Latest Champions...</p>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">What's Inside</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Comprehensive Data</h3>
          <p>
            Access detailed information about every League of Legends asset,
            from champions to cosmetics
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎮</div>
          <h3>Live Integration</h3>
          <p>
            Connect to your League client to track personal challenge progress
            and statistics
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Advanced Search</h3>
          <p>
            Filter, sort, and search through thousands of items with powerful
            tools
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Beautiful UI</h3>
          <p>
            Experience data in a stunning interface inspired by League's design
            language
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  padding-bottom: var(--spacing-3xl);
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      135deg,
      rgba(200, 155, 60, 0.1) 0%,
      rgba(10, 200, 185, 0.05) 100%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(28, 35, 51, 0.8) 0%,
      var(--bg-primary) 100%
    );
  border-bottom: 2px solid var(--primary-dark);
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: var(--spacing-2xl);
}

.hero-title {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: clamp(3rem, 8vw, 5rem);
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 0 40px rgba(200, 155, 60, 0.3);
}

.hero-tagline {
  font-family: "Spiegel", sans-serif;
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: var(--spacing-md);
  letter-spacing: 1px;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  font-family: "Spiegel", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  padding: var(--spacing-lg) var(--spacing-2xl);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: var(--bg-primary);
  border: 2px solid var(--primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 20px rgba(200, 155, 60, 0.3);
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(200, 155, 60, 0.5);
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
}

/* Stats Section */
.stats-section {
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: rgba(28, 35, 51, 0.3);
}

.section-title {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 2.5rem;
  text-align: center;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: var(--spacing-2xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  /* max-width removed */
  margin: 0 auto;
}

.stat-card {
  background: rgba(28, 35, 51, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  border: 2px solid rgba(200, 155, 60, 0.2);
  padding: var(--spacing-2xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 10px 40px rgba(200, 155, 60, 0.3);
  background: rgba(28, 35, 51, 0.95);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 0 10px var(--primary));
}

.stat-number {
  font-family: "BeaufortforLOL Medium", serif;
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-family: "Spiegel", sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Featured Section */
.featured-section {
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  /* max-width removed */
  margin: 0 auto;
}

.featured-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid rgba(200, 155, 60, 0.2);
}

.featured-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.featured-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  overflow: hidden;
}

.featured-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.featured-card:hover .featured-image img {
  transform: scale(1.1);
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 14, 27, 0.95), transparent);
  padding: var(--spacing-xl);
}

.featured-overlay h3 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: var(--spacing-xs);
}

.featured-overlay p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Features Section */
.features-section {
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: rgba(28, 35, 51, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  /* max-width removed */
  margin: 0 auto;
}

.feature-card {
  background: rgba(28, 35, 51, 0.6);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(200, 155, 60, 0.1);
  padding: var(--spacing-2xl);
  text-align: center;
  transition: all var(--transition-base);
}

.feature-card:hover {
  border-color: var(--primary-dark);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.feature-card h3 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.25rem;
  color: var(--primary);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }
}
</style>
