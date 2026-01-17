<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" role="dialog" aria-modal="true">
          <!-- Close Button -->
          <button class="close-button" @click="$emit('close')">
            <span class="close-icon">×</span>
          </button>

          <!-- Content -->
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue"

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit("close")
  }
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.visible) {
    emit("close")
  }
}

// Lock body scroll when modal is open
watch(
  () => props.visible,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
)

onMounted(() => {
  document.addEventListener("keydown", handleEsc)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc)
  document.body.style.overflow = ""
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 14, 27, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 32px;
}

.modal-container {
  background: rgba(28, 35, 51, 0.95);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 20px;
  border: 1px solid rgba(200, 155, 60, 0.3);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(200, 155, 60, 0.1);
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Custom scrollbar for modal */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: rgba(10, 14, 27, 0.5);
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(200, 155, 60, 0.3);
  border-radius: 4px;
}

.close-button {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(10, 14, 27, 0.6);
  border: 1px solid rgba(200, 155, 60, 0.3);
  color: #f0e6d2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(200, 155, 60, 0.2);
  border-color: #c8aa6e;
  transform: rotate(90deg);
}

.close-icon {
  font-size: 24px;
  line-height: 1;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
}
</style>
