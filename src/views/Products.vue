<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
        <p class="text-gray-600">Manage your product catalog</p>
      </div>
      <router-link to="/products/new" class="btn-primary">
        <span class="mr-2">➕</span>
        Add Product
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="input-field"
          />
        </div>
        <div>
          <label class="form-label">Category</label>
          <select v-model="filters.category" class="input-field">
            <option value="">All Categories</option>
            <option value="flower">Flower</option>
            <option value="vape">Vape</option>
            <option value="edibles">Edibles</option>
            <option value="concentrates">Concentrates</option>
            <option value="accessories">Accessories</option>
          </select>
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
          <label class="form-label">Featured</label>
          <select v-model="filters.featured" class="input-field">
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
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Created</th>
              <th>Actions</th>
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
                    class="image-preview-small mr-3"
                  />
                  <div>
                    <div class="font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.description?.substring(0, 50) }}...</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="font-medium">${{ product.price?.toFixed(2) || '0.00' }}</td>
              <td>
                <button
                  @click="toggleProductStatus(product.id)"
                  class="status-badge cursor-pointer"
                  :class="product.active ? 'status-active' : 'status-inactive'"
                >
                  {{ product.active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td>
                <button
                  @click="toggleFeatured(product.id)"
                  class="status-badge cursor-pointer"
                  :class="product.featured ? 'status-active' : 'status-inactive'"
                >
                  {{ product.featured ? 'Yes' : 'No' }}
                </button>
              </td>
              <td>{{ formatDate(product.createdAt) }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <router-link
                    :to="`/products/${product.id}/edit`"
                    class="text-primary-600 hover:text-primary-500"
                  >
                    ✏️
                  </router-link>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-500"
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
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <span class="text-6xl text-gray-400 mx-auto mb-4 block">📦</span>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-600 mb-4">Get started by adding your first product.</p>
        <router-link to="/products/new" class="btn-primary">
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
