<template>
  <div class="emote-card" @click="$emit('select', emote)">
    <div class="emote-icon">
      <img :src="iconUrl" :alt="emote.name" />
    </div>
    <div class="emote-name">
      <span>{{ emote.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { EmoteData } from "../../services/emotesAPI"
import { getEmoteIcon } from "../../services/emotesAPI"

const props = defineProps<{
  emote: EmoteData
}>()

defineEmits<{
  (e: "select", emote: EmoteData): void
}>()

const iconUrl = computed(() => getEmoteIcon(props.emote.inventoryIcon))
</script>

<style scoped>
.emote-card {
  background: rgba(9, 15, 25, 0.8);
  border: 1px solid rgba(200, 170, 110, 0.2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  aspect-ratio: 1;
}

.emote-card:hover {
  transform: scale(1.05);
  border-color: rgba(200, 170, 110, 0.5);
  background: rgba(9, 15, 25, 0.95);
  box-shadow: 0 8px 24px rgba(200, 170, 110, 0.15);
}

.emote-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(200, 170, 110, 0.1);
}

.emote-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emote-name {
  text-align: center;
  width: 100%;
}

.emote-name span {
  font-size: 12px;
  color: #f0e6d2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
