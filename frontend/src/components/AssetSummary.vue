<template>
  <div class="bg-white overflow-hidden shadow rounded-lg p-5">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">My Assets</h3>
      <router-link to="/assets" class="text-sm font-medium text-blue-600 hover:text-blue-500">
        View All
      </router-link>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-12 bg-gray-100 rounded w-full"></div>
      <div class="h-12 bg-gray-100 rounded w-full"></div>
    </div>

    <div v-else-if="assets.length === 0" class="text-center py-6">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="mt-2 text-sm text-gray-500">No assets assigned</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="category in categories" :key="category.name" 
           class="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition cursor-pointer"
           @click="$router.push('/assets')">
        
        <div class="h-10 w-10 rounded-full flex items-center justify-center mb-2" :class="getCategoryColor(category.name)">
          <!-- Dynamic Icon -->
          <svg v-if="getCategoryIcon(category.name) === 'computer'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <svg v-else-if="getCategoryIcon(category.name) === 'vehicle'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <svg v-else-if="getCategoryIcon(category.name) === 'phone'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <svg v-else-if="getCategoryIcon(category.name) === 'tool'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        
        <span class="text-2xl font-bold text-gray-900">{{ category.count }}</span>
        <span class="text-xs text-gray-500 truncate w-full">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { createResource } from 'frappe-ui'
import { session } from '../data/session'

const loading = ref(true)
const assets = ref([])

const categories = computed(() => {
  const cats = {}
  assets.value.forEach(asset => {
    const cat = asset.asset_category || 'Other'
    cats[cat] = (cats[cat] || 0) + 1
  })
  return Object.entries(cats).map(([name, count]) => ({ name, count }))
})

const getCategoryIcon = (name) => {
  const n = name.toLowerCase()
  if (n.includes('computer') || n.includes('laptop') || n.includes('monitor')) return 'computer'
  if (n.includes('vehicle') || n.includes('car') || n.includes('truck')) return 'vehicle'
  if (n.includes('phone') || n.includes('mobile')) return 'phone'
  if (n.includes('machinery') || n.includes('tool')) return 'tool'
  return 'box'
}

const getCategoryColor = (name) => {
  const n = name.toLowerCase()
  if (n.includes('computer') || n.includes('laptop')) return 'bg-blue-500'
  if (n.includes('vehicle') || n.includes('car')) return 'bg-green-500'
  if (n.includes('phone')) return 'bg-purple-500'
  if (n.includes('machinery')) return 'bg-orange-500'
  return 'bg-gray-500'
}

const fetchAssets = async () => {
  if (!session.employee) return
  loading.value = true
  try {
    const call = createResource({
      url: 'employee_portal.api.get_employee_assets'
    })
    const data = await call.fetch()
    assets.value = data.assets || []
  } catch (e) {
    console.error('Failed to fetch assets', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (session.initialized && session.employee) {
    fetchAssets()
  } else {
    // Retry if session not ready
    const interval = setInterval(() => {
      if (session.employee) {
        clearInterval(interval)
        fetchAssets()
      }
    }, 500)
    // Clear interval after 5s to prevent infinite loop
    setTimeout(() => clearInterval(interval), 5000)
  }
})
</script>
