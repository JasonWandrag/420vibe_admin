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

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    currentUser: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0
    }
  }),

  getters: {
    activeUsers: (state) => {
      return state.users.filter(user => user.status === 'active')
    },
    recentUsers: (state) => {
      return state.users.slice(0, 10)
    }
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        this.calculateStats()
      } catch (error) {
        this.error = error.message
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      this.error = null

      try {
        const userDoc = await getDoc(doc(db, 'users', id))
        if (userDoc.exists()) {
          this.currentUser = {
            id: userDoc.id,
            ...userDoc.data()
          }
        } else {
          throw new Error('User not found')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching user:', error)
      } finally {
        this.loading = false
      }
    },

    async updateUserStatus(id, status) {
      this.loading = true
      this.error = null

      try {
        const userRef = doc(db, 'users', id)
        const updateData = {
          status,
          updatedAt: new Date()
        }

        await updateDoc(userRef, updateData)

        // Update local state
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...updateData
          }
        }

        // Update current user if it's the same
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = {
            ...this.currentUser,
            ...updateData
          }
        }

        this.calculateStats()
      } catch (error) {
        this.error = error.message
        console.error('Error updating user status:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    calculateStats() {
      this.stats = {
        total: this.users.length,
        active: this.users.filter(u => u.status === 'active').length,
        inactive: this.users.filter(u => u.status === 'inactive').length
      }
    },

    clearError() {
      this.error = null
    },

    clearCurrentUser() {
      this.currentUser = null
    }
  }
})
