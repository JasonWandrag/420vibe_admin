<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
        <p class="text-gray-600">Manage your store configuration</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Store Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
        
        <form @submit.prevent="updateStoreInfo" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Store Name</label>
            <input
              v-model="storeInfo.name"
              type="text"
              class="input-field"
              placeholder="420Vibe"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Store Description</label>
            <textarea
              v-model="storeInfo.description"
              rows="3"
              class="input-field"
              placeholder="Premium cannabis products..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contact Email</label>
            <input
              v-model="storeInfo.email"
              type="email"
              class="input-field"
              placeholder="contact@420vibe.com"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input
              v-model="storeInfo.phone"
              type="tel"
              class="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <button type="submit" class="btn-primary">
            Update Store Info
          </button>
        </form>
      </div>

      <!-- Admin Management -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Admin Management</h3>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Create New Admin</h4>
            <form @submit.prevent="createAdmin" class="space-y-3">
              <input
                v-model="newAdmin.email"
                type="email"
                placeholder="Admin email"
                class="input-field"
                required
              />
              <input
                v-model="newAdmin.password"
                type="password"
                placeholder="Password"
                class="input-field"
                required
              />
              <input
                v-model="newAdmin.displayName"
                type="text"
                placeholder="Display name"
                class="input-field"
                required
              />
              <button type="submit" class="btn-primary w-full">
                Create Admin
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- System Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">System Information</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Total Products:</span>
            <span class="font-medium">{{ productsStore.totalProducts }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Orders:</span>
            <span class="font-medium">{{ ordersStore.stats.total }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Users:</span>
            <span class="font-medium">{{ usersStore.stats.total }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Revenue:</span>
            <span class="font-medium">${{ ordersStore.totalRevenue.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        
        <div class="space-y-3">
          <button @click="exportData" class="btn-secondary w-full">
            Export Data
          </button>
          <button @click="clearCache" class="btn-secondary w-full">
            Clear Cache
          </button>
          <button @click="refreshData" class="btn-primary w-full">
            Refresh All Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'
import { useUsersStore } from '../stores/users'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const usersStore = useUsersStore()

const storeInfo = ref({
  name: '420Vibe',
  description: 'Premium cannabis products for the modern consumer',
  email: 'contact@420vibe.com',
  phone: '+1 (555) 123-4567'
})

const newAdmin = ref({
  email: '',
  password: '',
  displayName: ''
})

const updateStoreInfo = () => {
  // In a real app, this would save to Firebase
  console.log('Updating store info:', storeInfo.value)
  alert('Store information updated!')
}

const createAdmin = async () => {
  try {
    await authStore.createAdmin(
      newAdmin.value.email,
      newAdmin.value.password,
      newAdmin.value.displayName
    )
    newAdmin.value = { email: '', password: '', displayName: '' }
    alert('Admin created successfully!')
  } catch (error) {
    console.error('Error creating admin:', error)
    alert('Error creating admin: ' + error.message)
  }
}

const exportData = () => {
  // In a real app, this would export data to CSV/JSON
  console.log('Exporting data...')
  alert('Data export started!')
}

const clearCache = () => {
  // Clear local storage and refresh data
  localStorage.clear()
  window.location.reload()
}

const refreshData = async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    ordersStore.fetchOrders(),
    usersStore.fetchUsers()
  ])
  alert('Data refreshed!')
}

onMounted(async () => {
  // Load initial data
  await Promise.all([
    productsStore.fetchProducts(),
    ordersStore.fetchOrders(),
    usersStore.fetchUsers()
  ])
})
</script>
