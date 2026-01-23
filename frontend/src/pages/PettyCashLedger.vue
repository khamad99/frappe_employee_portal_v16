<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div class="md:grid md:grid-cols-3 md:gap-6 md:items-center">
          <div class="md:col-span-2">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Petty Cash</h3>
            <p class="mt-1 text-sm text-gray-500">
               Current Balance: <span class="font-bold text-gray-900">{{ formatCurrency(currentBalance) }}</span>
            </p>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-1 flex justify-end">
             <button @click="showFilters = !showFilters" type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
             </button>
          </div>
        </div>
        
        <!-- Filters -->
        <div v-if="showFilters" class="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">From Date</label>
                <input type="date" v-model="filters.from_date" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            </div>
             <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">To Date</label>
                <input type="date" v-model="filters.to_date" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            </div>
            
             <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Cost Center</label>
                <div class="mt-1">
                     <Autocomplete 
                        :options="costCenters"
                        v-model="costCenterSearch"
                        placeholder="Search Cost Center"
                        @update:modelValue="addCostCenter"
                     />
                     <div class="mt-2 flex flex-wrap gap-2">
                         <span v-for="cc in filters.cost_center" :key="cc" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ cc }}
                            <button @click="removeCostCenter(cc)" class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none">x</button>
                         </span>
                     </div>
                </div>
            </div>

             <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Project</label>
                 <div class="mt-1">
                     <Autocomplete 
                        :options="projects"
                        v-model="projectSearch"
                        placeholder="Search Project"
                        @update:modelValue="addProject"
                     />
                     <div class="mt-2 flex flex-wrap gap-2">
                         <span v-for="pj in filters.project" :key="pj" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {{ pj }}
                            <button @click="removeProject(pj)" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none">x</button>
                         </span>
                     </div>
                </div>
            </div>
            
             <div class="sm:col-span-2 flex items-end">
                <button @click="fetchLedger" class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    Apply
                </button>
            </div>
             <!-- Add more filters like Cost Center later if needed by UI library support -->
        </div>
      </div>

      <!-- Ledger Table -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                     <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading">
                      <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                  </tr>
                  <tr v-else-if="ledger.length === 0">
                       <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No transactions found</td>
                  </tr>
                  <tr v-for="(entry, index) in ledger" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ entry.posting_date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ entry.voucher_type }} <br> {{ entry.voucher_no }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="entry.remarks">{{ entry.remarks }}</td>
                     <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{{ entry.debit > 0 ? formatNumber(entry.debit) : '-' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{{ entry.credit > 0 ? formatNumber(entry.credit) : '-' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{{ formatNumber(entry.balance) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, reactive, onMounted } from 'vue'
import { createResource, Autocomplete } from 'frappe-ui'
import { session } from '@/data/session'

const showFilters = ref(false)
const loading = ref(true)
const ledger = ref([])
const currentBalance = ref(0)
const currency = ref('AED')

// Default date range: current month
const today = new Date()
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

const costCenters = ref([])
const projects = ref([])
const costCenterSearch = ref('')
const projectSearch = ref('')

const filters = reactive({
    from_date: firstDay.toISOString().split('T')[0],
    to_date: today.toISOString().split('T')[0],
    cost_center: [],
    project: []
})

const fetchCostCenters = async () => {
    try {
        const call = createResource({
            url: 'employee_portal.api.get_cost_centers',
            method: 'GET'
        })
        const data = await call.fetch()
        costCenters.value = data
    } catch (e) {
        console.error("Failed to fetch cost centers", e)
    }
}

const fetchProjects = async () => {
    try {
        const call = createResource({
            url: 'employee_portal.api.get_projects',
            method: 'GET'
        })
        const data = await call.fetch()
        projects.value = data
    } catch (e) {
        console.error("Failed to fetch projects", e)
    }
}

const addCostCenter = (text) => {
    // Autocomplete v-model updates text. We need to watch that or use the event.
    // However, frappe-ui Autocomplete might behave differently. 
    // Usually it emits update:modelValue with the selected object/value.
    if (text && text.value && !filters.cost_center.includes(text.value)) {
        filters.cost_center.push(text.value)
    } else if (typeof text === 'string' && text && !filters.cost_center.includes(text)) {
         filters.cost_center.push(text)
    }
    costCenterSearch.value = ''
}

const removeCostCenter = (val) => {
    filters.cost_center = filters.cost_center.filter(c => c !== val)
}

const addProject = (text) => {
    if (text && text.value && !filters.project.includes(text.value)) {
        filters.project.push(text.value)
    } else if (typeof text === 'string' && text && !filters.project.includes(text)) {
         filters.project.push(text)
    }
    projectSearch.value = ''
}

const removeProject = (val) => {
     filters.project = filters.project.filter(p => p !== val)
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const formatNumber = (value) => {
     return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const fetchBalance = async () => {
    try {
        const call = createResource({
            url: 'employee_portal.api.get_petty_cash_balance',
            method: 'GET'
        })
        const data = await call.fetch()
        currentBalance.value = data.balance || 0
        currency.value = data.currency || 'AED'
    } catch (e) {
        console.error(e)
    }
}

const fetchLedger = async () => {
    loading.value = true
    try {
        const call = createResource({
            url: 'employee_portal.api.get_petty_cash_ledger',
            method: 'GET',
            params: {
                from_date: filters.from_date,
                to_date: filters.to_date,
                from_date: filters.from_date,
                to_date: filters.to_date,
                cost_center: JSON.stringify(filters.cost_center),
                project: JSON.stringify(filters.project)
            }
        })
        ledger.value = await call.fetch()
    } catch (e) {
        console.error(e)
        // Check if error is 'Petty cash not enabled'
        if (e.message && e.message.includes("not enabled")) {
             alert('Petty Cash is not enabled for your account.')
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (session.initialized && session.permissions?.can_petty_cash) {
        fetchBalance()
        fetchLedger()
        fetchCostCenters()
        fetchProjects()
    }
})
</script>
