<script setup lang="ts">
import Modal from "./Modal.vue"

defineProps<{
  visible: boolean
  title: string
  subtitle?: string
  imageUrl: string
  description?: string
  footerText?: string
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()
</script>

<template>
  <Modal :visible="visible" @close="emit('close')">
    <div class="asset-modal-content">
      <div class="asset-header">
        <h2>{{ title }}</h2>
        <p v-if="subtitle" class="asset-subtitle">{{ subtitle }}</p>
      </div>

      <div class="asset-body">
        <div class="image-container">
          <img :src="imageUrl" :alt="title" />
        </div>
        
        <div v-if="description" class="asset-description">
          <p>{{ description }}</p>
        </div>
      </div>
      
      <div v-if="footerText" class="asset-footer">
        <p>{{ footerText }}</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.asset-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-md);
}

.asset-header h2 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: var(--spacing-xs);
}

.asset-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.image-container {
  background: radial-gradient(circle, rgba(200, 155, 60, 0.1) 0%, transparent 70%);
  padding: var(--spacing-xl);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  max-width: 256px; /* Limit size */
  max-height: 256px;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
  transition: transform var(--transition-slow);
}

.image-container:hover img {
  transform: scale(1.05);
}

.asset-description {
  max-width: 400px;
  color: var(--text-primary);
  line-height: 1.6;
  font-style: italic;
  padding: var(--spacing-md);
  background: rgba(28, 35, 51, 0.4);
  border-radius: var(--radius-md);
  border: 1px solid rgba(240, 230, 210, 0.1);
}

.asset-footer {
  margin-top: var(--spacing-md);
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>
