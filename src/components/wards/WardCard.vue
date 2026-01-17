<template>
  <div class="ward-card" @click="$emit('select', ward)">
    <div class="ward-image">
      <img :src="wardUrl" :alt="ward.name" />
    </div>
    <div class="ward-name">
      <span>{{ ward.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { WardSkinData } from "../../services/wardsAPI"
import { getWardSkinImage } from "../../services/wardsAPI"

const props = defineProps<{
  ward: WardSkinData
}>()

defineEmits<{
  (e: "select", ward: WardSkinData): void
}>()

const wardUrl = computed(() => getWardSkinImage(props.ward.wardImagePath))
</script>

<style scoped>
.ward-card {
  background: rgba(9, 15, 25, 0.8);
  border: 1px solid rgba(200, 170, 110, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.ward-card:hover {
  transform: translateY(-4px);
  border-color: rgba(200, 170, 110, 0.5);
  background: rgba(9, 15, 25, 0.95);
  box-shadow: 0 8px 24px rgba(200, 170, 110, 0.15);
}

.ward-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ward-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.ward-name {
  text-align: center;
  width: 100%;
}

.ward-name span {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 13px;
  color: #f0e6d2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
