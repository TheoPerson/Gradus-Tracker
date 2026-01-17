<template>
  <div class="icon-card" @click="$emit('select', iconId)">
    <div class="icon-image">
      <img :src="iconUrl" :alt="`Icon ${iconId}`" />
    </div>
    <div class="icon-id">
      <span>#{{ iconId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { getProfileIconUrl } from "../../services/profileIconsAPI"

const props = defineProps<{
  iconId: string
}>()

defineEmits<{
  (e: "select", iconId: string): void
}>()

const iconUrl = computed(() => getProfileIconUrl(props.iconId))
</script>

<style scoped>
.icon-card {
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

.icon-card:hover {
  transform: scale(1.05);
  border-color: rgba(200, 170, 110, 0.5);
  background: rgba(9, 15, 25, 0.95);
  box-shadow: 0 8px 24px rgba(200, 170, 110, 0.15);
}

.icon-image {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(200, 170, 110, 0.1);
  border: 2px solid rgba(200, 170, 110, 0.3);
}

.icon-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-id {
  text-align: center;
}

.icon-id span {
  font-size: 12px;
  color: #a09b8c;
  font-family: "Spiegel", sans-serif;
}
</style>
