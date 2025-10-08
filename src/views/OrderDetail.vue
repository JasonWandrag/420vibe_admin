<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Order #{{ orderId }}</h1>
        <p class="text-gray-600">Order details and status management</p>
      </div>
      <router-link to="/orders" class="btn-secondary">
        Back to Orders
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="text-center py-12">
      <div class="spinner mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading order details...</p>
    </div>

    <!-- Order Details -->
    <div v-else-if="ordersStore.currentOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Information -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Order ID</label>
              <p class="text-gray-900">#{{ ordersStore.currentOrder.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Order Date</label>
              <p class="text-gray-900">{{ formatDate(ordersStore.currentOrder.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Status</label>
              <p class="text-gray-900">
                <span class="status-badge" :class="`status-${ordersStore.currentOrder.status}`">
                  {{ ordersStore.currentOrder.status }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Total Amount</label>
              <p class="text-gray-900 font-semibold">${{ ordersStore.currentOrder.total?.toFixed(2) || '0.00' }}</p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Name</label>
              <p class="text-gray-900">{{ ordersStore.currentOrder.customer?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ ordersStore.currentOrder.customer?.email || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Phone</label>
              <p class="text-gray-900">{{ ordersStore.currentOrder.customer?.phone || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in ordersStore.currentOrder.items" :key="item.id">
                  <td>
                    <div class="flex items-center">
                      <img 
                        v-if="item.image" 
                        :src="item.image" 
                        :alt="item.name"
                        class="image-preview-small mr-3"
                      />
                      <div>
                        <div class="font-medium">{{ item.name }}</div>
                        <div class="text-sm text-gray-500">{{ item.category }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price?.toFixed(2) || '0.00' }}</td>
                  <td class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status Management -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
          
          <div class="space-y-4">
            <div>
              <label class="form-label">New Status</label>
              <select v-model="newStatus" class="input-field">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label class="form-label">Notes (Optional)</label>
              <textarea
                v-model="statusNotes"
                rows="3"
                class="input-field"
                placeholder="Add any notes about this status change..."
              ></textarea>
            </div>
            
            <button
              @click="updateStatus"
              :disabled="ordersStore.loading || newStatus === ordersStore.currentOrder.status"
              class="btn-primary w-full"
            >
              {{ ordersStore.loading ? 'Updating...' : 'Update Status' }}
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal:</span>
              <span>${{ ordersStore.currentOrder.subtotal?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax:</span>
              <span>${{ ordersStore.currentOrder.tax?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping:</span>
              <span>${{ ordersStore.currentOrder.shipping?.toFixed(2) || '0.00' }}</span>
            </div>
            <hr class="my-2">
            <div class="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${{ ordersStore.currentOrder.total?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
      <p class="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
      <router-link to="/orders" class="btn-primary">
        Back to Orders
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '../stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()

const orderId = computed(() => route.params.id)
const newStatus = ref('')
const statusNotes = ref('')

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

const updateStatus = async () => {
  try {
    await ordersStore.updateOrderStatus(orderId.value, newStatus.value, statusNotes.value)
    newStatus.value = ''
    statusNotes.value = ''
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

onMounted(async () => {
  await ordersStore.fetchOrder(orderId.value)
  if (ordersStore.currentOrder) {
    newStatus.value = ordersStore.currentOrder.status
  }
})
</script>
