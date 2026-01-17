<template>
  <div class="rune-card">
    <div class="rune-icon">
      <img :src="iconUrl" :alt="rune.name" />
    </div>
    <div class="rune-info">
      <h3>{{ rune.name }}</h3>
      <p class="rune-desc">{{ rune.shortDesc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RuneData } from "../../services/runesAPI"
import { getRuneIcon } from "../../services/runesAPI"

const props = defineProps<{
  rune: RuneData
}>()

const iconUrl = computed(() => getRuneIcon(props.rune.iconPath))
</script>

<style scoped>
.rune-card {
  background: rgba(9, 15, 25, 0.8);
  border: 1px solid rgba(200, 170, 110, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.rune-card:hover {
  transform: translateY(-4px);
  border-color: rgba(200, 170, 110, 0.5);
  background: rgba(9, 15, 25, 0.95);
  box-shadow: 0 8px 24px rgba(200, 170, 110, 0.15);
}

.rune-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(200, 170, 110, 0.1);
}

.rune-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rune-info {
  flex: 1;
  min-width: 0;
}

.rune-info h3 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 14px;
  color: #f0e6d2;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rune-desc {
  font-size: 12px;
  color: #a09b8c;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
