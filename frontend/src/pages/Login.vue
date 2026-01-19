<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img v-if="settings.data?.company_logo" class="mx-auto h-32 w-auto mb-6 object-contain" :src="settings.data.company_logo" alt="Company Logo" />
      <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ settings.data?.login_title || 'Employee Portal' }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 whitespace-pre-wrap">
        {{ settings.data?.login_message }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <Button
              :loading="loading"
              type="submit"
              class="flex w-full justify-center rounded-md bg-blue-800 px-3 py-1.5 text-sm font-semibold leading-6 !text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
            >
              Sign in
            </Button>
          </div>
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
              {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createResource } from 'frappe-ui'
import { session } from '../data/session'
import { settings } from '../data/settings'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

onMounted(() => {
    settings.fetch()
})

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await session.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = error.message || 'Invalid login details'
  } finally {
    loading.value = false
  }
}
</script>
