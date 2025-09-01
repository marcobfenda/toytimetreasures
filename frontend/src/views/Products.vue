<template>
  <div class="products-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">Our Products</h1>
            <p class="lead">Discover amazing products at unbeatable prices</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="products-section py-5">
      <div class="container">
        <div class="row">
          <!-- Filters Sidebar -->
          <div class="col-lg-3 mb-4">
            <div class="filters-sidebar">
              <h5 class="mb-3">Filters</h5>
              
              <!-- Category Filter -->
              <div class="filter-group mb-4">
                <h6>Categories</h6>
                <div class="form-check" v-for="category in categories" :key="category.id">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="`category-${category.id}`"
                    :value="category.slug"
                    v-model="selectedCategories"
                    @change="filterProducts"
                  >
                  <label class="form-check-label" :for="`category-${category.id}`">
                    {{ category.name }}
                  </label>
                </div>
              </div>

              <!-- Price Filter -->
              <div class="filter-group mb-4">
                <h6>Price Range</h6>
                <div class="price-range">
                  <input 
                    type="range" 
                    class="form-range" 
                    min="0" 
                    max="500" 
                    v-model="priceRange"
                    @input="filterProducts"
                  >
                  <div class="price-labels d-flex justify-content-between">
                    <span>$0</span>
                    <span>${{ priceRange }}</span>
                  </div>
                </div>
              </div>

              <!-- Sort Options -->
              <div class="filter-group mb-4">
                <h6>Sort By</h6>
                <select class="form-select" v-model="sortBy" @change="filterProducts">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <!-- Clear Filters -->
              <button 
                class="btn btn-outline-primary w-100" 
                @click="clearFilters"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="col-lg-9">
            <!-- Search Bar -->
            <div class="search-bar mb-4">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search products by name, description, or category..."
                  v-model="localSearchQuery"
                  @keyup.enter="performSearch"
                >
                <button 
                  class="btn btn-primary" 
                  type="button"
                  @click="performSearch"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>

            <!-- Search and Results Info -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p class="mb-0">
                  Showing {{ filteredProducts.length }} of {{ products.length }} products
                </p>
              </div>
              <div class="d-flex align-items-center">
                <label class="me-2">View:</label>
                <div class="btn-group" role="group">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    :class="{ active: viewMode === 'grid' }"
                    @click="viewMode = 'grid'"
                  >
                    <i class="fas fa-th"></i>
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    :class="{ active: viewMode === 'list' }"
                    @click="viewMode = 'list'"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <!-- Products Grid -->
            <div v-else-if="viewMode === 'grid'" class="row g-4">
              <div 
                v-for="product in paginatedProducts" 
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
                  </div>
                </div>
              </div>
            </div>

            <!-- Products List -->
            <div v-else class="products-list">
              <div 
                v-for="product in paginatedProducts" 
                :key="product.id" 
                class="product-list-item card mb-3 border-0 shadow-sm"
              >
                <div class="row g-0">
                  <div class="col-md-3">
                    <img 
                      :src="getProductImage(product)" 
                      :alt="product.name"
                      class="product-list-image"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="col-md-9">
                    <div class="card-body">
                      <div class="row align-items-center">
                        <div class="col-md-8">
                          <h5 class="card-title">{{ product.name }}</h5>
                          <p class="card-text text-muted">{{ product.short_description }}</p>
                          <p class="card-text">
                            <small class="text-muted">Category: {{ product.category_name }}</small>
                          </p>
                        </div>
                        <div class="col-md-4 text-md-end">
                          <div class="product-price mb-3">
                            <span v-if="product.sale_price" class="text-decoration-line-through text-muted d-block">
                              ${{ product.price }}
                            </span>
                            <span class="fw-bold text-primary fs-4">
                              ${{ product.sale_price || product.price }}
                            </span>
                          </div>
                          <div class="product-actions">
                            <button 
                              @click="addToCart(product)" 
                              class="btn btn-primary me-2"
                            >
                              <i class="fas fa-shopping-cart me-1"></i>
                              Add to Cart
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
            </div>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="mt-5">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="changePage(currentPage - 1)">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li 
                  v-for="page in visiblePages" 
                  :key="page" 
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="changePage(currentPage + 1)">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>

            <!-- No Results -->
            <div v-if="filteredProducts.length === 0 && !loading" class="text-center py-5">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h4>No products found</h4>
              <p class="text-muted">Try adjusting your filters or search terms.</p>
              <button class="btn btn-primary" @click="clearFilters">Clear All Filters</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Products',
  setup() {
    const router = useRouter()
    const productStore = useProductStore()
    const cartStore = useCartStore()
    
    // State
    const loading = ref(false)
    const viewMode = ref('grid')
    const selectedCategories = ref([])
    const priceRange = ref(500)
    const sortBy = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = ref(9)
    const localSearchQuery = ref('')

    // Computed
    const products = computed(() => productStore.products)
    const categories = computed(() => productStore.categories)

    const filteredProducts = computed(() => {
      let filtered = [...products.value]

      // Filter by category
      if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(product => 
          selectedCategories.value.includes(product.category_slug)
        )
      }

      // Filter by price
      filtered = filtered.filter(product => {
        const price = product.sale_price || product.price
        return price <= priceRange.value
      })

      // Sort products
      switch (sortBy.value) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          break
        case 'price-low':
          filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
          break
        case 'price-high':
          filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
      }

      return filtered
    })

    const totalPages = computed(() => 
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    )

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProducts.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Methods
    const fetchProducts = async () => {
      loading.value = true
      try {
        await Promise.all([
          productStore.fetchProducts(),
          productStore.fetchCategories()
        ])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        loading.value = false
      }
    }

    const filterProducts = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      selectedCategories.value = []
      priceRange.value = 500
      sortBy.value = 'newest'
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const addToCart = (product) => {
      cartStore.addToCart(product)
      // You could add a toast notification here
    }

    const performSearch = () => {
      if (localSearchQuery.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(localSearchQuery.value.trim())}`)
        localSearchQuery.value = ''
      }
    }

    const getProductImage = (product) => {
      if (!product.primary_image) {
        // Return a placeholder SVG if no image
        const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#6c757d">No Image</text></svg>');
        return `data:image/svg+xml;utf8,${placeholderSvg}`;
      }
      
      // If it's already an absolute URL (http(s)) use it directly
      if (product.primary_image.startsWith('http://') || product.primary_image.startsWith('https://')) {
        return product.primary_image;
      }
      
      // If it starts with /images, construct an absolute URL to the backend
      if (product.primary_image.startsWith('/images')) {
        return window.location.protocol + '//' + window.location.hostname + product.primary_image;
      }
      
      // otherwise, return as-is
      return product.primary_image;
    }

    const handleImageError = (event) => {
      // Replace broken image with placeholder
      const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#6c757d">No Image</text></svg>');
      event.target.src = `data:image/svg+xml;utf8,${placeholderSvg}`;
    }

    // Watchers
    watch(filteredProducts, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1
      }
    })

    // Lifecycle
    onMounted(() => {
      fetchProducts()
    })

    return {
      loading,
      viewMode,
      selectedCategories,
      priceRange,
      sortBy,
      currentPage,
      localSearchQuery,
      products,
      categories,
      filteredProducts,
      totalPages,
      paginatedProducts,
      visiblePages,
      filterProducts,
      clearFilters,
      changePage,
      addToCart,
      performSearch,
      getProductImage,
      handleImageError
    }
  }
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%);
}

.filters-sidebar {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  position: sticky;
  top: 2rem;
}

.filter-group h6 {
  color: var(--dark-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

.price-range {
  padding: 0.5rem 0;
}

.price-labels {
  font-size: 0.875rem;
  color: var(--gray-color);
}

.product-card {
  transition: var(--transition);
  cursor: pointer;
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
  transition: var(--transition);
}

.product-card:hover .product-image {
  transform: scale(1.05);
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
  transition: var(--transition);
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

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
}

/* List View Styles */
.product-list-item {
  transition: var(--transition);
}

.product-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-list-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* Pagination */
.pagination .page-link {
  color: var(--primary-color);
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.pagination .page-link:hover {
  color: var(--primary-color);
  background-color: #e9ecef;
}

/* Search Bar */
.search-bar {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.search-bar .input-group {
  max-width: 600px;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
  
  .product-list-image {
    height: 120px;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .product-actions .btn {
    width: 100%;
  }
}
</style>
