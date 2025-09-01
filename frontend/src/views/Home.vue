<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section position-relative">
      <div class="hero-background-overlay"></div>
      <div class="hero-content">
        <div class="container">
          <div class="row align-items-center py-5">
            <div class="col-lg-8">
              <h1 class="hero-title display-5 fw-bold text-white mb-3">
                Discover Amazing Products
              </h1>
              <p class="hero-subtitle lead text-white mb-4">
                Shop the latest trends and find the perfect items for your lifestyle. 
                Quality products at unbeatable prices.
              </p>
              <div class="hero-buttons">
                <router-link to="/products" class="btn btn-primary btn-lg me-3">
                  Shop Now
                </router-link>
                <router-link to="/about" class="btn btn-outline-light btn-lg">
                  Learn More
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section py-5 bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="text-center mb-4">
              <h2 class="section-title">Find What You're Looking For</h2>
              <p class="section-subtitle text-muted">Search our products by name, description, or category</p>
            </div>
            <div class="search-form">
              <div class="input-group input-group-lg">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search for products..."
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                >
                <button 
                  class="btn btn-primary" 
                  type="button"
                  @click="performSearch"
                >
                  <i class="fas fa-search me-2"></i>Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="section-title">Shop by Category</h2>
            <p class="section-subtitle text-muted">Find what you're looking for in our organized categories</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="category in categories" :key="category.id" class="col-lg-4 col-md-6">
            <router-link :to="`/category/${category.slug}`" class="category-card text-decoration-none">
              <div class="card h-100 border-0 shadow-sm category-card-inner">
                <div class="card-body text-center p-4">
                  <div class="category-icon mb-3">
                    <i class="fas fa-box fa-3x text-primary"></i>
                  </div>
                  <h5 class="card-title text-dark">{{ category.name }}</h5>
                  <p class="card-text text-muted">{{ category.description }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="section-title">Featured Products</h2>
            <p class="section-subtitle text-muted">Handpicked products you'll love</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="product in featuredProducts" :key="product.id" class="col-lg-3 col-md-6">
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
        <div class="row mt-5">
          <div class="col-12 text-center">
            <router-link to="/products" class="btn btn-primary btn-lg">
              View All Products
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-3 col-md-6 text-center">
            <div class="feature-item">
              <div class="feature-icon mb-3">
                <i class="fas fa-shipping-fast fa-3x text-primary"></i>
              </div>
              <h5>Free Shipping</h5>
              <p class="text-muted">Free shipping on orders over $50</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="feature-item">
              <div class="feature-icon mb-3">
                <i class="fas fa-undo fa-3x text-primary"></i>
              </div>
              <h5>Easy Returns</h5>
              <p class="text-muted">30-day return policy</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="feature-item">
              <div class="feature-icon mb-3">
                <i class="fas fa-shield-alt fa-3x text-primary"></i>
              </div>
              <h5>Secure Payment</h5>
              <p class="text-muted">100% secure payment</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="feature-item">
              <div class="feature-icon mb-3">
                <i class="fas fa-headset fa-3x text-primary"></i>
              </div>
              <h5>24/7 Support</h5>
              <p class="text-muted">Customer support anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 text-center">
            <h3 class="mb-3">Stay Updated</h3>
            <p class="mb-4">Subscribe to our newsletter for the latest products and exclusive offers</p>
            <form class="newsletter-form">
              <div class="input-group">
                <input 
                  type="email" 
                  class="form-control" 
                  placeholder="Enter your email"
                  v-model="newsletterEmail"
                >
                <button class="btn btn-light" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const newsletterEmail = ref('')
    const searchQuery = ref('')

    const addToCart = (product) => {
      cartStore.addToCart(product)
      // You could add a toast notification here
    }

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
        searchQuery.value = ''
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

    onMounted(async () => {
      await Promise.all([
        productStore.fetchFeaturedProducts(),
        productStore.fetchCategories()
      ])
    })

    return {
      featuredProducts: productStore.featuredProducts,
      categories: productStore.categories,
      newsletterEmail,
      searchQuery,
      addToCart,
      performSearch,
      getProductImage,
      handleImageError
    }
  }
}
</script>

<style scoped>
.hero-section {
  background-image: url('/src/assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 50vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-title {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-subtitle {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}



.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
}

.category-card-inner {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover .category-card-inner {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
}

.category-icon {
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
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

.feature-item {
  padding: 1rem;
}

.feature-icon {
  transition: transform 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
}

.newsletter-form .form-control {
  border: none;
  padding: 0.75rem 1rem;
}

.newsletter-form .btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

.search-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.search-form .input-group {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.search-form .form-control {
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
}

.search-form .btn {
  padding: 1rem 2rem;
  font-weight: 600;
  border: none;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
