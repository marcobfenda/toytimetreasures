<template>
  <div class="search-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">Search Results</h1>
            <p class="lead" v-if="searchQuery">
              Showing results for "{{ searchQuery }}"
            </p>
            <p class="lead" v-else>
              Search for products by name, description, or category
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Results Section -->
    <section class="search-results-section py-5">
      <div class="container">
        <div class="row">
          <!-- Filters Sidebar -->
          <div class="col-lg-3 mb-4">
            <div class="filters-sidebar">
              <h5 class="mb-3">Filters</h5>
              
              <!-- Category Filter -->
              <div class="filter-group mb-4">
                <h6>Categories</h6>
                <div class="form-check" v-for="category in availableCategories" :key="category.id">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="`category-${category.id}`"
                    :value="category.slug"
                    v-model="selectedCategories"
                    @change="filterResults"
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
                    @input="filterResults"
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
                <select class="form-select" v-model="sortBy" @change="filterResults">
                  <option value="relevance">Relevance</option>
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

          <!-- Search Results -->
          <div class="col-lg-9">
            <!-- Search and Results Info -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p class="mb-0">
                  Showing {{ filteredResults.length }} of {{ searchResults.length }} results
                  <span v-if="searchQuery">for "{{ searchQuery }}"</span>
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

            <!-- Search Results Grid -->
            <div v-else-if="viewMode === 'grid' && filteredResults.length > 0" class="row g-4">
              <div 
                v-for="product in paginatedResults" 
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

            <!-- Search Results List -->
            <div v-else-if="viewMode === 'list' && filteredResults.length > 0" class="products-list">
              <div 
                v-for="product in paginatedResults" 
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
                            <span class="fw-bold text-primary fs-5">
                              ${{ product.sale_price || product.price }}
                            </span>
                          </div>
                          <div class="product-actions">
                            <button 
                              @click="addToCart(product)" 
                              class="btn btn-primary btn-sm me-2"
                            >
                              <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                            </button>
                            <router-link 
                              :to="`/product/${product.slug}`" 
                              class="btn btn-outline-primary btn-sm"
                            >
                              <i class="fas fa-eye me-1"></i>View Details
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
                  <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>

            <!-- No Results -->
            <div v-if="filteredResults.length === 0 && !loading" class="text-center py-5">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h4>No products found</h4>
              <p class="text-muted">
                <span v-if="searchQuery">No products found for "{{ searchQuery }}".</span>
                <span v-else>Try searching for something specific.</span>
                Try adjusting your filters or search terms.
              </p>
              <button class="btn btn-primary me-2" @click="clearFilters">Clear All Filters</button>
              <router-link to="/products" class="btn btn-outline-primary">Browse All Products</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Search',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()
    const cartStore = useCartStore()
    
    // State
    const loading = ref(false)
    const viewMode = ref('grid')
    const selectedCategories = ref([])
    const priceRange = ref(500)
    const sortBy = ref('relevance')
    const currentPage = ref(1)
    const itemsPerPage = ref(9)
    const searchResults = ref([])

    // Computed
    const searchQuery = computed(() => route.query.q || '')
    
    const availableCategories = computed(() => {
      const categoryIds = [...new Set(searchResults.value.map(p => p.category_id))]
      return productStore.categories.filter(c => categoryIds.includes(c.id))
    })

    const filteredResults = computed(() => {
      let filtered = [...searchResults.value]

      // Filter by category
      if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(product => 
          selectedCategories.value.includes(product.category_slug || product.category_name)
        )
      }

      // Filter by price
      filtered = filtered.filter(product => {
        const price = product.sale_price || product.price
        return price <= priceRange.value
      })

      // Sort products
      switch (sortBy.value) {
        case 'relevance':
          // Keep original order from search results
          break
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
      Math.ceil(filteredResults.value.length / itemsPerPage.value)
    )

    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredResults.value.slice(start, end)
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
    const performSearch = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }

      loading.value = true
      try {
        const results = await productStore.searchProducts(searchQuery.value)
        searchResults.value = results
        currentPage.value = 1
      } catch (error) {
        console.error('Error searching products:', error)
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }

    const filterResults = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      selectedCategories.value = []
      priceRange.value = 500
      sortBy.value = 'relevance'
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
    watch(searchQuery, () => {
      if (searchQuery.value.trim()) {
        performSearch()
      } else {
        searchResults.value = []
      }
    })

    watch(filteredResults, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1
      }
    })

    // Lifecycle
    onMounted(() => {
      if (searchQuery.value.trim()) {
        performSearch()
      }
    })

    return {
      loading,
      viewMode,
      selectedCategories,
      priceRange,
      sortBy,
      currentPage,
      searchQuery,
      searchResults,
      availableCategories,
      filteredResults,
      totalPages,
      paginatedResults,
      visiblePages,
      performSearch,
      filterResults,
      clearFilters,
      changePage,
      addToCart,
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
  box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.product-image {
  width: 100%;
  height: 100%;
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
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
}

.products-list {
  margin-bottom: 2rem;
}

.product-list-item {
  transition: transform 0.2s ease;
}

.product-list-item:hover {
  transform: translateX(5px);
}

.product-list-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.pagination .page-link {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.pagination .page-item.active .page-link {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.pagination .page-link:hover {
  color: var(--primary-color);
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .filters-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
  
  .product-list-image {
    height: 120px;
  }
}
</style>
