<script setup lang="ts">
import type { ItemData } from "../../services/itemsAPI"
import { getItemIcon, getItemTier } from "../../services/itemsAPI"

const props = defineProps<{
  itemId: string
  item: ItemData
}>()

const emit = defineEmits<{
  (e: "select", itemId: string, item: ItemData): void
}>()

const handleClick = () => {
  emit("select", props.itemId, props.item)
}

const getTierClass = (tier: string): string => {
  return tier.toLowerCase().replace(" ", "-")
}
</script>

<template>
  <div
    :class="['item-card', getTierClass(getItemTier(item))]"
    @click="handleClick"
  >
    <div class="item-icon-wrapper">
      <img
        :src="getItemIcon(item.image.full)"
        :alt="item.name"
        loading="lazy"
      />
      <div class="item-tier-badge">{{ getItemTier(item) }}</div>
    </div>
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p class="item-description">{{ item.plaintext || item.description }}</p>
      <div class="item-meta">
        <span class="item-price">{{ item.gold.total }} Gold</span>
        <span v-if="item.tags && item.tags.length > 0" class="item-tags">
          {{ item.tags.slice(0, 2).join(", ") }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  display: flex;
  gap: var(--spacing-md);
  background: rgba(28, 35, 51, 0.9);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid rgba(240, 230, 210, 0.1);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
  background: rgba(28, 35, 51, 1);
}

.item-card.mythic {
  border-color: rgba(138, 43, 226, 0.5);
}

.item-card.legendary {
  border-color: rgba(255, 215, 0, 0.4);
}

.item-card.boots {
  border-color: rgba(10, 200, 185, 0.3);
}

.item-icon-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
}

.item-icon-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  border: 1px solid rgba(240, 230, 210, 0.2);
}

.item-tier-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 2px 6px;
  background: var(--primary-dark);
  border: 1px solid var(--primary);
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h3 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.75rem;
}

.item-price {
  color: var(--primary);
  font-weight: 600;
}

.item-tags {
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
