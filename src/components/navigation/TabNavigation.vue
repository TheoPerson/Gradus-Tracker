<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

type Section =
  | "home"
  | "challenges"
  | "champions"
  | "skins"
  | "items"
  | "runes"
  | "emotes"
  | "wards"
  | "icons"
  | "spells"

const sections: { id: Section; label: string; icon: string; path: string }[] = [
  { id: "home", label: "Home", icon: "🏠", path: "/" },
  { id: "challenges", label: "Challenges", icon: "🏆", path: "/challenges" },
  { id: "champions", label: "Champions", icon: "⚔️", path: "/champions" },
  { id: "skins", label: "Skins", icon: "🎨", path: "/skins" },
  { id: "items", label: "Items", icon: "⚡", path: "/items" },
  { id: "runes", label: "Runes", icon: "🔮", path: "/runes" },
  { id: "emotes", label: "Emotes", icon: "🎭", path: "/emotes" },
  { id: "wards", label: "Wards", icon: "👁️", path: "/wards" },
  { id: "icons", label: "Icons", icon: "🖼️", path: "/icons" },
  { id: "spells", label: "Summoners", icon: "✨", path: "/spells" },
]

const isActive = (path: string) => {
  if (path === "/" && route.path !== "/") return false
  return route.path === path
}

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <nav class="tab-navigation">
    <div class="nav-container">
      <button
        v-for="section in sections"
        :key="section.id"
        :class="['nav-tab', { active: isActive(section.path) }]"
        @click="navigate(section.path)"
      >
        <span class="tab-icon">{{ section.icon }}</span>
        <span class="tab-label">{{ section.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tab-navigation {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(28, 35, 51, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid var(--primary-dark);
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-xl);
}

.nav-container {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: 0 var(--spacing-lg);
  scrollbar-width: none; /* Hide scrollbar for cleaner look */
  justify-content: center; /* Center items */
  flex-wrap: wrap; /* Allow wrapping if needed to avoid scrollbar */
}

/* Hide scrollbar for Chrome/Safari/Opera */
.nav-container::-webkit-scrollbar {
  display: none;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(28, 35, 51, 0.6);
  border: 2px solid rgba(240, 230, 210, 0.1);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-family: "Spiegel", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

.nav-tab:hover {
  border-color: var(--primary-dark);
  color: var(--text-primary);
  transform: translateY(-2px);
  background: rgba(28, 35, 51, 0.8);
}

.nav-tab.active {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  border-color: var(--primary);
  color: var(--bg-primary);
  box-shadow: 0 0 20px rgba(200, 155, 60, 0.3);
}

.tab-icon {
  font-size: 18px;
  line-height: 1;
}

.tab-label {
  font-size: 13px;
}

/* Scrollbar styling for horizontal overflow */
.nav-container::-webkit-scrollbar {
  height: 4px;
}

.nav-container::-webkit-scrollbar-track {
  background: transparent;
}

.nav-container::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .tab-navigation {
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100%;
    margin-bottom: 0;
    padding: 0;
    background: rgba(10, 14, 27, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--primary-dark);
    border-bottom: none;
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.5);
  }

  .nav-container {
    padding: 8px;
    gap: 4px;
    justify-content: space-around;
    overflow-x: visible; /* No scroll, justify instead */
  }

  /* Hide labels on mobile to save space */
  .tab-label {
    display: none;
  }

  .nav-tab {
    flex-direction: column;
    padding: 8px 12px;
    background: transparent;
    border: none;
    border-radius: 8px;
    width: 100%;
    justify-content: center;
    gap: 4px;
  }

  .nav-tab:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: none;
  }

  .nav-tab.active {
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--primary);
  }

  .nav-tab.active .tab-icon {
    transform: translateY(-2px);
    text-shadow: 0 0 10px var(--primary);
  }

  /* Make icons larger on mobile */
  .tab-icon {
    font-size: 20px;
    transition: transform 0.2s;
  }
}
</style>
