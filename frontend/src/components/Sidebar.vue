<template>
  <div class="flex flex-col h-full bg-gray-50 border-r w-full md:w-64">
    <div class="h-16 flex items-center px-6 border-b bg-white">
      <span class="text-xl font-bold text-gray-800">Employee Portal</span>
    </div>
    <div class="flex-1 overflow-y-auto py-4">
      <nav class="space-y-1 px-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="$emit('item-click')"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          :class="[
            item.current
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          ]"
        >
          <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
    <div class="p-4 border-t bg-white">
      <div class="flex items-center mb-3 px-2" v-if="session.user">
         <img 
            :src="session.employee?.image || session.user?.user_image || `https://ui-avatars.com/api/?name=${session.user?.full_name || 'User'}&background=random`" 
            class="h-8 w-8 rounded-full mr-3 object-cover border border-gray-200"
            alt="Profile"
         >
         <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
                {{ session.employee?.employee_name || session.user?.full_name }}
            </p>
         </div>
      </div>
      <button
        @click="logout"
        class="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
      >
        <LogOut class="mr-3 h-5 w-5" />
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { session } from '../data/session'
import { settings } from '../data/settings'
import {
  Home,
  FileText,
  DollarSign,
  Calendar,
  LogOut,
  User
} from 'lucide-vue-next'

const route = useRoute()

onMounted(() => {
    settings.fetch()
})

const navigation = computed(() => {
  const links = [
    { name: 'Dashboard', href: '/', icon: Home, current: route.path === '/' },
    { 
        name: 'Leave Application', 
        href: '/leave', 
        icon: FileText, 
        current: route.path.startsWith('/leave'),
        enabled: settings.data?.enable_leave !== 0 && session.permissions?.can_leave !== false
    },
    { 
        name: 'Expense Claim', 
        href: '/expense', 
        icon: DollarSign, 
        current: route.path.startsWith('/expense'),
        enabled: settings.data?.enable_expense_claim !== 0 && session.permissions?.can_expense !== false
    },
    { 
        name: 'Attendance', 
        href: '/attendance', 
        icon: Calendar, 
        current: route.path.startsWith('/attendance'),
        enabled: settings.data?.enable_attendance !== 0 && session.permissions?.can_attendance !== false
    },
    { name: 'Profile', href: '/profile', icon: User, current: route.path.startsWith('/profile') },
  ]
  
  return links.filter(l => l.enabled === undefined || l.enabled)
})

const logout = () => {
  session.logout()
}
</script>
