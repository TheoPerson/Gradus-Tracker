<script setup lang="ts">
import { ref, onMounted } from "vue"

const props = defineProps<{
  message?: string
}>()

const isVisible = ref(true)

// Auto-hide after mount (simulate loading completion)
onMounted(() => {
  // In real use, parent controls visibility
  // This is just for demo purposes
})
</script>

<template>
  <transition name="fade">
    <div v-if="isVisible" class="hextech-loader">
      <div class="loader-container">
        <!-- Hextech-inspired hexagonal loader -->
        <div class="hexagon-wrapper">
          <div class="hexagon hex-1"></div>
          <div class="hexagon hex-2"></div>
          <div class="hexagon hex-3"></div>
        </div>
        <p class="loading-text">{{ message || "Loading League Data..." }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.hextech-loader {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.hexagon-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.hexagon {
  position: absolute;
  width: 100px;
  height: 100px;
  background: transparent;
  border: 3px solid var(--primary);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: hexRotate 3s linear infinite;
}

.hex-1 {
  animation-delay: 0s;
  border-color: var(--primary);
}

.hex-2 {
  animation-delay: 1s;
  border-color: var(--accent-blue);
  opacity: 0.7;
}

.hex-3 {
  animation-delay: 2s;
  border-color: var(--primary-light);
  opacity: 0.5;
}

@keyframes hexRotate {
  0% {
    transform: rotate(0deg) scale(1);
    box-shadow: 0 0 20px var(--primary);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
    box-shadow: 0 0 60px var(--primary), 0 0 100px var(--accent-blue);
  }
  100% {
    transform: rotate(360deg) scale(1);
    box-shadow: 0 0 20px var(--primary);
  }
}

.loading-text {
  font-family: "BeaufortforLOL Bold", serif;
  font-size: 1.5rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 3px;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 10px var(--primary);
  }
  50% {
    opacity: 0.6;
    text-shadow: 0 0 20px var(--primary), 0 0 30px var(--accent-blue);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
