<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
        <p class="text-gray-600">Manage customer orders and fulfillment</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-gray-900">{{ ordersStore.stats.total }}</p>
          <p class="text-sm text-gray-500">Total Orders</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-yellow-600">{{ ordersStore.stats.pending }}</p>
          <p class="text-sm text-gray-500">Pending</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-blue-600">{{ ordersStore.stats.processing }}</p>
          <p class="text-sm text-gray-500">Processing</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-purple-600">{{ ordersStore.stats.shipped }}</p>
          <p class="text-sm text-gray-500">Shipped</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-green-600">{{ ordersStore.stats.delivered }}</p>
          <p class="text-sm text-gray-500">Delivered</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search orders..."
            class="input-field"
          />
        </div>
        <div>
          <label class="form-label">Status</label>
          <select v-model="filters.status" class="input-field">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="form-label">Date From</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="input-field"
          />
        </div>
        <div>
          <label class="form-label">Date To</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="font-medium">#{{ order.id.slice(-8) }}</td>
              <td>
                <div>
                  <div class="font-medium">{{ order.customer?.name || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ order.customer?.email || 'N/A' }}</div>
                </div>
              </td>
              <td>{{ order.items?.length || 0 }} items</td>
              <td class="font-medium">R{{ order.total?.toFixed(2) || '0.00' }}</td>
              <td>
                <span class="status-badge" :class="`status-${order.status}`">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <router-link
                    :to="`/orders/${order.id}`"
                    class="text-primary-600 hover:text-primary-500"
                  >
                    👁️
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <span class="text-6xl text-gray-400 mx-auto mb-4 block">🛒</span>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p class="text-gray-600">Orders will appear here when customers make purchases.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '../stores/orders'
// Icons removed - using emojis instead

const ordersStore = useOrdersStore()

const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

const filteredOrders = computed(() => {
  let filtered = ordersStore.orders

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.id.toLowerCase().includes(search) ||
      order.customer?.name?.toLowerCase().includes(search) ||
      order.customer?.email?.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  // Date filters
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt)
      return orderDate >= fromDate
    })
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt)
      return orderDate <= toDate
    })
  }

  return filtered
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

onMounted(async () => {
  await ordersStore.fetchOrders()
})
</script>
