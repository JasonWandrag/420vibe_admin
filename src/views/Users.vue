<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Users</h1>
        <p class="text-sm sm:text-base text-gray-600">Manage customer accounts</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div class="card p-3 sm:p-4">
        <div class="text-center">
          <p class="text-lg sm:text-2xl font-semibold text-gray-900">{{ usersStore.stats.total }}</p>
          <p class="text-xs sm:text-sm text-gray-500">Total Users</p>
        </div>
      </div>
      <div class="card p-3 sm:p-4">
        <div class="text-center">
          <p class="text-lg sm:text-2xl font-semibold text-green-600">{{ usersStore.stats.active }}</p>
          <p class="text-xs sm:text-sm text-gray-500">Active Users</p>
        </div>
      </div>
      <div class="card p-3 sm:p-4">
        <div class="text-center">
          <p class="text-lg sm:text-2xl font-semibold text-gray-600">{{ usersStore.stats.inactive }}</p>
          <p class="text-xs sm:text-sm text-gray-500">Inactive Users</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 sm:p-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="form-label text-xs sm:text-sm">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search users..."
            class="input-field text-sm"
          />
        </div>
        <div>
          <label class="form-label text-xs sm:text-sm">Status</label>
          <select v-model="filters.status" class="input-field text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label class="form-label text-xs sm:text-sm">Date From</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="input-field text-sm"
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
              <th class="text-xs sm:text-sm">User</th>
              <th class="text-xs sm:text-sm">Email</th>
              <th class="text-xs sm:text-sm">Status</th>
              <th class="text-xs sm:text-sm">Orders</th>
              <th class="text-xs sm:text-sm">Total Spent</th>
              <th class="text-xs sm:text-sm">Joined</th>
              <th class="text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <div class="flex items-center">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-xs sm:text-sm font-medium text-white">
                      {{ user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium text-xs sm:text-sm">{{ user.name || 'N/A' }}</div>
                    <div class="text-xs text-gray-500 hidden sm:block">ID: {{ user.id.slice(-8) }}</div>
                  </div>
                </div>
              </td>
              <td class="text-xs sm:text-sm">{{ user.email }}</td>
              <td>
                <button
                  @click="toggleUserStatus(user.id)"
                  class="status-badge cursor-pointer text-xs"
                  :class="user.status === 'active' ? 'status-active' : 'status-inactive'"
                >
                  {{ user.status || 'active' }}
                </button>
              </td>
              <td class="text-xs sm:text-sm">{{ user.orderCount || 0 }}</td>
              <td class="font-medium text-xs sm:text-sm">R{{ user.totalSpent?.toFixed(2) || '0.00' }}</td>
              <td class="text-xs sm:text-sm">{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-1 sm:space-x-2">
                  <router-link
                    :to="`/users/${user.id}`"
                    class="text-primary-600 hover:text-primary-500 text-sm"
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
      <div v-if="filteredUsers.length === 0" class="text-center py-8 sm:py-12">
        <span class="text-4xl sm:text-6xl text-gray-400 mx-auto mb-3 sm:mb-4 block">👥</span>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-sm sm:text-base text-gray-600">Users will appear here when they register.</p>
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
