<template>
  <div class="bg-gray-800 text-white w-full h-full flex flex-col">
    <!-- Logo -->
    <div class="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
      <h1 class="text-lg sm:text-xl font-bold text-white">420Vibe Admin</h1>
      <!-- Mobile close button -->
      <button 
        @click="$emit('close')"
        class="lg:hidden p-2 text-gray-400 hover:text-white"
      >
        <span class="text-xl">✕</span>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.to"
        @click="$emit('close')"
        class="flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.name === item.name || $route.path.startsWith(item.to)
            ? 'bg-primary-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]"
      >
        <span class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-base sm:text-lg">{{ item.icon }}</span>
        <span class="text-xs sm:text-sm">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- User Info -->
    <div class="p-3 sm:p-4 border-t border-gray-700">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-xs sm:text-sm font-medium text-white">
              {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="ml-2 sm:ml-3 flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-medium text-white truncate">{{ authStore.userDisplayName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ authStore.userEmail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Define emits
defineEmits(['close'])

const navigationItems = [
  {
    name: 'Dashboard',
    label: 'Dashboard',
    to: '/',
    icon: '🏠'
  },
  {
    name: 'Products',
    label: 'Products',
    to: '/products',
    icon: '📦'
  },
  {
    name: 'Orders',
    label: 'Orders',
    to: '/orders',
    icon: '🛒'
  },
  {
    name: 'Users',
    label: 'Users',
    to: '/users',
    icon: '👥'
  },
  {
    name: 'Settings',
    label: 'Settings',
    to: '/settings',
    icon: '⚙️'
  }
]
</script>
