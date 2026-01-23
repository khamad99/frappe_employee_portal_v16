<template>
  <MainLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Expense Claims</h2>
      <router-link to="/expense/new">
        <Button variant="solid">
            <Plus class="w-4 h-4 mr-2" />
            New Claim
        </Button>
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-4">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          @click="currentTab = 'Pending'" 
          :class="[currentTab === 'Pending' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']"
        >
          Pending
        </button>
        <button 
          @click="currentTab = 'Submitted'" 
          :class="[currentTab === 'Submitted' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']"
        >
          Submitted
        </button>
      </nav>
    </div>

    <div v-if="error" class="bg-red-50 p-4 rounded-md mb-4 text-red-700">
        {{ error }}
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200" v-if="filteredExpenses.length">
        <li v-for="expense in filteredExpenses" :key="expense.name">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" @click="$router.push(`/expense/${expense.name}`)">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ expense.name }}
                </p>
                <div class="ml-2 flex-shrink-0 flex items-center">
                   <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-green-100 text-green-800': expense.docstatus === 1 || expense.workflow_state === 'Approved',
                        'bg-yellow-100 text-yellow-800': expense.docstatus === 0 && !['Need Review', 'Submitted'].includes(expense.workflow_state),
                        'bg-blue-100 text-blue-800': expense.docstatus === 0 && ['Need Review', 'Submitted'].includes(expense.workflow_state)
                    }"
                  >
                    {{ 
                        ['Need Review', 'Submitted'].includes(expense.workflow_state) ? 'In Review' :
                        (expense.docstatus === 1 ? 'Submitted' : (expense.workflow_state || 'Draft')) 
                    }}
                  </span>
                  <button 
                      v-if="expense.docstatus === 0 && !['Need Review', 'Submitted', 'Approved'].includes(expense.workflow_state)" 
                      @click.stop="deleteExpense(expense.name)" 
                      class="ml-3 text-red-400 hover:text-red-600 focus:outline-none"
                      title="Delete Claim"
                  >
                      <Trash class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                   <p class="flex items-center text-sm text-gray-500">
                    <DollarSign class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ formatCurrency(expense.total_claimed_amount + (expense.total_vat_amount || 0)) }}
                  </p>
                  <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ expense.posting_date }}
                  </p>
                </div>
              </div>
            </div>
        </li>
      </ul>
      <div v-else class="p-4 text-center text-gray-500">
          No {{ currentTab.toLowerCase() }} expense claims found.
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { Plus, DollarSign, Calendar, Trash } from 'lucide-vue-next'
import { createResource } from 'frappe-ui'
import { session } from '@/data/session'

const allExpenses = ref([])
const error = ref('')
const currentTab = ref('Pending')

const filteredExpenses = computed(() => {
    return allExpenses.value.filter(expense => {
        // Common: Exclude Cancelled (docstatus 2 or 'Cancelled')
        if (expense.docstatus === 2 || expense.workflow_state === 'Cancelled') return false

        const state = expense.workflow_state
        // "Need Review" is now considered a "Pending" state (Pending Approval)
        const isPendingState = !state || ['Pending', 'Draft', 'Need Review'].includes(state)
        
        if (currentTab.value === 'Pending') {
            return isPendingState
        } else {
            // Submitted Tab now mostly contains 'Approved' or 'Submitted' (if final)
            return !isPendingState
        }
    })
})

const fetchExpenses = async () => {
    if (!session.employee) return
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Expense Claim',
            filters: { 
                employee: session.employee.name,
                docstatus: ['<', 2] // Exclude Cancelled (2) from DB fetch
            },
            fields: ['name', 'posting_date', 'total_claimed_amount', 'total_vat_amount', 'docstatus', 'workflow_state'],
            order_by: 'creation desc',
            limit_page_length: 100
        }
    })
    try {
        allExpenses.value = await call.fetch()
    } catch (e) {
        console.error(e)
        error.value = 'Failed to fetch expenses'
    }
}

const deleteExpense = async (name) => {
    if (!confirm('Are you sure you want to delete this expense claim?')) return
    
    try {
        await createResource({
            url: 'employee_portal.api.delete_expense_claim',
            params: { name }
        }).fetch()
        
        // Optimistic update: Remove from local list immediately
        allExpenses.value = allExpenses.value.filter(e => e.name !== name)
        
        // Background re-fetch to ensure sync
        fetchExpenses()
    } catch (e) {
        console.error(e)
        error.value = 'Failed to delete expense claim'
    }
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)

onMounted(() => {
    if (session.initialized && session.employee) {
        fetchExpenses()
    } else {
        setTimeout(() => {
            if (session.employee) {
                fetchExpenses()
            }
        }, 1000)
    }
})
</script>
