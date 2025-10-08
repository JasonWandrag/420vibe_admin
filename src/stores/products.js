import { defineStore } from 'pinia'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null
  }),

  getters: {
    productsByCategory: (state) => (category) => {
      return state.products.filter(product => product.category === category)
    },
    featuredProducts: (state) => {
      return state.products.filter(product => product.featured === true)
    },
    totalProducts: (state) => state.products.length
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const productsRef = collection(db, 'products')
        const q = query(productsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        this.error = error.message
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id) {
      this.loading = true
      this.error = null

      try {
        const productDoc = await getDoc(doc(db, 'products', id))
        if (productDoc.exists()) {
          this.currentProduct = {
            id: productDoc.id,
            ...productDoc.data()
          }
        } else {
          throw new Error('Product not found')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData) {
      this.loading = true
      this.error = null

      try {
        const productRef = collection(db, 'products')
        const newProduct = {
          ...productData,
          createdAt: new Date(),
          updatedAt: new Date(),
          featured: false,
          active: true
        }

        const docRef = await addDoc(productRef, newProduct)
        
        // Add to local state
        this.products.unshift({
          id: docRef.id,
          ...newProduct
        })

        return docRef.id
      } catch (error) {
        this.error = error.message
        console.error('Error creating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, productData) {
      this.loading = true
      this.error = null

      try {
        const productRef = doc(db, 'products', id)
        const updateData = {
          ...productData,
          updatedAt: new Date()
        }

        await updateDoc(productRef, updateData)

        // Update local state
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...updateData
          }
        }

        // Update current product if it's the same
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = {
            ...this.currentProduct,
            ...updateData
          }
        }
      } catch (error) {
        this.error = error.message
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id) {
      this.loading = true
      this.error = null

      try {
        await deleteDoc(doc(db, 'products', id))

        // Remove from local state
        this.products = this.products.filter(p => p.id !== id)

        // Clear current product if it's the same
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleProductStatus(id) {
      const product = this.products.find(p => p.id === id)
      if (product) {
        await this.updateProduct(id, { active: !product.active })
      }
    },

    async toggleFeatured(id) {
      const product = this.products.find(p => p.id === id)
      if (product) {
        await this.updateProduct(id, { featured: !product.featured })
      }
    },

    // Helper function to convert file to base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },

    // Helper function to validate image file
    validateImageFile(file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.')
      }

      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload an image smaller than 5MB.')
      }

      return true
    },

    clearError() {
      this.error = null
    },

    clearCurrentProduct() {
      this.currentProduct = null
    }
  }
})
