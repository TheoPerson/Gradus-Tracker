<template>
  <Modal :visible="visible" @close="$emit('close')">
    <div v-if="champion" class="champion-detail">
      <!-- Background Splash -->
      <div class="splash-background">
        <div class="overlay"></div>
        <img :src="getChampionSplash(champion.id)" :alt="champion.name" />
      </div>

      <!-- Header Content -->
      <div class="content-wrapper">
        <div class="header">
          <div class="title-group">
            <h2 class="champion-title">{{ champion.title }}</h2>
            <h1 class="champion-name">{{ champion.name }}</h1>
          </div>
          <div class="tags">
            <span v-for="tag in champion.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Lore -->
        <div class="lore-section">
          <h3>Lore</h3>
          <p>{{ champion.lore }}</p>
        </div>

        <!-- Abilities -->
        <div class="abilities-section">
          <h3>Abilities</h3>
          <div class="abilities-grid">
            <!-- Passive -->
            <div class="ability-card passive">
              <div class="ability-icon">
                <img
                  :src="getPassiveIcon(champion.passive.image.full)"
                  :alt="champion.passive.name"
                />
                <span class="key-bind">P</span>
              </div>
              <div class="ability-info">
                <h4>{{ champion.passive.name }}</h4>
                <div
                  v-html="champion.passive.description"
                  class="ability-desc"
                ></div>
              </div>
            </div>

            <!-- Spells Q-R -->
            <div
              v-for="(spell, index) in champion.spells"
              :key="spell.id"
              class="ability-card"
            >
              <div class="ability-icon">
                <img
                  :src="getAbilityIcon(spell.image.full)"
                  :alt="spell.name"
                />
                <span class="key-bind">{{ getKeyBind(index) }}</span>
              </div>
              <div class="ability-info">
                <h4>{{ spell.name }}</h4>
                <div v-html="spell.description" class="ability-desc"></div>
                <div class="ability-meta">
                  <span v-if="spell.cooldown"
                    >Cooldown: {{ spell.cooldown.join(" / ") }}s</span
                  >
                  <span v-if="spell.cost"
                    >Cost: {{ spell.cost.join(" / ") }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skins Carousel (Simple Grid for now) -->
        <div class="skins-section" v-if="champion.skins">
          <h3>Skins ({{ champion.skins.length }})</h3>
          <div class="skins-grid">
            <div
              v-for="skin in champion.skins.slice(1)"
              :key="skin.id"
              class="skin-item"
            >
              <div class="skin-image">
                <img
                  :src="getChampionSplash(champion.id, skin.num)"
                  :alt="skin.name"
                  loading="lazy"
                />
              </div>
              <span class="skin-name">{{ skin.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Summoning Champion Data...</p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Modal from "../common/Modal.vue"
import {
  getChampionSplash,
  getAbilityIcon,
  getPassiveIcon,
  type ChampionDetails,
} from "../../services/championsAPI"

const props = defineProps<{
  visible: boolean
  champion: ChampionDetails | null
}>()

defineEmits<{
  (e: "close"): void
}>()

const getKeyBind = (index: number) => {
  return ["Q", "W", "E", "R"][index]
}
</script>

<style scoped>
.champion-detail {
  position: relative;
  min-height: 80vh;
  color: #f0e6d2;
}

.splash-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500px;
  z-index: 0;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

.splash-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 14, 27, 0.3),
    rgba(10, 14, 27, 0.95)
  );
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 300px 48px 48px 48px;
}

.header {
  margin-bottom: 48px;
}

.title-group {
  margin-bottom: 16px;
}

.champion-title {
  font-family: "Spiegel", sans-serif;
  font-size: 24px;
  color: #c8aa6e;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  font-weight: 500;
}

.champion-name {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 84px;
  color: #f0e6d2;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.tags {
  display: flex;
  gap: 12px;
}

.tag {
  padding: 6px 16px;
  background: rgba(200, 155, 60, 0.1);
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 4px;
  color: #c8aa6e;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lore-section {
  margin-bottom: 48px;
  max-width: 800px;
}

.lore-section h3,
.abilities-section h3,
.skins-section h3 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 24px;
  color: #c8aa6e;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(200, 155, 60, 0.2);
  padding-bottom: 8px;
  display: inline-block;
}

.lore-section p {
  font-size: 16px;
  line-height: 1.8;
  color: #a09b8c;
}

.abilities-grid {
  display: grid;
  gap: 24px;
}

.ability-card {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: rgba(9, 15, 25, 0.6);
  border: 1px solid rgba(200, 155, 60, 0.1);
  border-radius: 8px;
  align-items: flex-start;
}

.ability-icon {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border: 2px solid #c8aa6e;
}

.ability-icon img {
  width: 100%;
  height: 100%;
}

.key-bind {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #090f19;
  border: 1px solid #c8aa6e;
  color: #c8aa6e;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
}

.ability-info h4 {
  color: #f0e6d2;
  font-size: 18px;
  margin: 0 0 8px 0;
}

.ability-desc {
  font-size: 14px;
  color: #a09b8c;
  line-height: 1.6;
  margin-bottom: 12px;
}

.ability-meta {
  font-size: 12px;
  color: #6a6659;
  display: flex;
  gap: 16px;
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.skin-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.skin-item:hover {
  transform: translateY(-4px);
}

.skin-image {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border: 1px solid rgba(200, 155, 60, 0.3);
  margin-bottom: 8px;
}

.skin-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.skin-item:hover .skin-image img {
  transform: scale(1.05);
}

.skin-name {
  font-size: 14px;
  color: #a09b8c;
  display: block;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(200, 170, 110, 0.2);
  border-top-color: #c8aa6e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar within desc if needed */
:deep(.ability-desc ::-webkit-scrollbar) {
  width: 4px;
}
</style>
