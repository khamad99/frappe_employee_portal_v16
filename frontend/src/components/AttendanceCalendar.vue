<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="flex space-x-2">
        <button @click="prevMonth" class="p-1 rounded hover:bg-gray-100">
          <ChevronLeft class="w-5 h-5 text-gray-600" />
        </button>
        <button @click="nextMonth" class="p-1 rounded hover:bg-gray-100">
          <ChevronRight class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <div v-for="day in daysOfWeek" :key="day" class="text-center text-xs font-medium text-gray-500 py-1">
        {{ day }}
      </div>
      
      <div v-for="(date, index) in calendarDays" :key="index" class="h-10 flex items-center justify-center relative">
        <div 
          v-if="date"
          class="w-8 h-8 flex items-center justify-center rounded-full text-sm"
          :class="getStatusColor(date)"
        >
          {{ date.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { createResource } from 'frappe-ui'
import { session } from '../data/session'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(new Date())

const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }))
const currentYear = computed(() => currentDate.value.getFullYear())

const attendanceData = ref({})

const fetchAttendance = async () => {
  if (!session.employee) return

  const startDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const endDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)

  // Using simple date strings for filter 'yyyy-mm-dd'
  const formatDate = (d) => d.toISOString().split('T')[0]

  const call = createResource({
    url: 'frappe.client.get_list',
    params: {
      doctype: 'Attendance',
      filters: {
        employee: session.employee.name,
        attendance_date: ['between', [formatDate(startDate), formatDate(endDate)]]
      },
      fields: ['attendance_date', 'status']
    }
  })
  
  try {
    const data = await call.fetch()
    const map = {}
    data.forEach(record => {
      map[record.attendance_date] = record.status
    })
    attendanceData.value = map
  } catch (e) {
    console.error(e)
  }
}

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  const startPadding = firstDay.getDay() // 0 for Sunday
  
  for (let i = 0; i < startPadding; i++) {
    days.push(null)
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  
  return days
})

const getStatusColor = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  const status = attendanceData.value[dateStr]
  
  if (!status) return 'text-gray-700 hover:bg-gray-50'
  
  switch(status) {
    case 'Present': return 'bg-green-100 text-green-800 font-bold'
    case 'Absent': return 'bg-red-100 text-red-800'
    case 'On Leave': return 'bg-yellow-100 text-yellow-800'
    case 'Half Day': return 'bg-yellow-50 text-yellow-800' // Visual distinction
    default: return 'bg-gray-100 text-gray-800'
  }
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

watch(currentDate, () => {
  fetchAttendance()
})

onMounted(() => {
  if (session.initialized) {
      fetchAttendance()
  } else {
      // Small timeout or watcher on session could be better, but for now:
      setTimeout(fetchAttendance, 1000)
  }
})
</script>
