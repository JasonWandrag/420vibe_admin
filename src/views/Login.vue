<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Admin Portal
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Sign in to access the 420Vibe admin dashboard
      </p>
    </div>
    
    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ authStore.error }}
            </h3>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
        <p class="text-xs text-gray-600">Email: admin@420vibe.com</p>
        <p class="text-xs text-gray-600">Password: admin123</p>
        
        <!-- Generate Data Button -->
        <button
          @click="generateData"
          :disabled="isGenerating"
          class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isGenerating ? 'Generating...' : 'Generate Data' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc,
  getDocs
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const isGenerating = ref(false)

const handleLogin = async () => {
  try {
    await authStore.signIn(form.value.email, form.value.password)
    router.push('/')
  } catch (error) {
    // Error is handled by the store
  }
}

const generateData = async () => {
  isGenerating.value = true
  
  try {
    // Create admin user
    await createAdminUser()
    
    // Seed products
    await seedProducts()
    
    // Seed users
    await seedUsers()
    
    // Seed orders
    await seedOrders()
    
    alert('Data generated successfully! You can now login with admin@420vibe.com / admin123')
  } catch (error) {
    console.error('Error generating data:', error)
    alert('Error generating data: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

const createAdminUser = async () => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@420vibe.com', 
      'admin123'
    )
    
    // Create admin user document
    await setDoc(doc(db, 'adminUsers', userCredential.user.uid), {
      email: 'admin@420vibe.com',
      displayName: 'Admin User',
      isAdmin: true,
      createdAt: new Date(),
      createdBy: 'system'
    })
    
    console.log('Admin user created successfully')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists')
    } else {
      throw error
    }
  }
}

const seedProducts = async () => {
  const products = [
    {
      name: 'Premium OG Kush',
      category: 'flower',
      price: 45.00,
      rating: 4.8,
      description: 'Classic indica-dominant strain with earthy, pine flavors and relaxing effects. Perfect for evening use and stress relief.',
      thc: 22,
      cbd: 1,
      strainType: 'Indica',
      effects: 'Relaxing, Sleepy, Happy',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkQ1MDU3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJlbWl1bSBPRyBLdXNoPC90ZXh0Pgo8L3N2Zz4K',
      active: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Blue Dream Vape Cart',
      category: 'vape',
      price: 35.00,
      rating: 4.9,
      description: 'Smooth sativa-dominant hybrid with sweet berry flavors and uplifting effects. Great for daytime use.',
      thc: 18,
      cbd: 2,
      strainType: 'Sativa',
      effects: 'Uplifting, Creative, Energetic',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA2NkNDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Qmx1ZSBEcmVhbTwvdGV4dD4KPC9zdmc+Cg==',
      active: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CBD Gummies',
      category: 'edibles',
      price: 25.00,
      rating: 4.7,
      description: 'Delicious mixed berry gummies with 10mg CBD each for relaxation and wellness.',
      thc: 0,
      cbd: 10,
      strainType: 'CBD',
      effects: 'Relaxing, Calming',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY2QkI3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q0JEIEd1bW1pZXM8L3RleHQ+Cjwvc3ZnPgo=',
      active: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sour Diesel',
      category: 'flower',
      price: 42.00,
      rating: 4.6,
      description: 'Energizing sativa with diesel-like aroma and uplifting cerebral effects.',
      thc: 20,
      cbd: 1,
      strainType: 'Sativa',
      effects: 'Energetic, Uplifting, Creative',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNkI0NDI3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U291ciBEaWVzZWw8L3RleHQ+Cjwvc3ZnPgo=',
      active: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Gelato Live Resin',
      category: 'concentrates',
      price: 55.00,
      rating: 4.9,
      description: 'Premium live resin with sweet, dessert-like flavors and balanced effects.',
      thc: 25,
      cbd: 2,
      strainType: 'Hybrid',
      effects: 'Relaxing, Happy, Euphoric',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY5OUE5Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2VsYXRvPC90ZXh0Pgo8L3N2Zz4K',
      active: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  for (const product of products) {
    await addDoc(collection(db, 'products'), product)
  }
  
  console.log('Products seeded successfully')
}

const seedUsers = async () => {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      orderCount: 3,
      totalSpent: 125.50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      orderCount: 2,
      totalSpent: 89.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      orderCount: 1,
      totalSpent: 45.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      orderCount: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  for (const user of users) {
    await addDoc(collection(db, 'users'), user)
  }
  
  console.log('Users seeded successfully')
}

const seedOrders = async () => {
  const orders = [
    {
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567'
      },
      items: [
        {
          id: '1',
          name: 'Premium OG Kush',
          price: 45.00,
          quantity: 1,
          category: 'flower',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkQ1MDU3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJlbWl1bSBPRyBLdXNoPC90ZXh0Pgo8L3N2Zz4K'
        }
      ],
      subtotal: 45.00,
      tax: 4.50,
      shipping: 5.00,
      total: 54.50,
      status: 'delivered',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          notes: 'Order placed'
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          notes: 'Order confirmed'
        },
        {
          status: 'shipped',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'Package shipped'
        },
        {
          status: 'delivered',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Package delivered'
        }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 234-5678'
      },
      items: [
        {
          id: '2',
          name: 'Blue Dream Vape Cart',
          price: 35.00,
          quantity: 2,
          category: 'vape',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA2NkNDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Qmx1ZSBEcmVhbTwvdGV4dD4KPC9zdmc+Cg=='
        }
      ],
      subtotal: 70.00,
      tax: 7.00,
      shipping: 5.00,
      total: 82.00,
      status: 'shipped',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          notes: 'Order placed'
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'Order confirmed'
        },
        {
          status: 'shipped',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Package shipped'
        }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 345-6789'
      },
      items: [
        {
          id: '3',
          name: 'CBD Gummies',
          price: 25.00,
          quantity: 1,
          category: 'edibles',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY2QkI3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q0JEIEd1bW1pZXM8L3RleHQ+Cjwvc3ZnPgo='
        }
      ],
      subtotal: 25.00,
      tax: 2.50,
      shipping: 5.00,
      total: 32.50,
      status: 'processing',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Order placed'
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          notes: 'Order confirmed'
        }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ]

  for (const order of orders) {
    await addDoc(collection(db, 'orders'), order)
  }
  
  console.log('Orders seeded successfully')
}

onMounted(() => {
  // Clear any previous errors
  authStore.clearError()
})
</script>
