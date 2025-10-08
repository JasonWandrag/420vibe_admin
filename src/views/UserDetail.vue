<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">User Details</h1>
        <p class="text-gray-600">Customer account information</p>
      </div>
      <router-link to="/users" class="btn-secondary">
        Back to Users
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.loading" class="text-center py-12">
      <div class="spinner mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading user details...</p>
    </div>

    <!-- User Details -->
    <div v-else-if="usersStore.currentUser" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- User Information -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">User Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Name</label>
              <p class="text-gray-900">{{ usersStore.currentUser.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ usersStore.currentUser.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Phone</label>
              <p class="text-gray-900">{{ usersStore.currentUser.phone || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Status</label>
              <p class="text-gray-900">
                <span class="status-badge" :class="usersStore.currentUser.status === 'active' ? 'status-active' : 'status-inactive'">
                  {{ usersStore.currentUser.status || 'active' }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Member Since</label>
              <p class="text-gray-900">{{ formatDate(usersStore.currentUser.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Last Login</label>
              <p class="text-gray-900">{{ formatDate(usersStore.currentUser.lastLogin) }}</p>
            </div>
          </div>
        </div>

        <!-- Order History -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order History</h3>
          
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in userOrders" :key="order.id">
                  <td class="font-medium">#{{ order.id.slice(-8) }}</td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td>
                    <span class="status-badge" :class="`status-${order.status}`">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="font-medium">${{ order.total?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- User Stats -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">User Statistics</h3>
          
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Orders:</span>
              <span class="font-medium">{{ usersStore.currentUser.orderCount || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Spent:</span>
              <span class="font-medium">${{ usersStore.currentUser.totalSpent?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Average Order:</span>
              <span class="font-medium">
                ${{ usersStore.currentUser.orderCount > 0 ? (usersStore.currentUser.totalSpent / usersStore.currentUser.orderCount).toFixed(2) : '0.00' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          
          <div class="space-y-3">
            <button
              @click="toggleUserStatus"
              :class="usersStore.currentUser.status === 'active' ? 'btn-danger' : 'btn-primary'"
              class="w-full"
            >
              {{ usersStore.currentUser.status === 'active' ? 'Deactivate User' : 'Activate User' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">User not found</h3>
      <p class="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
      <router-link to="/users" class="btn-primary">
        Back to Users
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '../stores/users'
import { useOrdersStore } from '../stores/orders'

const route = useRoute()
const usersStore = useUsersStore()
const ordersStore = useOrdersStore()

const userId = computed(() => route.params.id)

const userOrders = computed(() => {
  return ordersStore.orders.filter(order => order.customer?.id === userId.value)
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

const toggleUserStatus = async () => {
  try {
    const newStatus = usersStore.currentUser.status === 'active' ? 'inactive' : 'active'
    await usersStore.updateUserStatus(userId.value, newStatus)
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    usersStore.fetchUser(userId.value),
    ordersStore.fetchOrders()
  ])
})
</script>
