<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">My Assets</h1>
        <router-link to="/" class="text-sm text-gray-500 hover:text-gray-700"> Back to Dashboard </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow p-6 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="assets.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No assets assigned</h3>
          <p class="mt-1 text-sm text-gray-500">You don't have any assets assigned to you currently.</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <div v-for="(categoryAssets, category) in groupedAssets" :key="category">
          <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
             <span class="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold mr-2 uppercase tracking-wide">
                {{ category }}
             </span>
             <span class="text-gray-400 text-sm font-normal">{{ categoryAssets.length }} items</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="asset in categoryAssets" :key="asset.name" class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition duration-200 border border-gray-100 group">
                <!-- Image Header -->
                <div class="h-32 bg-gray-100 w-full overflow-hidden relative">
                    <img v-if="asset.image" :src="asset.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Asset Image" />
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                         <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                     </div>
                     <div class="absolute top-2 right-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm"
                            :class="{
                                'bg-yellow-100 text-yellow-800': asset.status === 'In Maintenance',
                                'bg-red-100 text-red-800': asset.status === 'Out of Order',
                            }">
                            {{ asset.status }}
                        </span>
                     </div>
                </div>

                <div class="p-5">
                    <div class="flex items-start justify-between">
                         <div>
                             <h3 class="text-lg leading-6 font-medium text-gray-900 truncate" :title="asset.asset_name">{{ asset.asset_name }}</h3>
                             <p class="text-sm text-gray-500 truncate">{{ asset.item_name }}</p>
                         </div>
                    </div>
                    
                    <div class="mt-4 border-t border-gray-100 pt-4 space-y-2">
                        <div class="flex items-center text-sm text-gray-500">
                             <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                             </svg>
                             {{ asset.location || 'No Location' }}
                        </div>
                        <div class="flex items-center text-sm text-gray-500">
                             <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                             </svg>
                             {{ asset.name }}
                        </div>
                         <div class="flex items-center text-sm text-gray-500" v-if="asset.purchase_date">
                             <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                             Assigned: {{ formatDate(asset.purchase_date) }}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { createResource } from 'frappe-ui'
import { session } from '@/data/session'

const loading = ref(true)
const assets = ref([])

const groupedAssets = computed(() => {
  const groups = {}
  assets.value.forEach(asset => {
    const category = asset.asset_category || 'Uncategorized'
    if (!groups[category]) groups[category] = []
    groups[category].push(asset)
  })
  return groups
})

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

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

onMounted(() => {
    if (session.initialized && session.employee) {
        fetchAssets()
    } else {
        setTimeout(() => {
             if (session.employee) fetchAssets()
        }, 1000)
    }
})
</script>
