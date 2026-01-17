<template>
  <Modal :visible="visible" @close="$emit('close')">
    <div v-if="rune" class="rune-detail">
      <div class="header">
        <img :src="getRuneIcon(rune.iconPath)" :alt="rune.name" class="rune-icon"/>
        <div class="header-text">
          <h1>{{ rune.name }}</h1>
          <span class="rune-id">ID: {{ rune.id }}</span>
        </div>
      </div>

      <div class="content">
        <!-- Main Description -->
        <div class="description-section">
          <h3>Description</h3>
          <div v-html="formatDescription(rune.longDesc)" class="rune-desc"></div>
        </div>

        <!-- Meta Info if available -->
        <div class="meta-section" v-if="rune.endOfGameStatDescs && rune.endOfGameStatDescs.length">
            <h3>End of Game Stats</h3>
            <ul class="stats-list">
                <li v-for="(stat, index) in rune.endOfGameStatDescs" :key="index">
                    {{ stat }}
                </li>
            </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../common/Modal.vue"
import type { RuneData } from "../../services/runesAPI"
import { getRuneIcon } from "../../services/communityDragon"

const props = defineProps<{
  visible: boolean
  rune: RuneData | null
}>()

defineEmits<{
  (e: "close"): void
}>()

const formatDescription = (desc: string) => {
    if (!desc) return "No description available."
    // Simple replacements for Riot's formatting tags if they exist
    return desc
        .replace(/<br>/g, '<br/>')
        .replace(/<hr>/g, '<hr class="rune-divider"/>')
        .replace(/<attention>/g, '<span class="attention">')
        .replace(/<\/attention>/g, '</span>')
        .replace(/<active>/g, '<span class="active">')
        .replace(/<\/active>/g, '</span>')
        .replace(/<passive>/g, '<span class="passive">')
        .replace(/<\/passive>/g, '</span>')
        .replace(/<lol-uikit-tooltipped-keyword[^>]*>/g, '<span class="keyword">')
        .replace(/<\/lol-uikit-tooltipped-keyword>/g, '</span>')
}
</script>

<style scoped>
.rune-detail {
  padding: 32px;
  color: #f0e6d2;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(200, 155, 60, 0.2);
  padding-bottom: 24px;
}

.rune-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 10px rgba(200, 155, 60, 0.5));
}

.header-text h1 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #f0e6d2;
}

.rune-id {
  color: #a09b8c;
  font-family: "Spiegel", sans-serif;
  font-size: 14px;
}

.description-section h3, .meta-section h3 {
    font-family: "BeaufortforLOL-Bold", serif;
    color: #c8aa6e;
    margin-bottom: 16px;
    font-size: 20px;
}

.rune-desc {
    font-size: 16px;
    line-height: 1.6;
    color: #a09b8c;
}

/* Rune Description Styling */
:deep(.rune-desc .attention) {
    color: #f0e6d2;
    font-weight: bold;
}

:deep(.rune-desc .active) {
    color: #c8aa6e;
    font-weight: bold;
}

:deep(.rune-desc .passive) {
     color: #c8aa6e;
    font-weight: bold;
}

:deep(.rune-desc .keyword) {
    color: #0ac8b9;
    font-weight: bold;
}

:deep(.rune-divider) {
    border: 0;
    border-top: 1px solid rgba(200, 155, 60, 0.2);
    margin: 16px 0;
}

.meta-section {
    margin-top: 32px;
    background: rgba(200, 155, 60, 0.05);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid rgba(200, 155, 60, 0.1);
}

.stats-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.stats-list li {
    color: #a09b8c;
    margin-bottom: 8px;
    font-size: 14px;
}

.stats-list li::before {
    content: "•";
    color: #c8aa6e;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}
</style>
