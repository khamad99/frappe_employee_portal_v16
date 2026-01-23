<template>
  <div class="relative w-full h-16 bg-gray-100 rounded-full overflow-hidden select-none" ref="container" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <!-- Background for Checked In state -->
    <div
      class="absolute top-0 bottom-0 left-0 bg-green-100 transition-all duration-75 flex items-center justify-center text-green-800 font-bold"
      :style="{ width: isCheckedIn ? (dragging ? width + 'px' : '100%') : width + 'px', opacity: 1 }"
    >
    </div>

    <!-- Center Text -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <span class="text-gray-600 font-medium text-sm text-center px-16">
        {{ centerText || label }}
      </span>
    </div>
    
    <!-- Knob -->
    <div
      class="absolute top-1 bottom-1 w-14 h-14 bg-white rounded-full shadow-md cursor-grab flex items-center justify-center z-10"
      :class="{ 'cursor-grabbing': dragging, 'transition-all duration-300': !dragging }"
      :style="{ transform: `translateX(${position}px)` }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <ArrowRight v-if="!isCheckedIn" class="text-gray-600" />
      <ArrowLeft v-else class="text-gray-600" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ArrowRight, ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    default: 'Slide to Check In'
  },
  centerText: String,
  status: {
    type: String,
    default: 'OUT' // 'IN' or 'OUT'
  },
  loading: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['confirmed', 'update:status'])

const container = ref(null)
const dragging = ref(false)
const position = ref(0)
const containerWidth = ref(0)
const width = ref(0)

const isCheckedIn = computed(() => props.status === 'IN')

/* Initialize Position based on Status */
const resetPosition = () => {
    if (!container.value) return
    const maxPos = containerWidth.value - 60
    if (isCheckedIn.value) {
        position.value = maxPos
        width.value = maxPos + 60
    } else {
        position.value = 0
        width.value = 60
    }
}

watch(() => props.status, resetPosition)

const updateWidth = () => {
  if (container.value) {
    containerWidth.value = container.value.clientWidth
    resetPosition()
  }
}

const startDrag = (e) => {
  if (props.loading || props.disabled) return
  dragging.value = true
  const startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
  const startPos = position.value
  
  const handleMove = (moveEvent) => {
    if (!dragging.value) return
    const currentX = moveEvent.type === 'mousemove' ? moveEvent.clientX : moveEvent.touches[0].clientX
    const diff = currentX - startX
    const maxPos = containerWidth.value - 60
    
    let newPos = startPos + diff
    newPos = Math.max(0, Math.min(newPos, maxPos))
    
    position.value = newPos
    width.value = newPos + 30
  }
  
  const handleEnd = () => {
    dragging.value = false
    const maxPos = containerWidth.value - 60
    
    if (isCheckedIn.value) {
        // Slide Left to Logout
        // If dragged to left (< 10%)
        if (position.value < maxPos * 0.1) {
             position.value = 0
             emit('confirmed', 'OUT')
        } else {
             resetPosition() // Bounce back to Right
        }
    } else {
        // Slide Right to Login
        // If dragged to right (> 90%)
        if (position.value > maxPos * 0.9) {
             position.value = maxPos
             emit('confirmed', 'IN')
        } else {
             resetPosition() // Bounce back to Left
        }
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
  // Initial reset after mount
  setTimeout(resetPosition, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>
