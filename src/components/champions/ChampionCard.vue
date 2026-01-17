<script setup lang="ts">
import type { ChampionData } from "../../services/championsAPI"
import { getChampionIcon } from "../../services/championsAPI"

const props = defineProps<{
  champion: ChampionData
}>()

const emit = defineEmits<{
  (e: "select", champion: ChampionData): void
}>()

const handleClick = () => {
  emit("select", props.champion)
}
</script>

<template>
  <div class="champion-card" @click="handleClick">
    <div class="champion-image-wrapper">
      <img
        :src="getChampionIcon(champion.id)"
        :alt="champion.name"
        loading="lazy"
      />
    </div>
    <div class="champion-info">
      <h3>{{ champion.name }}</h3>
      <p class="champion-title">{{ champion.title }}</p>
      <div class="champion-roles">
        <span v-for="role in champion.tags" :key="role" class="role-badge">
          {{ role }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.champion-card {
  background: rgba(28, 35, 51, 0.9);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid rgba(240, 230, 210, 0.1);
  content-visibility: auto;
  contain-intrinsic-size: 1px 350px;
}

.champion-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.champion-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
}

.champion-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.champion-card:hover .champion-image-wrapper img {
  transform: scale(1.1);
}

.champion-info {
  padding: var(--spacing-lg);
}

.champion-info h3 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.champion-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.champion-roles {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.role-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(200, 155, 60, 0.2);
  border: 1px solid var(--primary-dark);
  border-radius: 4px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
