<template>
  <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Product' : 'Add New Product' }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600">
          {{ isEditing ? 'Update product information' : 'Create a new product for your store' }}
        </p>
      </div>
      <router-link to="/products" class="btn-secondary text-sm sm:text-base px-4 py-2">
        Back to Products
      </router-link>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <!-- Basic Information -->
          <div class="card p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Product Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input-field text-sm"
                  placeholder="Enter product name"
                />
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Category *</label>
                <select v-model="form.category" required class="input-field text-sm">
                  <option value="">Select category</option>
                  <option value="flower">Flower</option>
                  <option value="vape">Vape</option>
                  <option value="edibles">Edibles</option>
                  <option value="concentrates">Concentrates</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Price *</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="input-field text-sm"
                  placeholder="0.00"
                />
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Rating</label>
                <input
                  v-model.number="form.rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  class="input-field text-sm"
                  placeholder="4.5"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label text-xs sm:text-sm">Description *</label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="input-field text-sm"
                placeholder="Enter product description"
              ></textarea>
            </div>
          </div>

          <!-- Product Details -->
          <div class="card p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Product Details</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">THC Content (%)</label>
                <input
                  v-model.number="form.thc"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  class="input-field text-sm"
                  placeholder="22.0"
                />
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">CBD Content (%)</label>
                <input
                  v-model.number="form.cbd"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  class="input-field text-sm"
                  placeholder="1.0"
                />
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Strain Type</label>
                <select v-model="form.strainType" class="input-field text-sm">
                  <option value="">Select strain type</option>
                  <option value="Indica">Indica</option>
                  <option value="Sativa">Sativa</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label text-xs sm:text-sm">Effects</label>
                <input
                  v-model="form.effects"
                  type="text"
                  class="input-field text-sm"
                  placeholder="Relaxing, Sleepy, Happy"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Image Upload -->
          <div class="card p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Product Image</h3>
            
            <div class="space-y-3 sm:space-y-4">
              <!-- Image Preview -->
              <div v-if="form.image" class="relative">
                <img :src="form.image" alt="Product preview" class="image-preview" />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <!-- Upload Button -->
              <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="btn-secondary w-full text-sm"
                >
                  <span class="mr-2">📷</span>
                  Upload Image
                </button>
                <p class="text-xs sm:text-sm text-gray-500 mt-2">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div class="card p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Settings</h3>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-xs sm:text-sm font-medium text-gray-700">Active</label>
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-xs sm:text-sm font-medium text-gray-700">Featured</label>
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card p-4 sm:p-6">
            <div class="space-y-2 sm:space-y-3">
              <button
                type="submit"
                :disabled="productsStore.loading"
                class="btn-primary w-full text-sm sm:text-base"
              >
                {{ productsStore.loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product') }}
              </button>
              
              <router-link to="/products" class="btn-secondary w-full text-center text-sm sm:text-base">
                Cancel
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
// Icons removed - using emojis instead

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const isEditing = computed(() => !!route.params.id)

const form = ref({
  name: '',
  category: '',
  price: 0,
  rating: 0,
  description: '',
  thc: 0,
  cbd: 0,
  strainType: '',
  effects: '',
  image: '',
  active: true,
  featured: false
})

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    productsStore.validateImageFile(file)
    const base64 = await productsStore.fileToBase64(file)
    form.value.image = base64
  } catch (error) {
    alert(error.message)
  }
}

const removeImage = () => {
  form.value.image = ''
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await productsStore.updateProduct(route.params.id, form.value)
    } else {
      await productsStore.createProduct(form.value)
    }
    router.push('/products')
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

onMounted(async () => {
  if (isEditing.value) {
    await productsStore.fetchProduct(route.params.id)
    if (productsStore.currentProduct) {
      form.value = { ...productsStore.currentProduct }
    }
  }
})
</script>
