<template>
  <div class="category-page">
    <div class="container py-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/products" class="text-decoration-none">Products</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ category?.name || $route.params.slug }}
          </li>
        </ol>
      </nav>

      <!-- Category Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="category-title">{{ category?.name || 'Category' }}</h1>
          <p v-if="category?.description" class="text-muted">{{ category.description }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading products...</p>
      </div>

      <!-- No Products Found -->
      <div v-else-if="!products.length" class="text-center py-5">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          No products found in this category.
        </div>
        <router-link to="/products" class="btn btn-primary">
          <i class="fas fa-arrow-left me-2"></i>
          Browse All Products
        </router-link>
      </div>

      <!-- Products Grid -->
      <div v-else class="row g-4">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="col-lg-4 col-md-6"
        >
          <div class="product-card card h-100 border-0 shadow-sm">
            <div class="product-image-container">
              <img 
                :src="getProductImage(product)" 
                :alt="product.name"
                class="product-image"
                @error="handleImageError"
              />
              <div class="product-overlay">
                <div class="product-actions">
                  <button 
                    @click="addToCart(product)" 
                    class="btn btn-primary btn-sm"
                    title="Add to Cart"
                    :disabled="!product.stock_quantity || product.stock_quantity <= 0"
                  >
                    <i class="fas fa-shopping-cart"></i>
                  </button>
                  <router-link 
                    :to="`/product/${product.slug}`" 
                    class="btn btn-outline-primary btn-sm"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title product-title">{{ product.name }}</h6>
              <p class="card-text text-muted small flex-grow-1">{{ product.short_description }}</p>
              <div class="product-price mt-auto">
                <span v-if="product.sale_price" class="text-decoration-line-through text-muted me-2">
                  ${{ product.price }}
                </span>
                <span class="fw-bold text-primary">
                  ${{ product.sale_price || product.price }}
                </span>
              </div>
              <div class="product-actions mt-3">
                <button 
                  @click="addToCart(product)" 
                  class="btn btn-primary me-2"
                  :disabled="!product.stock_quantity || product.stock_quantity <= 0"
                >
                  <i class="fas fa-shopping-cart me-1"></i>
                  {{ product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock' }}
                </button>
                <router-link 
                  :to="`/product/${product.slug}`" 
                  class="btn btn-outline-primary"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'Category',
  setup() {
    const route = useRoute()
    const cartStore = useCartStore()
    const toastStore = useToastStore()
    
    // State
    const loading = ref(true)
    const products = ref([])
    const category = ref(null)

    // Methods
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories.php?slug=${route.params.slug}`)
        const data = await response.json()
        
        if (data && data.id) {
          category.value = data
          return true
        } else {
          console.error('No category found for slug:', route.params.slug)
          return false
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        return false
      }
    }

    const fetchProducts = async () => {
      if (!category.value || !category.value.id) {
        console.error('Cannot fetch products: no category loaded')
        products.value = []
        return
      }
      
      loading.value = true
      try {
        const response = await fetch('/api/products.php')
        const data = await response.json()
        
        if (data && Array.isArray(data)) {
          // Filter products by category_id with robust comparison
          const categoryId = Number(category.value.id)
          const filteredProducts = data.filter(product => {
            return Number(product.category_id) === categoryId
          })
          
          console.log(`Filtering products for category "${category.value.name}" (ID: ${categoryId})`)
          console.log(`Found ${filteredProducts.length} products out of ${data.length} total`)
          
          products.value = filteredProducts
        } else {
          products.value = []
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        products.value = []
      } finally {
        loading.value = false
      }
    }

    const getProductImage = (product) => {
      if (product.primary_image) {
        return product.primary_image
      }
      return '/images/placeholder-product.jpg'
    }

    const handleImageError = (event) => {
      const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#6c757d">No Image</text></svg>')
      event.target.src = `data:image/svg+xml;utf8,${placeholderSvg}`
    }

    const addToCart = (product) => {
      try {
        const success = cartStore.addToCart(product, 1)
        if (success) {
          toastStore.show('Product added to cart!', 'success')
        } else {
          toastStore.show('Cannot add more of this item to cart', 'warning')
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        toastStore.show('Error adding product to cart', 'error')
      }
    }

    // Watchers
    watch(() => route.params.slug, async () => {
      await fetchCategory()
      if (category.value) {
        await fetchProducts()
      }
    })

    // Lifecycle
    onMounted(async () => {
      await fetchCategory()
      if (category.value) {
        await fetchProducts()
      }
    })

    return {
      loading,
      products,
      category,
      getProductImage,
      handleImageError,
      addToCart
    }
  }
}
</script>

<style scoped>
.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-color);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.product-title {
  font-size: 0.9rem;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.breadcrumb-item a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .category-title {
    font-size: 2rem;
  }
}
</style>
