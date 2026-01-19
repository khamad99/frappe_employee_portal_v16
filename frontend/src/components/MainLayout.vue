<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" aria-hidden="true" @click="sidebarOpen = false"></div>
      
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="sidebarOpen = false">
            <span class="sr-only">Close sidebar</span>
            <X class="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        <Sidebar @item-click="sidebarOpen = false" />
      </div>
      
      <div class="flex-shrink-0 w-14" aria-hidden="true">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <div class="hidden md:flex md:flex-shrink-0">
      <Sidebar />
    </div>

    <div class="flex flex-col flex-1 w-0 overflow-hidden">
        <!-- Mobile Header -->
        <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200 flex items-center">
            <button class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <Menu class="h-6 w-6" aria-hidden="true" />
            </button>
            <span class="ml-2 text-lg font-bold text-gray-900">Employee Portal</span>
        </div>

        <main class="flex-1 relative overflow-y-auto focus:outline-none">
            <div class="py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <slot></slot>
                </div>
            </div>
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import { Menu, X } from 'lucide-vue-next'

const sidebarOpen = ref(false)
</script>
