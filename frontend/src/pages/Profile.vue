<template>
  <MainLayout>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg" v-if="employee">
      <div class="px-4 py-5 sm:px-6 flex items-center">
        <div class="mr-4">
             <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                 <img v-if="employee.image" :src="employee.image" class="h-full w-full object-cover" />
                 <User v-else class="h-8 w-8 text-gray-400" />
             </div>
        </div>
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ employee.employee_name }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ employee.name }}
          </p>
        </div>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Department
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.department }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Designation
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.designation }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Email address
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.company_email || employee.personal_email }}
            </dd>
          </div>
           <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Date of Joining
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.date_of_joining }}
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Reporting Manager
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.reports_to }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div v-else class="text-center py-10">
        Loading profile...
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { session } from '@/data/session'
import { createResource } from 'frappe-ui'
import { User } from 'lucide-vue-next'

const employee = ref(null)

const fetchFullEmployee = async () => {
    if (!session.employee) return

    const call = createResource({
        url: 'frappe.client.get',
        params: {
            doctype: 'Employee',
            name: session.employee.name,
        }
    })
    
    try {
        employee.value = await call.fetch()
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    if (session.initialized && session.employee) {
        fetchFullEmployee()
    } else {
        setTimeout(fetchFullEmployee, 1000)
    }
})
</script>
