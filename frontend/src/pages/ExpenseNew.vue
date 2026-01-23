<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto">
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            New Expense Claim
          </h2>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 md:mt-0 md:ml-4">
           <Button variant="outline" @click="downloadTemplate">
             Download Template
           </Button>
           <div class="relative">
             <input type="file" ref="fileInput" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".xlsx, .xls" :disabled="isSubmitted" />
             <Button variant="outline" :disabled="isSubmitted">
                Upload Excel
             </Button>
           </div>
           <Button variant="outline" @click="printExpense" v-if="form.workflow_state === 'Need Review'">
               <Printer class="w-4 h-4 mr-2" />
               Print
           </Button>
           <Button variant="subtle" @click="router.back()">
            Cancel
          </Button>
        </div>
      </div>

      <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 pb-20">
        <div class="space-y-6">
            <!-- Parent Details -->
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Posting Date</label>
                    <input type="date" v-model="form.posting_date" :disabled="isSubmitted" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Cost Center</label>
                    <div class="mt-1">
                        <Autocomplete
                            :options="costCenters"
                            v-model="costCenterQuery"
                            @update:modelValue="handleCostCenterSelect"
                            placeholder="Select Cost Center"
                            :disabled="isSubmitted"
                        />
                    </div>
                </div>
                 <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Project</label>
                    <div class="mt-1">
                        <Autocomplete
                            :options="projects"
                            v-model="projectQuery"
                            @update:modelValue="handleProjectSelect"
                            placeholder="Select Project"
                            :disabled="isSubmitted"
                        />
                    </div>
                </div>
            </div>

            <!-- Child Table -->
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900 mb-2">Expenses</h3>
                <div class="overflow-x-auto border rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Date</th>
                                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Type</th>
                                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Amount</th>
                                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">VAT</th>
                                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" class="px-3 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(row, index) in form.expenses" :key="index">
                                <td class="px-3 py-2 align-top">
                                    <input type="date" v-model="row.expense_date" :disabled="isSubmitted" class="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500" />
                                </td>
                                <td class="px-3 py-2 align-top">
                                    <select v-model="row.expense_type" :disabled="isSubmitted" class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500">
                                        <option value="" disabled>Select Type</option>
                                        <option v-for="type in expenseTypes" :key="type.name" :value="type.name">{{ type.name }}</option>
                                    </select>
                                </td>
                                <td class="px-3 py-2 align-top">
                                    <input type="number" step="0.01" min="0" v-model="row.amount" @keydown="preventInvalidInput" :disabled="isSubmitted" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500" placeholder="0.00" />
                                </td>
                                 <td class="px-3 py-2 align-top">
                                    <input type="number" step="0.01" min="0" v-model="row.vat_amount" @keydown="preventInvalidInput" :disabled="isSubmitted" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500" placeholder="0.00" />
                                </td>
                                <td class="px-3 py-2 align-top">
                                    <textarea v-model="row.description" rows="1" :disabled="isSubmitted" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md resize-y disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                                </td>
                                <td class="px-3 py-2 align-top text-center">
                                    <button v-if="!isSubmitted" @click="removeRow(index)" class="text-red-600 hover:text-red-900 pt-2 transition">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-2" v-if="!isSubmitted">
                    <Button variant="outline" @click="addRow">
                        <Plus class="w-4 h-4 mr-2" />
                        Add Row
                    </Button>
                </div>
            </div>

            <!-- Totals -->
             <div class="flex flex-col items-end pt-4 border-t border-gray-200 space-y-2">
                <div class="text-right">
                    <span class="text-sm text-gray-500">Total Amount:</span>
                    <span class="ml-2 text-lg font-medium text-gray-900">{{ formatCurrency(totalAmount) }}</span>
                </div>
                <div class="text-right">
                    <span class="text-sm text-gray-500">Total VAT:</span>
                    <span class="ml-2 text-lg font-medium text-gray-900">{{ formatCurrency(totalVat) }}</span>
                </div>
                <div class="text-right border-t border-gray-100 pt-2 mt-2">
                    <span class="text-base font-bold text-gray-900">Grand Total:</span>
                    <span class="ml-2 text-2xl font-bold text-indigo-600">{{ formatCurrency(grandTotal) }}</span>
                </div>
            </div>

            <div v-if="error" class="bg-red-50 p-4 rounded-md text-red-700 text-sm">
                {{ error }}
            </div>

            <div class="flex justify-end pt-5 space-x-2">
                <Button 
                    v-if="!isSubmitted && form.docstatus !== 1"
                    :loading="submitting" 
                    :variant="mainButtonLabel === 'Submit' ? 'solid' : (isDirty ? 'solid' : 'subtle')" 
                    @click="handleMainButtonClick"
                >
                    {{ mainButtonLabel }}
                </Button>
                <div v-else class="flex items-center text-green-600 font-medium">
                    <span class="mr-2">✓</span> Submitted
                </div>
            </div>
        </div>

        <!-- Confirmation Dialog -->
        <Dialog v-model="showSubmitDialog" :options="{ title: 'Submit Expense Claim', actions: [{ label: 'Confirm Submit', variant: 'solid', onClick: confirmSubmit, loading: submitting }] }">
             <template #body-content>
                 <p class="text-gray-600">Are you sure you want to submit this expense claim? Once submitted, it will be sent for approval.</p>
             </template>
        </Dialog>

        <!-- File Attachments Section (only when document is saved) -->
        <FileAttachments 
          v-if="form.name" 
          doctype="Expense Claim" 
          :docname="form.name" 
          :readonly="isSubmitted" 
        />

        <!-- Document History Section (only in edit mode) -->
        <DocumentHistory v-if="isEditMode && form.name" :docname="form.name" />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import DocumentHistory from '@/components/DocumentHistory.vue'
import FileAttachments from '@/components/FileAttachments.vue'
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createResource, Button, Dialog, Autocomplete } from 'frappe-ui'
import { session } from '@/data/session'
import { Plus, Trash2, Printer } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const router = useRouter()
const route = useRoute()

const expenseTypes = ref([])
const costCenters = ref([])
const projects = ref([])
const costCenterQuery = ref('')
const projectQuery = ref('')
const submitting = ref(false)
const error = ref('')
const fileInput = ref(null)
const showSubmitDialog = ref(false)

const isEditMode = computed(() => !!route.params.id && route.params.id !== 'new')
const isDirty = ref(false) // Track if form has unsaved changes

const form = reactive({
    name: '',
    posting_date: new Date().toISOString().split('T')[0],
    cost_center: '',
    project: '',
    company: '',
    modified: '', // Track modified timestamp for optimistic locking
    docstatus: 0,
    workflow_state: '', // Add workflow state
    naming_series: '',
    is_paid: 0,
    creation: '',
    owner: '',
    remark: '', 
    expenses: [
        {
            expense_date: new Date().toISOString().split('T')[0],
            expense_type: '',
            amount: '',
            vat_amount: '',
            description: ''
        }
    ]
})

// Backend Status Logic: Lock if Submitted or in Review
const isSubmitted = computed(() => {
    if (!isEditMode.value) return false
    // Lock if docstatus is 1 OR workflow state indicates processing
    return form.docstatus === 1 || ['Need Review', 'Approved', 'Submitted'].includes(form.workflow_state)
})

// Watch for changes to set isDirty
watch(form, (newVal) => {
    isDirty.value = true
}, { deep: true })

const addRow = () => {
    if (isSubmitted.value) return // Block if submitted
    form.expenses.push({
        expense_date: form.posting_date,
        expense_type: '',
        amount: '',
        vat_amount: '',
        description: ''
    })
}

const removeRow = (index) => {
    if (isSubmitted.value) return // Block if submitted
    if (form.expenses.length > 1) {
        form.expenses.splice(index, 1)
    } else {
        Object.assign(form.expenses[0], {
             expense_date: form.posting_date,
             expense_type: '',
             amount: '',
             vat_amount: '',
             description: ''
        })
    }
}

const totalAmount = computed(() => {
    return form.expenses.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
})

const totalVat = computed(() => {
    return form.expenses.reduce((sum, row) => sum + (parseFloat(row.vat_amount) || 0), 0)
})

const grandTotal = computed(() => {
    return totalAmount.value + totalVat.value
})

const preventInvalidInput = (e) => {
    if (['-', '+', 'e', 'E'].includes(e.key)) {
        e.preventDefault()
    }
}

const fetchCostCenters = async (company) => {
    // Note: API currently uses user default company. If passing company is needed, update API.
    const call = createResource({
        url: 'employee_portal.api.get_cost_centers',
        method: 'GET'
    })
    try {
        const data = await call.fetch()
        costCenters.value = data.map(c => ({
            ...c,
            label: c.label.length > 60 ? c.label.substring(0, 60) + '...' : c.label
        }))
    } catch (e) {
        console.error('Failed to fetch cost centers', e)
    }
}

const fetchProjects = async () => {
    const call = createResource({
        url: 'employee_portal.api.get_projects',
        method: 'GET'
    })
    try {
        const data = await call.fetch()
        projects.value = data.map(p => ({
            ...p,
            label: p.label.length > 60 ? p.label.substring(0, 60) + '...' : p.label
        }))
    } catch (e) {
        console.error('Failed to fetch projects', e)
    }
}

const handleCostCenterSelect = (val) => {
    if (val) {
        form.cost_center = val.value
        costCenterQuery.value = val.label
    }
}

const handleProjectSelect = (val) => {
    if (val) {
        form.project = val.value
        projectQuery.value = val.label
    }
}

const updateQueriesFromForm = () => {
    if (form.cost_center && costCenters.value.length) {
        const found = costCenters.value.find(c => c.value === form.cost_center)
        if (found) costCenterQuery.value = found.label
        else costCenterQuery.value = form.cost_center
    }
    
    if (form.project && projects.value.length) {
         const found = projects.value.find(p => p.value === form.project)
         if (found) projectQuery.value = found.label
         else projectQuery.value = form.project
    }
}

const fetchExpense = async (name) => {
    const call = createResource({
        url: 'frappe.client.get',
        params: {
            doctype: 'Expense Claim',
            name: name
        }
    })
    try {
        const doc = await call.fetch()
        form.name = doc.name
        form.posting_date = doc.posting_date
        form.company = doc.company
        form.cost_center = doc.cost_center
        form.project = doc.project
    // Capture timestamp and mandatory fields
        form.modified = doc.modified
        form.creation = doc.creation
        form.owner = doc.owner
        form.docstatus = doc.docstatus
        form.workflow_state = doc.workflow_state || '' // Fetch status
        form.naming_series = doc.naming_series
        form.is_paid = doc.is_paid
        form.remark = doc.remark || ''
        
        if (doc.expenses && doc.expenses.length > 0) {
            form.expenses = doc.expenses.map(row => ({
                expense_date: row.expense_date,
                expense_type: row.expense_type,
                amount: row.amount,
                vat_amount: row.vat_amount || 0,
                description: row.description || ''
            }))
        }
        
        await fetchCostCenters(doc.company)
        await fetchProjects()
        updateQueriesFromForm()
        
        nextTick(() => {
            isDirty.value = false
        })

    } catch (e) {
        console.error('Failed to fetch expense', e)
        error.value = 'Failed to load expense claim.'
    }
}

const fetchDefaults = async () => {
    if (!session.employee) return
    
    try {
        const companyCall = createResource({
            url: 'frappe.client.get_value',
            params: {
                doctype: 'Employee',
                fieldname: ['company'],
                filters: { name: session.employee.name }
            }
        })
        const emp = await companyCall.fetch()
        form.company = emp.company
        
        if (form.company) {
             const defaultsCall = createResource({
                url: 'frappe.client.get_value',
                params: {
                    doctype: 'Company',
                    fieldname: ['cost_center'],
                    filters: { name: form.company }
                }
            })
            const comp = await defaultsCall.fetch()
            form.cost_center = comp.cost_center || '' 
             
            await fetchCostCenters(form.company)
            await fetchProjects()
            updateQueriesFromForm()
        }
        nextTick(() => {
             isDirty.value = false
        })
    } catch (e) {
        console.error('Failed to fetch defaults', e)
        error.value = 'Failed to load company defaults. ' + e.message
    }
}

const fetchExpenseTypes = async () => {
     const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Expense Claim Type',
            fields: ['name']
        }
    })
    try {
        expenseTypes.value = await call.fetch()
    } catch (e) { console.error(e) }
}

// Smart Button Logic
const mainButtonLabel = computed(() => {
    if (isSubmitted.value) return 'Submitted'
    if (isDirty.value || !form.name) return 'Save'
    return 'Submit'
})

const handleMainButtonClick = () => {
    if (isSubmitted.value) return // No action if submitted

    if (isDirty.value || !form.name) {
        // Case: Has changes or is new -> SAVE DRAFT
        saveExpense(0)
    } else {
        // Case: Clean and existing draft -> SUBMIT
        showSubmitDialog.value = true
    }
}

const confirmSubmit = () => {
    showSubmitDialog.value = false
    saveExpense(1) // Request Submit
}

const saveExpense = async (requestedStatus) => {
    // requestedStatus is 0 (Save Draft) or 1 (Submit Claim)

    if (submitting.value) return // Prevent double-clicks causing duplication
    
    const validRows = form.expenses.filter(row => row.expense_type && row.amount > 0)
    
    if (validRows.length === 0) {
        error.value = 'Please add at least one valid expense row.'
        return
    }

    if (!form.cost_center) {
        error.value = 'Please select a Cost Center.'
        return
    }

    submitting.value = true
    error.value = ''

    // Prepare Child Table
    const expensesPayload = validRows.map(row => ({
        expense_type: row.expense_type,
        amount: row.amount,
        vat_amount: row.vat_amount || 0,
        sanctioned_amount: row.amount,
        sanctioned_vat_amount: row.vat_amount || 0,
        description: row.description,
        expense_date: row.expense_date
    }))

    // Calculate Totals
    const totalClaimed = validRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
    const totalVat = validRows.reduce((sum, row) => sum + (parseFloat(row.vat_amount) || 0), 0)
    
    // Workflow Logic Base Payload
    // Default to current form state for "Save" action
    let docPayload = {
        doctype: 'Expense Claim',
        name: form.name,
        company: form.company,
        posting_date: form.posting_date,
        cost_center: form.cost_center,
        project: form.project,
        expenses: expensesPayload,
        total_claimed_amount: totalClaimed,
        total_sanctioned_amount: totalClaimed,
        total_vat_amount: totalVat,
        total_sanctioned_vat_amount: totalVat,
        docstatus: 0, // Always Draft unless workflow auto-submits
        employee: session.employee.name, 
        is_paid: form.is_paid || 0,
        naming_series: form.naming_series,
        currency: 'AED',
        exchange_rate: 1,
        remark: form.remark
    }

    if (form.name) {
        docPayload.modified = form.modified
        docPayload.creation = form.creation
        docPayload.owner = form.owner
    }

    // --- PRE-STEP: INSERT IF NEW & SUBMITTING ---
    // If user clicks "Submit" on a new form, we must first Create it (Draft), then Submit it (Need Review).
    if (!form.name && requestedStatus === 1) {
        try {
            console.log("Creating new Draft before determining Submit action...")
            docPayload.workflow_state = 'Pending'
            const createCall = createResource({
                url: 'frappe.client.insert',
                params: { doc: docPayload }
            })
            const resp = await createCall.fetch()
            const newDoc = resp.docs ? resp.docs[0] : resp 
            
            if (newDoc && newDoc.name) {
                 form.name = newDoc.name
                 form.modified = newDoc.modified
                 
                 // CRITICAL: Ensure reactivity updates before entering the loop logic
                 await nextTick() 
                 console.log("Draft created successfully:", form.name)
            }
        } catch (createErr) {
            console.error("Failed to create draft before submit", createErr)
            error.value = "Failed to create draft: " + (createErr.message || createErr)
            submitting.value = false
            return
        }
    }

    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
        try {
            let call
            
            // --- 1. SPECIAL HANDLING FOR SUBMIT (STATUS 1) ---
            if (requestedStatus === 1 && form.name) {
                
                // Add mandatory delay on ALL attempts
                await new Promise(r => setTimeout(r, 500));
                
                if (retries > 0) {
                     await new Promise(r => setTimeout(r, 500 * retries))
                }

                try {
                    // Fetch ONLY the latest timestamp to fix 417 error
                    // get_value is lighter and safer than getdoc/get for this purpose
                    const tsCall = createResource({
                        url: 'frappe.client.get_value',
                        params: { 
                            doctype: 'Expense Claim', 
                            filters: { name: form.name },
                            fieldname: 'modified'
                        }
                    })
                    const tsResult = await tsCall.fetch()
                    
                    if (tsResult && tsResult.modified) {
                        docPayload.modified = tsResult.modified
                    }
                    
                    // Add workflow action
                    docPayload.workflow_action = 'Complete'
                    
                    // Force state update as well to ensure transition visual
                    docPayload.workflow_state = 'Need Review'

                    call = createResource({
                        url: 'frappe.desk.form.save.savedocs',
                        params: {
                            doc: JSON.stringify(docPayload),
                            action: 'Save' 
                        }
                    })

                } catch (fetchErr) {
                    // console.error("Failed to fetch timestamp before submit", fetchErr)
                }

            } else if (form.name) {
                 // --- 2. REGULAR UPDATE (SAVE DRAFT) ---
                docPayload.workflow_state = 'Pending' 
                
                call = createResource({
                    url: 'frappe.desk.form.save.savedocs',
                    params: {
                        doc: JSON.stringify(docPayload),
                        action: 'Save' 
                    }
                })
            } else {
                 // --- 3. NEW INSERT ---
                docPayload.workflow_state = 'Pending' 
                
                call = createResource({
                    url: 'frappe.client.insert',
                    params: { doc: docPayload }
                })
            }

            const response = await call.fetch()
            
            // Update state with saved document
            let savedDoc = response.docs ? response.docs[0] : response
            form.name = savedDoc.name
            form.modified = savedDoc.modified
            form.docstatus = savedDoc.docstatus
            form.workflow_state = savedDoc.workflow_state || '' 
            
            // Sync vital fields
            form.naming_series = savedDoc.naming_series
            form.creation = savedDoc.creation
            form.owner = savedDoc.owner
            form.is_paid = savedDoc.is_paid
            
            // Reset dirty flag
            nextTick(() => {
                isDirty.value = false
            })

            console.log("Expense saved/submitted successfully.")

            if (requestedStatus === 1) {
                // Stay on page, just refresh to be safe
                await fetchExpense(form.name)
            } else if (!isEditMode.value && form.name) {
                 // Redirect new draft to edit page
                 router.replace(`/expense/${form.name}`)
            }
            
            // Success! Break loop
            break

        } catch (e) {
            console.error(`Attempt ${retries + 1} failed:`, e)
            
            // Check for Timestamp Mismatch errors (417 or error messages)
            const isTimestampError = (e.messages && e.messages.some(m => m && m.includes('TimestampMismatchError'))) || 
                                     (e.message && e.message.includes('TimestampMismatchError')) ||
                                     (e.exc_type && e.exc_type === 'TimestampMismatchError') ||
                                     (e.message && e.message.includes('modified after you have opened it')) ||
                                     (e.status === 417) || (e.statusCode === 417)

            if (isTimestampError && retries < maxRetries - 1) {
                console.log("Timestamp mismatch detected. Retrying...")
                retries++
                continue // Loop to try again
            }

            // Real Error
            let msg = e.message
            if (e.messages && e.messages.length > 0) {
                msg = e.messages.join('\n')
            }
            error.value = msg || 'Failed to save expense claim.'
            break // Exit loop on non-retriable error
        }
    } // end while

    submitting.value = false
}

const printExpense = () => {
    if (!form.name) return
    const url = `/api/method/frappe.utils.print_format.download_pdf?doctype=Expense Claim&name=${form.name}&format=Portal Expense Claim&no_letterhead=0`
    window.open(url, '_blank')
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)

const loadExcelJS = () => {
    return new Promise((resolve, reject) => {
        if (window.ExcelJS) {
            resolve(window.ExcelJS);
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js";
        script.onload = () => resolve(window.ExcelJS);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const downloadTemplate = async () => {
    let ExcelJS
    try {
        ExcelJS = await loadExcelJS()
    } catch (e) {
        console.error("Failed to load ExcelJS", e)
        error.value = "Failed to load Excel library. Please check your internet connection."
        return
    }

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Expenses')

    const types = expenseTypes.value.map(t => t.name)
    let typeSheet = workbook.addWorksheet('ValidationSource', { state: 'hidden' })
    types.forEach((t, idx) => {
        typeSheet.getCell(`A${idx + 1}`).value = t
    })

    sheet.getColumn(1).width = 15
    sheet.getColumn(2).width = 25
    sheet.getColumn(3).width = 15
    sheet.getColumn(4).width = 15
    sheet.getColumn(5).width = 40

    sheet.addTable({
        name: 'ExpensesTable',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: true,
        },
        columns: [
            { name: 'Date', filterButton: true },
            { name: 'Expense Type', filterButton: true },
            { name: 'Amount', filterButton: true },
            { name: 'VAT', filterButton: true },
            { name: 'Description', filterButton: true },
        ],
        rows: [ [null, null, null, null, null] ],
    })

    for (let r = 1; r <= 2; r++) {
        const currentRow = sheet.getRow(r)
        for (let c = 1; c <= 5; c++) {
            const cell = currentRow.getCell(c)
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
            if (r === 1) cell.font = { bold: true }
        }
    }
    
    const row = sheet.getRow(2)
    row.getCell(1).numFmt = 'dd-mmm-yyyy'
    row.getCell(1).dataValidation = {
        type: 'date',
        allowBlank: true,
        operator: 'greaterThan',
        showErrorMessage: true,
        errorStyle: 'stop',
        errorTitle: 'Invalid Date',
        error: 'Please enter a valid date.',
        formulae: [new Date("2000-01-01")]
    }

    row.getCell(2).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`ValidationSource!$A$1:$A$${types.length}`],
        showErrorMessage: true,
        error: 'Select from list'
    }

    row.getCell(3).dataValidation = {
        type: 'decimal',
        operator: 'greaterThanOrEqual',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [0],
        error: 'Amount >= 0'
    }

    row.getCell(4).dataValidation = {
        type: 'decimal',
        operator: 'greaterThanOrEqual',
        allowBlank: true,
        showErrorMessage: true,
        formulae: [0],
        error: 'VAT >= 0'
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'Expense_Claim_Template.xlsx')
}

const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array', cellDates: true })
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
            
            if (!rows || rows.length === 0) {
                error.value = 'File appears to be empty.'
                return
            }

            let headerRowIndex = -1
            
            for (let i = 0; i < Math.min(rows.length, 20); i++) {
                const row = rows[i]
                if (!row) continue
                const rowStr = JSON.stringify(row).toLowerCase()
                let matchCount = 0
                if (rowStr.includes('date')) matchCount++
                if (rowStr.includes('type')) matchCount++
                if (rowStr.includes('amount')) matchCount++
                if (matchCount >= 2) { 
                    headerRowIndex = i
                    break
                }
            }

            if (headerRowIndex === -1) headerRowIndex = 0

            const headerRow = rows[headerRowIndex]
            const findIdx = (keyword) => {
                if (!headerRow) return -1
                return headerRow.findIndex(c => String(c).toLowerCase().includes(keyword))
            }

            const colMap = {
                date: findIdx('date'),
                type: findIdx('type'),
                amount: findIdx('amount'),
                vat: findIdx('vat'),
                desc: findIdx('description')
            }

            if (colMap.date === -1) colMap.date = 0
            if (colMap.type === -1) colMap.type = 1
            if (colMap.amount === -1) colMap.amount = 2
            if (colMap.vat === -1) colMap.vat = 3
            if (colMap.desc === -1) colMap.desc = 4

            const validExpenses = []

            for (let i = headerRowIndex + 1; i < rows.length; i++) {
                const row = rows[i]
                if (!row || row.length === 0) continue

                const rawDate = row[colMap.date]
                const rawType = row[colMap.type]
                const rawAmount = row[colMap.amount]
                const rawVat = row[colMap.vat]
                const rawDesc = row[colMap.desc]

                let combinedContent = ''
                if (rawType) combinedContent += String(rawType)
                if (rawAmount) combinedContent += String(rawAmount)
                if (rawDesc) combinedContent += String(rawDesc)
                
                if (combinedContent.trim().length === 0 && !rawDate) continue
                if (String(rawType).toLowerCase() === 'type' || String(rawAmount).toLowerCase() === 'amount') continue

                let expense_date = null
                let hasExplicitDate = false

                if (rawDate) {
                    try {
                         const d = new Date(rawDate)
                         if (!isNaN(d) && d.getFullYear() > 2000) {
                             d.setHours(d.getHours() + 12)
                             expense_date = d.toISOString().split('T')[0]
                             hasExplicitDate = true
                         }
                    } catch (e) { /* ignore */ }
                }

                const amount = parseFloat(rawAmount) || 0
                const vat = parseFloat(rawVat) || 0
                const description = rawDesc ? String(rawDesc).trim() : ''
                const expense_type = rawType ? String(rawType).trim() : ''
                
                const hasMeaningfulData = (amount > 0) || (description.length > 0) || (expense_type.length > 0)

                if (hasMeaningfulData || hasExplicitDate) {
                     validExpenses.push({
                         expense_date: expense_date || form.posting_date,
                         expense_type,
                         amount,
                         vat_amount: vat, 
                         description
                     })
                }
            }

            if (validExpenses.length > 0) {
                form.expenses = validExpenses
                error.value = ''
            } else {
                error.value = 'No valid data found in the uploaded file.'
            }

        } catch (err) {
            console.error("Smart Parse Error:", err)
            error.value = "Failed to parse file. Please ensure it is a valid Excel file."
        } finally {
            e.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

const resetForm = () => {
    form.name = ''
    form.posting_date = new Date().toISOString().split('T')[0]
    form.cost_center = ''
    form.project = ''
    form.company = ''
    form.modified = ''
    form.docstatus = 0
    form.naming_series = ''
    form.is_paid = 0
    form.creation = ''
    form.owner = ''
    form.remark = ''
    form.expenses = [{
        expense_date: new Date().toISOString().split('T')[0],
        expense_type: '',
        amount: '',
        vat_amount: '',
        description: ''
    }]
    isDirty.value = false
    submitting.value = false
    error.value = ''
}

// Watch route to handle navigation between Edit and New within same component
watch(() => route.params.id, (newId) => {
    if (!newId) {
        resetForm()
        fetchDefaults()
    } else {
        fetchExpense(newId)
    }
})

onMounted(() => {
    fetchExpenseTypes()
    if (session.initialized && session.employee) {
        if (isEditMode.value) {
            fetchExpense(route.params.id)
        } else {
            resetForm() // Ensure clean state for new form
            fetchDefaults()
        }
    } else {
        setTimeout(() => {
            if(session.employee) {
                 if (isEditMode.value) {
                    fetchExpense(route.params.id)
                } else {
                    resetForm() // Ensure clean state for new form
                    fetchDefaults()
                }
            }
        }, 1000)
    }
})
</script>
