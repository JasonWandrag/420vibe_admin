<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
        <p class="text-gray-600">Manage customer accounts</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-gray-900">{{ usersStore.stats.total }}</p>
          <p class="text-sm text-gray-500">Total Users</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-green-600">{{ usersStore.stats.active }}</p>
          <p class="text-sm text-gray-500">Active Users</p>
        </div>
      </div>
      <div class="card p-4">
        <div class="text-center">
          <p class="text-2xl font-semibold text-gray-600">{{ usersStore.stats.inactive }}</p>
          <p class="text-sm text-gray-500">Inactive Users</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search users..."
            class="input-field"
          />
        </div>
        <div>
          <label class="form-label">Status</label>
          <select v-model="filters.status" class="input-field">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-white">
                      {{ user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium">{{ user.name || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user.id.slice(-8) }}</div>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <button
                  @click="toggleUserStatus(user.id)"
                  class="status-badge cursor-pointer"
                  :class="user.status === 'active' ? 'status-active' : 'status-inactive'"
                >
                  {{ user.status || 'active' }}
                </button>
              </td>
              <td>{{ user.orderCount || 0 }}</td>
              <td class="font-medium">${{ user.totalSpent?.toFixed(2) || '0.00' }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <router-link
                    :to="`/users/${user.id}`"
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
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <span class="text-6xl text-gray-400 mx-auto mb-4 block">👥</span>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-600">Users will appear here when they register.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'
// Icons removed - using emojis instead

const usersStore = useUsersStore()

const filters = ref({
  search: '',
  status: '',
  dateFrom: ''
})

const filteredUsers = computed(() => {
  let filtered = usersStore.users

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(user =>
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(user => (user.status || 'active') === filters.value.status)
  }

  // Date filter
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    filtered = filtered.filter(user => {
      const userDate = new Date(user.createdAt?.seconds ? user.createdAt.seconds * 1000 : user.createdAt)
      return userDate >= fromDate
    })
  }

  return filtered
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

const toggleUserStatus = async (id) => {
  try {
    const user = usersStore.users.find(u => u.id === id)
    const newStatus = (user.status || 'active') === 'active' ? 'inactive' : 'active'
    await usersStore.updateUserStatus(id, newStatus)
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script>
