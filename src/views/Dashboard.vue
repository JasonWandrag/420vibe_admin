<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="card p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <span class="text-white text-sm sm:text-lg">📦</span>
            </div>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-500">Total Products</p>
            <p class="text-lg sm:text-2xl font-semibold text-gray-900">{{ productsStore.totalProducts }}</p>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-md flex items-center justify-center">
              <span class="text-white text-sm sm:text-lg">🛒</span>
            </div>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-500">Total Orders</p>
            <p class="text-lg sm:text-2xl font-semibold text-gray-900">{{ ordersStore.stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <span class="text-white text-sm sm:text-lg">👥</span>
            </div>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-lg sm:text-2xl font-semibold text-gray-900">{{ usersStore.stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="card p-4 sm:p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <span class="text-white text-sm sm:text-lg">💰</span>
            </div>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
            <p class="text-lg sm:text-2xl font-semibold text-gray-900">${{ ordersStore.totalRevenue.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-base sm:text-lg font-medium text-gray-900">Recent Orders</h3>
          <router-link to="/orders" class="text-xs sm:text-sm text-primary-600 hover:text-primary-500">
            View all
          </router-link>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-xs sm:text-sm">Order ID</th>
              <th class="text-xs sm:text-sm">Customer</th>
              <th class="text-xs sm:text-sm">Status</th>
              <th class="text-xs sm:text-sm">Total</th>
              <th class="text-xs sm:text-sm">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in ordersStore.recentOrders" :key="order.id">
              <td class="font-medium text-xs sm:text-sm">#{{ order.id.slice(-8) }}</td>
              <td class="text-xs sm:text-sm">{{ order.customer?.name || 'N/A' }}</td>
              <td>
                <span class="status-badge text-xs" :class="`status-${order.status}`">
                  {{ order.status }}
                </span>
              </td>
              <td class="text-xs sm:text-sm">R{{ order.total?.toFixed(2) || '0.00' }}</td>
              <td class="text-xs sm:text-sm">{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Products -->
    <div class="card">
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-base sm:text-lg font-medium text-gray-900">Recent Products</h3>
          <router-link to="/products" class="text-xs sm:text-sm text-primary-600 hover:text-primary-500">
            View all
          </router-link>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-xs sm:text-sm">Product</th>
              <th class="text-xs sm:text-sm">Category</th>
              <th class="text-xs sm:text-sm">Price</th>
              <th class="text-xs sm:text-sm">Status</th>
              <th class="text-xs sm:text-sm">Date Added</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in recentProducts" :key="product.id">
              <td>
                <div class="flex items-center">
                  <img 
                    v-if="product.image" 
                    :src="product.image" 
                    :alt="product.name"
                    class="image-preview-small mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <span class="font-medium text-xs sm:text-sm">{{ product.name }}</span>
                </div>
              </td>
              <td class="text-xs sm:text-sm">{{ product.category }}</td>
              <td class="text-xs sm:text-sm">R{{ product.price?.toFixed(2) || '0.00' }}</td>
              <td>
                <span class="status-badge text-xs" :class="product.active ? 'status-active' : 'status-inactive'">
                  {{ product.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-xs sm:text-sm">{{ formatDate(product.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'
import { useUsersStore } from '../stores/users'
// Icons removed - using emojis instead

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const usersStore = useUsersStore()

const recentProducts = computed(() => {
  return productsStore.products.slice(0, 5)
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

onMounted(async () => {
  // Load all data for dashboard
  await Promise.all([
    productsStore.fetchProducts(),
    ordersStore.fetchOrders(),
    usersStore.fetchUsers()
  ])
})
</script>
