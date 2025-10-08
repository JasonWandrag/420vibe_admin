import { defineStore } from 'pinia'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
    currentOrder: null,
    stats: {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  }),

  getters: {
    ordersByStatus: (state) => (status) => {
      return state.orders.filter(order => order.status === status)
    },
    recentOrders: (state) => {
      return state.orders.slice(0, 10)
    },
    totalRevenue: (state) => {
      return state.orders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + order.total, 0)
    }
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const ordersRef = collection(db, 'orders')
        const q = query(ordersRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        this.calculateStats()
      } catch (error) {
        this.error = error.message
        console.error('Error fetching orders:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id) {
      this.loading = true
      this.error = null

      try {
        const orderDoc = await getDoc(doc(db, 'orders', id))
        if (orderDoc.exists()) {
          this.currentOrder = {
            id: orderDoc.id,
            ...orderDoc.data()
          }
        } else {
          throw new Error('Order not found')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching order:', error)
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(id, status, notes = '') {
      this.loading = true
      this.error = null

      try {
        const orderRef = doc(db, 'orders', id)
        const updateData = {
          status,
          updatedAt: new Date()
        }

        if (notes) {
          updateData.adminNotes = notes
        }

        // Add status history
        const order = this.orders.find(o => o.id === id)
        if (order) {
          const statusHistory = order.statusHistory || []
          statusHistory.push({
            status,
            timestamp: new Date(),
            notes
          })
          updateData.statusHistory = statusHistory
        }

        await updateDoc(orderRef, updateData)

        // Update local state
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            ...updateData
          }
        }

        // Update current order if it's the same
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = {
            ...this.currentOrder,
            ...updateData
          }
        }

        this.calculateStats()
      } catch (error) {
        this.error = error.message
        console.error('Error updating order status:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    calculateStats() {
      this.stats = {
        total: this.orders.length,
        pending: this.orders.filter(o => o.status === 'pending').length,
        processing: this.orders.filter(o => o.status === 'processing').length,
        shipped: this.orders.filter(o => o.status === 'shipped').length,
        delivered: this.orders.filter(o => o.status === 'delivered').length,
        cancelled: this.orders.filter(o => o.status === 'cancelled').length
      }
    },

    clearError() {
      this.error = null
    },

    clearCurrentOrder() {
      this.currentOrder = null
    }
  }
})
