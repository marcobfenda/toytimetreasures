import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Category from '@/views/Category.vue'
import Search from '@/views/Search.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import OrderSuccess from '@/views/OrderSuccess.vue'
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import Orders from '@/views/Orders.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/product/:slug',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success/:orderId',
    name: 'OrderSuccess',
    component: OrderSuccess
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/admin/contacts',
    name: 'AdminContacts',
    component: () => import('@/views/AdminContacts.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: () => import('@/views/AdminCategories.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('@/views/AdminProducts.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('@/views/AdminOrders.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/AdminSettings.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global auth guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta && to.meta.requiresAuth
  const requiresAdmin = to.meta && to.meta.requiresAdmin
  
  if (!requiresAuth) return next()

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (!isAuthenticated) {
    // Redirect to login with intended return URL
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Check admin access if required
  if (requiresAdmin) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    console.log('Admin check:', { 
      route: to.path, 
      requiresAdmin, 
      isAuthenticated, 
      isAdmin, 
      user: localStorage.getItem('user'),
      adminFlag: localStorage.getItem('isAdmin'),
      parsedUser: (() => {
        try {
          const userStr = localStorage.getItem('user')
          return userStr ? JSON.parse(userStr) : null
        } catch (e) {
          return 'Parse error: ' + e.message
        }
      })()
    })
    if (!isAdmin) {
      // Redirect non-admin users to home page
      return next({ name: 'Home' })
    }
  }

  next()
})

export default router
