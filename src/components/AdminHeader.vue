<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Page Title -->
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-600">{{ pageDescription }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-600 relative">
            <span class="text-xl">🔔</span>
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900">{{ authStore.userDisplayName }}</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
              <span class="text-gray-400">▼</span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile Settings
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Account Settings
              </a>
              <hr class="my-1">
              <button
                @click="handleSignOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const titles = {
    'Dashboard': 'Dashboard',
    'Products': 'Products',
    'ProductNew': 'New Product',
    'ProductEdit': 'Edit Product',
    'Orders': 'Orders',
    'OrderDetail': 'Order Details',
    'Users': 'Users',
    'UserDetail': 'User Details',
    'Settings': 'Settings'
  }
  return titles[route.name] || 'Admin Panel'
})

const pageDescription = computed(() => {
  const descriptions = {
    'Dashboard': 'Overview of your store performance',
    'Products': 'Manage your product catalog',
    'ProductNew': 'Add a new product to your store',
    'ProductEdit': 'Update product information',
    'Orders': 'View and manage customer orders',
    'OrderDetail': 'Order details and status updates',
    'Users': 'Manage customer accounts',
    'UserDetail': 'Customer account details',
    'Settings': 'Store configuration and settings'
  }
  return descriptions[route.name] || ''
})

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showUserMenu.value = false
  }
})
</script>
