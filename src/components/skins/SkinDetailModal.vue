<template>
  <Modal :visible="visible" @close="$emit('close')">
    <div v-if="skin" class="skin-detail">
      <!-- Full Splash Art -->
      <div class="splash-container">
        <img
          :src="getSkinSplash(skin)"
          :alt="skin.name"
          class="full-splash"
        />
        <div class="overlay-gradient"></div>

        <!-- Info Overlay -->
        <div class="info-overlay">
          <div class="header">
            <h2 class="champion-name">{{ skin.champion }}</h2>
            <h1 class="skin-name">{{ skin.name }}</h1>
          </div>

          <div class="meta-row">
            <!-- Rarity Badge -->
            <div v-if="skin.rarity" :class="['rarity-badge', skin.rarity.toLowerCase()]">
              {{ skin.rarity }}
            </div>

            <!-- Price -->
            <div class="price-badge">
              <span class="rp-icon">💎</span>
              {{ formatPrice(skin.price) }}
            </div>

            <!-- Release Date -->
            <div class="date-badge" v-if="skin.release_date">
              📅 {{ formatDate(skin.release_date) }}
            </div>
          </div>
          
           <!-- Badges/Tags -->
          <div class="badges-row">
            <span v-if="isPrestige(skin)" class="badge prestige">✨ Prestige</span>
            <span v-if="isGemstone(skin)" class="badge mythic">🟣 Mythic Essence</span>
             <span v-if="isLegacy(skin)" class="badge legacy">🕰️ Legacy</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../common/Modal.vue"
import type { Skin } from "../../services/skinsAPI"

const props = defineProps<{
  visible: boolean
  skin: Skin | null
}>()

defineEmits<{
  (e: "close"): void
}>()

// Use the high-res splash from Community Dragon or Data Dragon
// Since our local data might have different paths, we construct standard Riot paths
const getSkinSplash = (skin: Skin) => {
    if (skin.name === "default") {
         return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${skin.champion}_${skin.num}.jpg`
    }
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${skin.champion}_${skin.num}.jpg`
}

const formatPrice = (price: number | string) => {
  if (price === 0 || price === "0") return "Free / Reward"
  if (price === 99999) return "Special / N/A"
  return `${price} RP`
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const isPrestige = (skin: Skin) => {
    return skin.name.toLowerCase().includes("prestige") || skin.distribution === "Prestige"
}

const isGemstone = (skin: Skin) => {
    // Basic check for Mythic/Gemstone
    return skin.rarity === "Mythic" || skin.distribution === "Gemstone"
}

const isLegacy = (skin: Skin) => {
    return skin.distribution === "Legacy"
}
</script>

<style scoped>
.skin-detail {
  width: 100%;
  height: 80vh; /* Fixed height for the modal content */
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.splash-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-splash {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container */
  object-position: top center;
}

.overlay-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
  pointer-events: none;
}

.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 48px;
  z-index: 10;
}

.header {
  margin-bottom: 16px;
}

.champion-name {
  font-family: "Spiegel", sans-serif;
  font-size: 24px;
  color: #c8aa6e;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.skin-name {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 56px;
  color: #f0e6d2;
  text-transform: uppercase;
  line-height: 1.1;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.8);
}

.meta-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.rarity-badge {
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    background: rgba(0,0,0,0.6);
    border: 1px solid #c8aa6e;
    color: #c8aa6e;
}

.rarity-badge.ultimate { color: #e84057; border-color: #e84057; }
.rarity-badge.mythic { color: #a300cc; border-color: #a300cc; }
.rarity-badge.legendary { color: #e84057; border-color: #e84057; }
.rarity-badge.epic { color: #00cec9; border-color: #00cec9; }

.price-badge, .date-badge {
    color: #f0e6d2;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.badges-row {
    display: flex;
    gap: 12px;
}

.badge {
    padding: 4px 10px;
    border-radius: 4px;
    background: rgba(200, 155, 60, 0.2);
    border: 1px solid rgba(200, 155, 60, 0.4);
    color: #c8aa6e;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.badge.prestige {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    color: #ffd700;
}

.badge.mythic {
    background: rgba(138, 43, 226, 0.2);
    border-color: #8a2be2;
    color: #d8b4fe;
}

@media (max-width: 768px) {
    .skin-name { font-size: 32px; }
    .info-overlay { padding: 24px; }
    .meta-row { flex-wrap: wrap; }
}
</style>
