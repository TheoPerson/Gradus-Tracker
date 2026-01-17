<template>
  <div class="spell-card" @click="$emit('select', spell)">
    <div class="spell-icon">
      <img :src="iconUrl" :alt="spell.name" />
      <div class="spell-cooldown">{{ spell.cooldownBurn }}s</div>
    </div>
    <div class="spell-info">
      <h3>{{ spell.name }}</h3>
      <p class="spell-desc">{{ cleanDescription }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { SummonerSpellData } from "../../services/summonerSpellsAPI"
import { getSummonerSpellIcon } from "../../services/summonerSpellsAPI"

const props = defineProps<{
  spell: SummonerSpellData
}>()

defineEmits<{
  (e: "select", spell: SummonerSpellData): void
}>()

const iconUrl = computed(() => getSummonerSpellIcon(props.spell.image.full))
const cleanDescription = computed(() => {
  return props.spell.description.replace(/<[^>]*>/g, "")
})
</script>

<style scoped>
.spell-card {
  background: rgba(9, 15, 25, 0.8);
  border: 1px solid rgba(200, 170, 110, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.spell-card:hover {
  transform: translateY(-4px);
  border-color: rgba(200, 170, 110, 0.5);
  background: rgba(9, 15, 25, 0.95);
  box-shadow: 0 8px 24px rgba(200, 170, 110, 0.15);
}

.spell-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 2px solid rgba(200, 170, 110, 0.3);
}

.spell-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spell-cooldown {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  font-size: 11px;
  color: #f0e6d2;
  text-align: center;
  padding: 2px;
  font-family: "Spiegel", sans-serif;
}

.spell-info {
  flex: 1;
  min-width: 0;
}

.spell-info h3 {
  font-family: "BeaufortforLOL-Bold", serif;
  font-size: 14px;
  color: #f0e6d2;
  margin: 0 0 6px 0;
}

.spell-desc {
  font-size: 12px;
  color: #a09b8c;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
