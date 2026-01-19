<template>
  <MainLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Attendance History</h2>
    </div>

    <!-- Filter (Month) could go here -->

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="attendance.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
               <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in attendance" :key="record.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ record.attendance_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-green-100 text-green-800': record.status === 'Present',
                        'bg-red-100 text-red-800': record.status === 'Absent',
                        'bg-yellow-100 text-yellow-800': record.status === 'On Leave' || record.status === 'Half Day'
                    }"
                  >
                  {{ record.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ record.shift }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <div v-else class="p-6 text-center text-gray-500">
          No attendance records found.
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { createResource } from 'frappe-ui'
import { session } from '@/data/session'

const attendance = ref([])

const fetchAttendance = async () => {
    if (!session.employee) return
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Attendance',
            filters: { employee: session.employee.name },
            fields: ['name', 'attendance_date', 'status', 'shift'],
            order_by: 'attendance_date desc',
            limit_page_length: 50
        }
    })
    try {
        attendance.value = await call.fetch()
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    if (session.initialized && session.employee) {
        fetchAttendance()
    } else {
        setTimeout(() => {
             if (session.employee) fetchAttendance()
        }, 1000)
    }
})
</script>
