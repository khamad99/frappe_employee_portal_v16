<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900">Financial Summary</h3>
    <div class="mt-4 grid grid-cols-2 gap-4">
        <!-- Expenses -->
        <router-link to="/expense" class="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <p class="text-sm font-medium text-blue-600">Expense Claims</p>
             <p class="mt-1 text-2xl font-bold text-blue-900" v-if="expenses.loading">...</p>
            <p class="mt-1 text-2xl font-bold text-blue-900" v-else>{{ formatCurrency(expenses.total) }}</p>
            <p class="text-xs text-blue-500 mt-1">Pending Approval</p>
        </router-link>

        <!-- Advances -->
        <router-link to="/advances" class="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <p class="text-sm font-medium text-purple-600">Advances</p>
             <p class="mt-1 text-2xl font-bold text-purple-900" v-if="advances.loading">...</p>
            <p class="mt-1 text-2xl font-bold text-purple-900" v-else>{{ formatCurrency(advances.total) }}</p>
             <p class="text-xs text-purple-500 mt-1">Open Advances</p>
        </router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { createResource } from 'frappe-ui'
import { session } from '../data/session'

const expenses = reactive({
    total: 0,
    loading: true
})

const advances = reactive({
    total: 0,
    loading: true
})

const fetchExpenses = async () => {
    if (!session.employee) return
    expenses.loading = true
    try {
        const call = createResource({
            url: 'frappe.client.get_list',
            params: {
                doctype: 'Expense Claim',
                filters: {
                    employee: session.employee.name,
                    docstatus: 0 // Draft/Submitted
                },
                fields: ['total_claimed_amount']
            }
        })
        const data = await call.fetch()
        expenses.total = data.reduce((sum, item) => sum + item.total_claimed_amount, 0)
    } catch (e) {
        expenses.total = 0
    } finally {
        expenses.loading = false
    }
}

const fetchAdvances = async () => {
    if (!session.employee) return
    advances.loading = true
    try {
        const call = createResource({
            url: 'frappe.client.get_list',
            params: {
                doctype: 'Employee Advance',
                filters: {
                    employee: session.employee.name,
                    docstatus: 0 // Draft/Submitted
                },
                fields: ['advance_amount', 'paid_amount', 'claimed_amount']
            }
        })
        const data = await call.fetch()
        // Calculate outstanding? Or just total requested? Assuming total advance amount for now.
        advances.total = data.reduce((sum, item) => sum + item.advance_amount, 0)
    } catch (e) {
        advances.total = 0
    } finally {
        advances.loading = false
    }
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(value)
}

onMounted(async () => {
    if (session.initialized) {
        if (!session.employee) return
        fetchExpenses()
        fetchAdvances()
    } else {
        // Retry
        setTimeout(() => {
             if (session.employee) {
                fetchExpenses()
                fetchAdvances()
             }
        }, 1000)
    }
})
</script>
