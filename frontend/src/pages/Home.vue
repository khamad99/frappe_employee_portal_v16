<template>
  <MainLayout>
    <div class="space-y-6">
        <div v-if="!session.employee" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
                <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                        No Employee record found linked to your account. Please contact HR to link your User ID to an Employee profile.
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="space-y-6">
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <!-- Components will go here -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Attendance Card -->
             <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                 <h3 class="text-lg font-medium text-gray-900">Today's Attendance</h3>
                 <div class="mt-4">
                     <!-- Slider Component Placeholder -->
                     <CheckinSlider 
                        :label="sliderLabel" 
                        :loading="loadingCheckin"
                        @confirmed="handleCheckin" 
                     />
                 </div>
             </div>

              <!-- Financial Summary Card -->
             <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                 <FinancialSummary />
             </div>
         </div>

         <!-- Calendar Section -->
         <div class="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Leave & Attendance</h3>
              <AttendanceCalendar />
         </div>
         </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import CheckinSlider from '@/components/CheckinSlider.vue'
import AttendanceCalendar from '@/components/AttendanceCalendar.vue'
import FinancialSummary from '@/components/FinancialSummary.vue'
import { ref, onMounted, computed } from 'vue'
import { session } from '@/data/session'
import { createResource } from 'frappe-ui'

const lastCheckin = ref(null)
const loadingCheckin = ref(true)

const sliderLabel = computed(() => {
  if (loadingCheckin.value) return 'Loading...'
  if (lastCheckin.value && lastCheckin.value.log_type === 'IN') {
    return 'Slide to Check Out'
  }
  return 'Slide to Check In'
})

const fetchLastCheckin = async () => {
    if (!session.employee) return
    loadingCheckin.value = true
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Employee Checkin',
            filters: { employee: session.employee.name },
            order_by: 'time desc',
            limit: 1,
            fields: ['log_type', 'time', 'name']
        }
    })
    try {
        const data = await call.fetch()
        if (data && data.length > 0) {
            lastCheckin.value = data[0]
        } else {
            lastCheckin.value = null
        }
    } catch (e) {
        console.error(e)
    } finally {
        loadingCheckin.value = false
    }
}

const handleCheckin = async () => {
    if (!session.employee) return
    
    const logType = (lastCheckin.value && lastCheckin.value.log_type === 'IN') ? 'OUT' : 'IN'
    
    // We need to create a new Employee Checkin
    const call = createResource({
        url: 'frappe.client.insert',
        params: {
            doc: {
                doctype: 'Employee Checkin',
                employee: session.employee.name,
                log_type: logType,
                time: new Date().toISOString().replace('T', ' ').split('.')[0] // Frappe datetime format
            }
        }
    })
    
    try {
        await call.fetch()
        // Refresh status
        await fetchLastCheckin()
        // Ideally show success toast
    } catch (e) {
        console.error(e)
        alert('Check-in failed: ' + (e.messages ? e.messages.join('\n') : e.message))
    }
}

onMounted(async () => {
   if (session.initialized && session.employee) {
       fetchLastCheckin()
   } else {
       setTimeout(() => {
           if(session.employee) fetchLastCheckin()
       }, 1000)
   }
})
</script>
