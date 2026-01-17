<template>
  <Modal :visible="visible" @close="$emit('close')">
    <div v-if="item" class="item-detail">
      <div class="header">
        <div class="item-icon-wrapper">
          <img :src="getItemIcon(item.image.full)" :alt="item.name" />
          <div class="gold-cost">
            <span class="gold-icon">🪙</span>
            {{ item.gold.total }}
          </div>
        </div>
        <div class="header-info">
          <div class="title-row">
            <h1>{{ item.name }}</h1>
            <span :class="['tier-badge', getTierClass(item)]">
              {{ getItemTier(item) }}
            </span>
          </div>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Main Stats & Description -->
        <div class="main-info">
          <div class="stats-box" v-if="hasStats(item)">
            <h3>Stats</h3>
            <div class="stats-list">
              <div
                v-for="(value, key) in item.stats"
                :key="key"
                class="stat-row"
              >
                <span class="stat-value">+{{ value }}</span>
                <span class="stat-name">{{ formatStatName(key.toString()) }}</span>
              </div>
            </div>
          </div>

          <div class="description-box">
            <h3>Passive & Active</h3>
            <div v-html="item.description" class="html-desc"></div>
          </div>
        </div>

        <!-- Build Path -->
        <div class="build-path-section">
          <!-- Into (What this builds into) -->
          <div class="build-column" v-if="item.into && item.into.length">
            <h3>Builds Into</h3>
            <div class="item-list">
              <div
                v-for="intoId in item.into"
                :key="intoId"
                class="mini-item"
                @click="selectRelatedItem(intoId)"
              >
                <img
                  v-if="allItems[intoId]"
                  :src="getItemIcon(allItems[intoId].image.full)"
                  :title="allItems[intoId].name"
                />
              </div>
            </div>
          </div>

          <!-- Current -->
          <div class="build-column center">
            <div class="mini-item active">
              <img :src="getItemIcon(item.image.full)" />
            </div>
          </div>

          <!-- From (Recipe) -->
          <div class="build-column" v-if="item.from && item.from.length">
            <h3>Recipe</h3>
            <div class="item-list">
              <div
                v-for="fromId in item.from"
                :key="fromId"
                class="mini-item"
                @click="selectRelatedItem(fromId)"
              >
                <img
                  v-if="allItems[fromId]"
                  :src="getItemIcon(allItems[fromId].image.full)"
                  :title="allItems[fromId].name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../common/Modal.vue"
import {
  type ItemData,
  getItemIcon,
  getItemTier,
} from "../../services/itemsAPI"

const props = defineProps<{
  visible: boolean
  item: ItemData | null
  allItems: Record<string, ItemData> // Needed for build paths
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "select-item", itemId: string): void
}>()

const getTierClass = (item: ItemData) => {
  return getItemTier(item).toLowerCase()
}

const hasStats = (item: ItemData) => {
  return item.stats && Object.keys(item.stats).length > 0
}

const formatStatName = (key: string) => {
  // FlatPhysicalDamageMod -> Attack Damage
  return key
    .replace("Flat", "")
    .replace("Mod", "")
    .replace(/([A-Z])/g, " $1")
    .trim()
}

const selectRelatedItem = (id: string) => {
  emit("select-item", id)
}
</script>

<style scoped>
.item-detail {
  padding: 32px;
  color: #f0e6d2;
}

.header {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: center;
}

.item-icon-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.item-icon-wrapper img {
  width: 80px;
  height: 80px;
  border: 2px solid #c8aa6e;
  border-radius: 8px;
}

.gold-cost {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #c8aa6e;
  font-weight: bold;
}

.header-info {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.title-row h1 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 32px;
  margin: 0;
  color: #f0e6d2;
}

.tier-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid currentColor;
}

.tier-badge.mythic {
  color: #ffaa00;
  border-color: #ffaa00;
  background: rgba(255, 170, 0, 0.1);
}

.tier-badge.legendary {
  color: #c8aa6e; /* Gold */
  border-color: #c8aa6e;
}

.tier-badge.epic {
  color: #0ac8b9; /* Teal */
  border-color: #0ac8b9;
}

.tier-badge.basic, .tier-badge.boots {
  color: #a09b8c;
  border-color: #a09b8c;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  color: #a09b8c;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.main-info h3,
.build-path-section h3 {
  font-family: "BeaufortforLOL-Bold", serif;
  color: #c8aa6e;
  margin-bottom: 16px;
  font-size: 18px;
  border-bottom: 1px solid rgba(200, 155, 60, 0.2);
  padding-bottom: 4px;
}

.stats-list {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.stat-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stat-value {
  color: #f0e6d2;
  font-weight: bold;
}

.stat-name {
  color: #a09b8c;
  font-size: 14px;
}

.html-desc {
  color: #a09b8c;
  line-height: 1.5;
  font-size: 14px;
}

/* Style Riot's HTML tags */
:deep(.html-desc unique) {
  color: #c8aa6e;
  font-weight: bold;
}
:deep(.html-desc active) {
  color: #c8aa6e;
  display: block;
  margin-top: 8px;
  font-weight: bold;
}
:deep(.html-desc passive) {
  color: #c8aa6e;
  display: block;
  margin-top: 8px;
  font-weight: bold;
}
:deep(.html-desc stats) {
    color: #0ac8b9;
}
:deep(.html-desc attention) {
    color: #ff5555;
}

.build-path-section {
  background: rgba(9, 15, 25, 0.6);
  border: 1px solid rgba(200, 155, 60, 0.1);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.build-column {
  width: 100%;
  text-align: center;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.mini-item {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(200, 155, 60, 0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.mini-item:hover {
  transform: scale(1.1);
  border-color: #c8aa6e;
}

.mini-item.active {
  width: 50px;
  height: 50px;
  border: 2px solid #c8aa6e;
  box-shadow: 0 0 10px rgba(200, 155, 60, 0.3);
  cursor: default;
}

.mini-item img {
  width: 100%;
  height: 100%;
}
</style>
