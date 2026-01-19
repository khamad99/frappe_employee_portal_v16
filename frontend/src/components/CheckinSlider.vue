<template>
  <div class="relative w-full h-16 bg-gray-100 rounded-full overflow-hidden select-none" ref="container">
    <div
      class="absolute top-0 bottom-0 left-0 bg-green-500 transition-all duration-75 flex items-center justify-center text-white font-bold"
      :style="{ width: width + 'px', opacity: width > 50 ? 1 : 0 }"
    >
        <span v-if="width > containerWidth * 0.8">Completed!</span>
    </div>
    
    <div
      class="absolute top-1 bottom-1 left-1 w-14 h-14 bg-white rounded-full shadow-md cursor-grab flex items-center justify-center z-10"
      :class="{ 'cursor-grabbing': dragging, 'transition-all duration-300': !dragging }"
      :style="{ transform: `translateX(${position}px)` }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <ArrowRight class="text-gray-600" />
    </div>

    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span class="text-gray-500 font-medium transition-opacity duration-200" :style="{ opacity: 1 - (position / (containerWidth - 60)) }">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    default: 'Slide to Check In'
  },
  loading: Boolean
})

const emit = defineEmits(['confirmed'])

const container = ref(null)
const dragging = ref(false)
const position = ref(0)
const containerWidth = ref(0)
const width = ref(0)

const updateWidth = () => {
  if (container.value) {
    containerWidth.value = container.value.clientWidth
  }
}

const startDrag = (e) => {
  if (props.loading) return
  dragging.value = true
  const startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
  
  const handleMove = (moveEvent) => {
    if (!dragging.value) return
    const currentX = moveEvent.type === 'mousemove' ? moveEvent.clientX : moveEvent.touches[0].clientX
    const diff = currentX - startX
    const maxPos = containerWidth.value - 60 // 60 is knob width + margin
    
    position.value = Math.max(0, Math.min(diff, maxPos))
    width.value = position.value + 30 // Approximate fill width
  }
  
  const handleEnd = () => {
    dragging.value = false
    const maxPos = containerWidth.value - 60
    if (position.value > maxPos * 0.9) {
      position.value = maxPos
      emit('confirmed')
    } else {
      position.value = 0
      width.value = 0
    }
    
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
    window.removeEventListener('touchmove', handleMove)
    window.removeEventListener('touchend', handleEnd)
  }

  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseup', handleEnd)
  window.addEventListener('touchmove', handleMove)
  window.addEventListener('touchend', handleEnd)
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>
