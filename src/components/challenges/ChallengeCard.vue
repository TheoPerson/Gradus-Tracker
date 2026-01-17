<template>
  <div class="challenge-card">
    <div class="icon-wrapper">
      <img :src="iconUrl" :alt="challenge.name" loading="lazy" @error="handleImageError" />
    </div>
    <div class="challenge-info">
      <h3>{{ challenge.name }}</h3>
      <p class="desc">{{ challenge.shortDescription || challenge.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type ChallengeData, getChallengeIcon } from "../../services/challengesAPI"

const props = defineProps<{
  challenge: ChallengeData
}>()

const iconUrl = computed(() => getChallengeIcon(props.challenge.iconPath))

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  // Fallback icon if specific one fails
  target.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/challenges/images/veterancy.png"
}
</script>

<style scoped>
.challenge-card {
  background: rgba(28, 35, 51, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 155, 60, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all var(--transition-base);
  height: 100%;
}

.challenge-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  background: rgba(28, 35, 51, 0.8);
  box-shadow: var(--shadow-md);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-md);
}

.icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.challenge-info h3 {
  font-family: "BeaufortforLOL Bold", serif;
  color: var(--primary);
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
}

.desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
