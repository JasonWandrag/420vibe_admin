import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isAdmin: false
  }),

  getters: {
    userDisplayName: (state) => state.user?.displayName || state.user?.email?.split('@')[0] || 'Admin User',
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    async init() {
      this.loading = true
      
      // BYPASS AUTHENTICATION FOR DEVELOPMENT
      this.user = { 
        uid: 'dev-user', 
        email: 'dev@420vibe.com', 
        displayName: 'Dev User' 
      }
      this.isAuthenticated = true
      this.isAdmin = true
      this.loading = false
      
      return Promise.resolve(this.user)
      
      // Original authentication code (commented out)
      /*
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.user = user
          this.isAuthenticated = !!user
          
          if (user) {
            await this.checkAdminStatus(user.uid)
          } else {
            this.isAdmin = false
          }
          
          this.loading = false
          resolve(user)
        })
      })
      */
    },

    async checkAdminStatus(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'adminUsers', uid))
        this.isAdmin = userDoc.exists() && userDoc.data().isAdmin === true
      } catch (error) {
        console.error('Error checking admin status:', error)
        this.isAdmin = false
      }
    },

    async signIn(email, password) {
      this.loading = true
      this.error = null

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // Check if user is admin
        await this.checkAdminStatus(user.uid)
        
        if (!this.isAdmin) {
          await this.signOut()
          throw new Error('Access denied. Admin privileges required.')
        }

        return user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAdmin(email, password, displayName) {
      this.loading = true
      this.error = null

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Create admin user document
        await setDoc(doc(db, 'adminUsers', user.uid), {
          email: email,
          displayName: displayName,
          isAdmin: true,
          createdAt: new Date(),
          createdBy: this.user?.uid || 'system'
        })

        return user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      this.error = null

      try {
        await signOut(auth)
        this.user = null
        this.isAuthenticated = false
        this.isAdmin = false
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
