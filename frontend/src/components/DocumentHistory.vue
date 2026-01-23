<template>
  <div class="history-container" v-if="history.length > 0">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <Clock class="w-5 h-5 mr-2 text-gray-500" />
      Document History
    </h3>
    
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <!-- Timeline entries -->
      <div class="space-y-4">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          class="relative flex items-start pl-10"
        >
          <!-- Status indicator -->
          <div 
            class="absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white"
            :class="getStatusColor(item.type)"
          >
            <component :is="getIcon(item.type)" class="w-3 h-3 text-white" />
          </div>
          
          <!-- Content -->
          <div class="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-gray-900 text-sm">{{ item.user }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(item.timestamp) }}</span>
            </div>
            <p class="text-sm text-gray-600" v-html="item.content"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading state -->
  <div v-else-if="loading" class="flex items-center justify-center py-8">
    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    <span class="ml-2 text-gray-500 text-sm">Loading history...</span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { createResource } from 'frappe-ui'
import { Clock, FileText, CheckCircle, XCircle, Send, MessageSquare, Info } from 'lucide-vue-next'

const props = defineProps({
  docname: {
    type: String,
    required: true
  }
})

const history = ref([])
const loading = ref(false)

const getStatusColor = (type) => {
  const colors = {
    'Created': 'bg-blue-500',
    'Workflow': 'bg-indigo-500',
    'Submitted': 'bg-green-500',
    'Cancelled': 'bg-red-500',
    'Comment': 'bg-gray-500',
    'Info': 'bg-yellow-500'
  }
  return colors[type] || 'bg-gray-400'
}

const getIcon = (type) => {
  const icons = {
    'Created': FileText,
    'Workflow': Send,
    'Submitted': CheckCircle,
    'Cancelled': XCircle,
    'Comment': MessageSquare,
    'Info': Info
  }
  return icons[type] || Info
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

const fetchHistory = async () => {
  if (!props.docname) return
  
  loading.value = true
  try {
    const call = createResource({
      url: 'employee_portal.api.get_expense_claim_history',
      params: { name: props.docname }
    })
    history.value = await call.fetch()
  } catch (e) {
    console.error('Failed to fetch history:', e)
    history.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.docname, (newVal) => {
  if (newVal) fetchHistory()
}, { immediate: true })

onMounted(() => {
  if (props.docname) fetchHistory()
})
</script>

<style scoped>
.history-container {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
