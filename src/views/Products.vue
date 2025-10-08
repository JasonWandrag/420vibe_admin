<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
        <p class="text-sm sm:text-base text-gray-600">Manage your product catalog</p>
      </div>
      <router-link to="/products/new" class="btn-primary text-sm sm:text-base px-4 py-2">
        <span class="mr-2">➕</span>
        Add Product
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card p-4 sm:p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="form-label text-xs sm:text-sm">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="input-field text-sm"
          />
        </div>
        <div>
          <label class="form-label text-xs sm:text-sm">Category</label>
          <select v-model="filters.category" class="input-field text-sm">
            <option value="">All Categories</option>
            <option value="flower">Flower</option>
            <option value="vape">Vape</option>
            <option value="edibles">Edibles</option>
            <option value="concentrates">Concentrates</option>
            <option value="accessories">Accessories</option>
          </select>
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
          <label class="form-label text-xs sm:text-sm">Featured</label>
          <select v-model="filters.featured" class="input-field text-sm">
            <option value="">All Products</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-xs sm:text-sm">Product</th>
              <th class="text-xs sm:text-sm">Category</th>
              <th class="text-xs sm:text-sm">Price</th>
              <th class="text-xs sm:text-sm">Status</th>
              <th class="text-xs sm:text-sm">Featured</th>
              <th class="text-xs sm:text-sm">Created</th>
              <th class="text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="flex items-center">
                  <img 
                    v-if="product.image" 
                    :src="product.image" 
                    :alt="product.name"
                    class="image-preview-small mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <div>
                    <div class="font-medium text-gray-900 text-xs sm:text-sm">{{ product.name }}</div>
                    <div class="text-xs text-gray-500 hidden sm:block">{{ product.description?.substring(0, 50) }}...</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="font-medium text-xs sm:text-sm">R{{ product.price?.toFixed(2) || '0.00' }}</td>
              <td>
                <button
                  @click="toggleProductStatus(product.id)"
                  class="status-badge cursor-pointer text-xs"
                  :class="product.active ? 'status-active' : 'status-inactive'"
                >
                  {{ product.active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td>
                <button
                  @click="toggleFeatured(product.id)"
                  class="status-badge cursor-pointer text-xs"
                  :class="product.featured ? 'status-active' : 'status-inactive'"
                >
                  {{ product.featured ? 'Yes' : 'No' }}
                </button>
              </td>
              <td class="text-xs sm:text-sm">{{ formatDate(product.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-1 sm:space-x-2">
                  <router-link
                    :to="`/products/${product.id}/edit`"
                    class="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    ✏️
                  </router-link>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-500 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-8 sm:py-12">
        <span class="text-4xl sm:text-6xl text-gray-400 mx-auto mb-3 sm:mb-4 block">📦</span>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-sm sm:text-base text-gray-600 mb-4">Get started by adding your first product.</p>
        <router-link to="/products/new" class="btn-primary text-sm sm:text-base px-4 py-2">
          Add Product
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
// Icons removed - using emojis instead

const productsStore = useProductsStore()

const filters = ref({
  search: '',
  category: '',
  status: '',
  featured: ''
})

const filteredProducts = computed(() => {
  let filtered = productsStore.products

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search)
    )
  }

  // Category filter
  if (filters.value.category) {
    filtered = filtered.filter(product => product.category === filters.value.category)
  }

  // Status filter
  if (filters.value.status) {
    const isActive = filters.value.status === 'active'
    filtered = filtered.filter(product => product.active === isActive)
  }

  // Featured filter
  if (filters.value.featured) {
    const isFeatured = filters.value.featured === 'true'
    filtered = filtered.filter(product => product.featured === isFeatured)
  }

  return filtered
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString()
}

const toggleProductStatus = async (id) => {
  try {
    await productsStore.toggleProductStatus(id)
  } catch (error) {
    console.error('Error toggling product status:', error)
  }
}

const toggleFeatured = async (id) => {
  try {
    await productsStore.toggleFeatured(id)
  } catch (error) {
    console.error('Error toggling featured status:', error)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>
