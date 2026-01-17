<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle: string
  icon: string
  features: string[]
}>()
</script>

<template>
  <div class="generic-view">
    <div class="view-header">
      <h1>{{ title }}</h1>
      <p class="view-subtitle">{{ subtitle }}</p>
    </div>

    <div class="coming-soon">
      <h2>{{ icon }} Under Construction</h2>
      <p>This section is coming soon!</p>
      <ul class="feature-list" v-if="features.length">
        <li v-for="(feature, idx) in features" :key="idx">✨ {{ feature }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.generic-view {
  padding: var(--spacing-xl);
}

.view-header h1 {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 2.5rem;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
}

.view-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-2xl);
}

.coming-soon {
  text-align: center;
  padding: var(--spacing-3xl);
  background: rgba(28, 35, 51, 0.6);
  border-radius: var(--radius-xl);
  border: 2px solid rgba(200, 155, 60, 0.2);
  backdrop-filter: blur(10px);
}

.coming-soon h2 {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: var(--spacing-lg);
}

.feature-list {
  list-style: none;
  margin-top: var(--spacing-xl);
  display: inline-block;
  text-align: left;
}

.feature-list li {
  padding: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 1.1rem;
}
</style>
