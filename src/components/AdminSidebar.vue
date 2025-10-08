<template>
  <div class="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-700">
      <h1 class="text-xl font-bold text-white">420Vibe Admin</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.to"
        class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          $route.name === item.name || $route.path.startsWith(item.to)
            ? 'bg-primary-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]"
      >
        <span class="w-5 h-5 mr-3 text-lg">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>

    <!-- User Info -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-white">
              {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-white">{{ authStore.userDisplayName }}</p>
          <p class="text-xs text-gray-400">{{ authStore.userEmail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

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
