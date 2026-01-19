<template>
  <MainLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Leave Applications</h2>
      <Button variant="solid" @click="showNewLeaveDialog = true">
         <Plus class="w-4 h-4 mr-2" />
         New Application
      </Button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 p-4 rounded-md mb-4 text-red-700">
        {{ error }}
    </div>

    <!-- List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200" v-if="leaveApplications.length">
        <li v-for="leave in leaveApplications" :key="leave.name">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ leave.leave_type }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-green-100 text-green-800': leave.status === 'Approved',
                        'bg-yellow-100 text-yellow-800': leave.status === 'Open',
                        'bg-red-100 text-red-800': leave.status === 'Rejected',
                        'bg-gray-100 text-gray-800': leave.status === 'Draft'
                    }"
                  >
                    {{ leave.status }}
                  </span>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ leave.from_date }} - {{ leave.to_date }}
                  </p>
                  <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ leave.total_leave_days }} days
                  </p>
                </div>
              </div>
            </div>
        </li>
      </ul>
      <div v-else class="p-4 text-center text-gray-500">
          No leave applications found.
      </div>
    </div>

    <!-- New Leave Dialog -->
    <Dialog v-model="showNewLeaveDialog" :options="{ title: 'New Leave Application', actions: [{ label: 'Submit', variant: 'solid', onClick: submitLeave, loading: submitting }] }">
        <template #body-content>
            <div class="space-y-4">
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Leave Type</label>
                    <select v-model="newLeave.leave_type" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option v-for="type in leaveTypes" :key="type.name" :value="type.name">{{ type.name }}</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-gray-700">From Date</label>
                        <input type="date" v-model="newLeave.from_date" class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">To Date</label>
                         <input type="date" v-model="newLeave.to_date" class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                     </div>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea v-model="newLeave.description" rows="3" class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>
            </div>
        </template>
    </Dialog>

  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, onMounted, reactive } from 'vue'
import { Plus, Calendar, Clock } from 'lucide-vue-next'
import { Dialog, createResource } from 'frappe-ui'
import { session } from '@/data/session'

const leaveApplications = ref([])
const leaveTypes = ref([])
const showNewLeaveDialog = ref(false)
const submitting = ref(false)
const error = ref('')

const newLeave = reactive({
    leave_type: '',
    from_date: '',
    to_date: '',
    description: ''
})

const fetchLeaves = async () => {
    if (!session.employee) return
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Leave Application',
            filters: { employee: session.employee.name },
            fields: ['name', 'leave_type', 'status', 'from_date', 'to_date', 'total_leave_days'],
            order_by: 'creation desc'
        }
    })
    try {
        leaveApplications.value = await call.fetch()
    } catch (e) {
        console.error(e)
        error.value = 'Failed to fetch leaves'
    }
}

const fetchLeaveTypes = async () => {
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Leave Type',
            fields: ['name']
        }
    })
    try {
        leaveTypes.value = await call.fetch()
    } catch (e) { console.error(e) }
}

const submitLeave = async () => {
    submitting.value = true
    error.value = ''
    
    const call = createResource({
        url: 'frappe.client.insert',
        params: {
            doc: {
                doctype: 'Leave Application',
                employee: session.employee.name,
                leave_type: newLeave.leave_type,
                from_date: newLeave.from_date,
                to_date: newLeave.to_date,
                description: newLeave.description,
                status: 'Open',
                docstatus: 0
            }
        }
    })

    try {
        await call.fetch()
        showNewLeaveDialog.value = false
        // Reset form
        newLeave.leave_type = ''
        newLeave.from_date = ''
        newLeave.to_date = ''
        newLeave.description = ''
        fetchLeaves()
    } catch (e) {
        console.error(e)
        error.value = e.messages ? e.messages.join('\n') : e.message
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    if (session.initialized && session.employee) {
        fetchLeaves()
        fetchLeaveTypes()
    } else {
        setTimeout(() => {
            if (session.employee) {
                 fetchLeaves()
                 fetchLeaveTypes()
            }
        }, 1000)
    }
})
</script>
