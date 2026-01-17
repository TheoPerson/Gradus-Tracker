<script setup lang="ts">
import type { Skin } from "../../services/skinsAPI"
import { getSkinTile } from "../../services/skinsAPI"

const props = defineProps<{
  skin: Skin
}>()

const emit = defineEmits<{
  (e: "select", skin: Skin): void
}>()

const handleClick = () => {
  emit("select", props.skin)
}

const getPriceDisplay = (price: number | string): string => {
  if (typeof price === "string") return price
  if (price === 0) return "Free"
  if (price === 99999) return "Limited"
  return `${price} RP`
}

const getRarityClass = (skin: Skin): string => {
  const name = skin.name.toLowerCase()
  if (name.includes("ultimate")) return "ultimate"
  if (name.includes("mythic")) return "mythic"
  if (name.includes("legendary")) return "legendary"
  if (name.includes("prestige") || skin.distribution === "Prestige")
    return "prestige"
  return "standard"
}
</script>

<template>
  <div :class="['skin-card', getRarityClass(skin)]" @click="handleClick">
    <div class="skin-image-wrapper">
      <img
        :src="getSkinTile(skin.championId, skin.num)"
        :alt="skin.name"
        loading="lazy"
        @error="
          (e) =>
            ((e.target as HTMLImageElement).src =
              'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
              skin.champion +
              '_' +
              skin.num +
              '.jpg')
        "
      />
      <div class="skin-overlay">
        <div class="skin-badges">
          <span v-if="skin.chromas" class="badge chromas">Chromas</span>
          <span v-if="skin.distribution === 'Prestige'" class="badge prestige">
            Prestige
          </span>
          <span v-if="skin.distribution === 'Esports'" class="badge esports">
            Esports
          </span>
        </div>
      </div>
    </div>
    <div class="skin-info">
      <h3>{{ skin.name }}</h3>
      <p class="skin-champion">{{ skin.champion }}</p>
      <div class="skin-meta">
        <span class="skin-price">{{ getPriceDisplay(skin.price) }}</span>
        <span v-if="skin.release_date" class="skin-date">{{
          new Date(skin.release_date).getFullYear()
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skin-card {
  position: relative;
  background: rgba(28, 35, 51, 0.9);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid rgba(240, 230, 210, 0.1);
  content-visibility: auto;
}

.skin-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.skin-card.ultimate {
  border-color: rgba(255, 140, 0, 0.5);
}

.skin-card.mythic {
  border-color: rgba(138, 43, 226, 0.5);
}

.skin-card.legendary {
  border-color: rgba(255, 215, 0, 0.5);
}

.skin-card.prestige {
  border-color: rgba(200, 155, 60, 0.7);
}

.skin-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
}

.skin-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.skin-card:hover .skin-image-wrapper img {
  transform: scale(1.1);
}

.skin-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.skin-card:hover .skin-overlay {
  opacity: 1;
}

.skin-badges {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  align-items: flex-end;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}

.badge.chromas {
  background: rgba(147, 51, 234, 0.9);
  color: white;
}

.badge.prestige {
  background: rgba(200, 155, 60, 0.9);
  color: var(--bg-primary);
}

.badge.esports {
  background: rgba(10, 200, 185, 0.9);
  color: white;
}

.skin-info {
  padding: var(--spacing-md);
}

.skin-info h3 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skin-champion {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.skin-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.skin-price {
  color: var(--primary);
  font-weight: 600;
}

.skin-date {
  color: var(--text-muted);
}
</style>
