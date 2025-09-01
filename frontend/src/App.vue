<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-white">
        <div class="container">
          <!-- Logo -->
          <router-link class="navbar-brand" to="/">
            <h2 class="mb-0 text-primary fw-bold">Toy Time Treasures</h2>
          </router-link>

          <!-- Mobile Toggle -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <!-- Navigation Menu -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Categories
                  <span v-if="isLoadingCategories" class="spinner-border spinner-border-sm ms-1" role="status"></span>
                </a>
                <ul class="dropdown-menu">
                  <li v-if="isLoadingCategories" class="dropdown-item text-muted">
                    <small>Loading categories...</small>
                  </li>
                  <li v-else-if="categories.length === 0" class="dropdown-item text-muted">
                    <small>No categories available</small>
                  </li>
                  <li v-else v-for="category in categories" :key="category.id">
                    <router-link class="dropdown-item" :to="`/category/${category.slug}`">
                      {{ category.name }}
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/products">Products</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/about">About</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/contact">Contact</router-link>
              </li>
            </ul>

            <!-- Search Bar -->
            <form class="d-flex me-3" @submit.prevent="searchProducts">
              <input 
                class="form-control me-2" 
                type="search" 
                placeholder="Search products..." 
                v-model="searchQuery"
                aria-label="Search"
              >
              <button class="btn btn-outline-primary" type="submit">
                <i class="fas fa-search"></i>
              </button>
            </form>

            <!-- User Menu -->
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-shopping-cart"></i>
                  <span class="badge bg-primary ms-1">{{ cartItemCount }}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end p-3" style="min-width: 300px;">
                  <li v-if="cartStore.cartItems.length === 0"><div class="text-center">Cart is empty</div></li>
                  <li v-for="it in cartStore.cartItems" :key="it.id" class="d-flex align-items-center mb-2">
                    <div style="flex:1">
                      <div class="small">{{ it.name || 'Product' }}</div>
                      <div class="small text-muted">Qty: {{ it.quantity }}</div>
                    </div>
                    <div class="ms-2">
                      <button class="btn btn-sm btn-outline-secondary me-1" @click.prevent="cartStore.decrement(it.id)">-</button>
                      <button class="btn btn-sm btn-outline-secondary" @click.prevent="cartStore.increment(it.id)">+</button>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li class="d-grid"><router-link class="btn btn-primary" to="/cart">Go to cart</router-link></li>
                </ul>
              </li>
              <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user-circle me-1"></i>
                  {{ authStore.userFullName }}
                </a>
                <ul class="dropdown-menu">
                  <li v-if="authStore.isAdmin"><h6 class="dropdown-header">Admin</h6></li>
                  <li v-if="authStore.isAdmin"><router-link class="dropdown-item" to="/admin/products"><i class="fas fa-boxes me-2"></i>Products</router-link></li>
                  <li v-if="authStore.isAdmin"><router-link class="dropdown-item" to="/admin/categories"><i class="fas fa-list me-2"></i>Categories</router-link></li>
                  <li v-if="authStore.isAdmin"><router-link class="dropdown-item" to="/admin/orders"><i class="fas fa-receipt me-2"></i>Orders</router-link></li>
            <li v-if="authStore.isAdmin"><router-link class="dropdown-item" to="/admin/settings"><i class="fas fa-cog me-2"></i>Site Settings</router-link></li>
                  <li v-if="authStore.isAdmin"><hr class="dropdown-divider"></li>
                  <li><router-link class="dropdown-item" to="/profile">
                    <i class="fas fa-user me-2"></i>Profile
                  </router-link></li>
                  <li><router-link class="dropdown-item" to="/orders">
                    <i class="fas fa-shopping-bag me-2"></i>My Orders
                  </router-link></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item" @click="handleLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                  </button></li>
                </ul>
              </li>
              <li class="nav-item dropdown" v-else>
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user"></i>
                </a>
                <ul class="dropdown-menu">
                  <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
                  <li><router-link class="dropdown-item" to="/register">Register</router-link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer bg-dark text-white py-5 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 mb-4">
            <h5 class="mb-3">Toy Time Treasures</h5>
            <p class="text-muted">Your one-stop destination for quality toys and treasures. We offer the best selection with competitive prices and excellent customer service.</p>
            <div class="social-links">
              <a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="col-lg-2 mb-4">
            <h6 class="mb-3">Quick Links</h6>
            <ul class="list-unstyled">
              <li><router-link to="/products" class="text-muted text-decoration-none">Products</router-link></li>
              <li><router-link to="/about" class="text-muted text-decoration-none">About</router-link></li>
              <li><router-link to="/contact" class="text-muted text-decoration-none">Contact</router-link></li>
            </ul>
          </div>
          <div class="col-lg-3 mb-4">
            <h6 class="mb-3">Categories</h6>
            <ul class="list-unstyled">
              <li v-for="category in categories.slice(0, 5)" :key="category.id">
                <router-link :to="`/category/${category.slug}`" class="text-muted text-decoration-none">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="col-lg-3 mb-4">
            <h6 class="mb-3">Contact Info</h6>
            <p class="text-muted mb-2">
              <i class="fas fa-map-marker-alt me-2"></i>
              123 Toy Street, Play City, PC 12345
            </p>
            <p class="text-muted mb-2">
              <i class="fas fa-phone me-2"></i>
              +1 234 567 8900
            </p>
            <p class="text-muted mb-2">
              <i class="fas fa-envelope me-2"></i>
              info@toytimetreasures.com
            </p>
          </div>
        </div>
        <hr class="my-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="text-muted mb-0">&copy; 2024 Toy Time Treasures. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="payment-methods-placeholder">
              <i class="fab fa-cc-visa fa-2x me-2"></i>
              <i class="fab fa-cc-mastercard fa-2x me-2"></i>
              <i class="fab fa-cc-paypal fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!-- Global Toast -->
    <div class="global-toast-wrapper" v-if="toast.visible">
      <div :class="['global-toast', toast.type === 'success' ? 'bg-success' : toast.type === 'danger' ? 'bg-danger' : 'bg-light']">
        <i v-if="toast.type === 'success'" class="fas fa-check-circle"></i>
        <i v-else-if="toast.type === 'danger'" class="fas fa-exclamation-circle"></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
  const productStore = useProductStore()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
  const toast = useToastStore()
    
  const categories = computed(() => productStore?.categories || [])
  const isLoadingCategories = computed(() => productStore?.loading || false)
    const searchQuery = ref('')
  const cartItemCount = computed(() => cartStore.totalItems)

  // delegate category/featured product loading to the product store

    const searchProducts = () => {
      if (searchQuery.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
        searchQuery.value = ''
      }
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    // Watch for changes in categories
    watch(() => productStore?.categories, (newCategories) => {
      console.log('[App] Categories changed:', newCategories)
      console.log('[App] Categories count:', newCategories?.length || 0)
    }, { immediate: true })

    // Watch for loading state changes
    watch(() => productStore?.loading, (isLoading) => {
      console.log('[App] Loading state changed:', isLoading)
    }, { immediate: true })

    onMounted(() => {
      // trigger product store loads early so Home and other views have data
      console.log('[App] onMounted: triggering productStore.fetchCategories and fetchFeaturedProducts')
      console.log('[App] Initial productStore state:', {
        loading: productStore?.loading,
        categories: productStore?.categories,
        categoriesLength: productStore?.categories?.length
      })
      
      productStore.fetchCategories()
        .then(() => {
          console.log('[App] fetchCategories finished, categories count:', productStore?.categories?.length || 0)
          console.log('[App] categories:', productStore?.categories)
        })
        .catch((e) => console.error('[App] fetchCategories error', e))
      
      productStore.fetchFeaturedProducts()
        .then(() => console.log('[App] fetchFeaturedProducts finished'))
        .catch((e) => console.error('[App] fetchFeaturedProducts error', e))
    })

    return {
      categories,
      isLoadingCategories,
      searchQuery,
      cartItemCount,
      searchProducts,
      authStore,
      cartStore,
      handleLogout,
      toast
    }
  }
}
</script>

<style scoped>
.header {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
}

.navbar-brand h2 {
  color: #007bff !important;
}

.nav-link {
  font-weight: 500;
  color: #333 !important;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #007bff !important;
}

.social-links a {
  font-size: 1.2rem;
  transition: opacity 0.3s ease;
}

.social-links a:hover {
  opacity: 0.7;
}

.payment-methods-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Global toast styles */
.global-toast-wrapper { position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 1080; }
.global-toast { display:flex; align-items:center; gap:.5rem; padding:.5rem .75rem; border-radius:.5rem; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
.global-toast.bg-success { background:#198754; color:white; }
.global-toast.bg-danger { border:1px solid rgba(220,53,69,0.9); background:white; color:black; }
.global-toast.bg-light { background:white; color:black; border:1px solid rgba(0,0,0,0.06); }

</style>
