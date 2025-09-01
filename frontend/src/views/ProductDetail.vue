<template>
  <div class="product-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="container py-5">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading product details...</p>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="container py-5">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h2>Product Not Found</h2>
        <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
        <router-link to="/products" class="btn btn-primary">Back to Products</router-link>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else class="container py-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/products">Products</router-link>
          </li>
                     <li class="breadcrumb-item" v-if="product.category_name">
             <router-link :to="`/category/${product.category_slug || product.category_id}`">
               {{ product.category_name }}
             </router-link>
           </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row">
        <!-- Product Images -->
        <div class="col-lg-6 mb-4">
          <div class="product-images">
                         <!-- Main Image -->
             <div class="main-image-container mb-3">
               <img 
                 :src="mainImageUrl || getProductImage(product)" 
                 :alt="product.name"
                 class="main-product-image"
                 @error="handleImageError"
               />
             </div>
            
            <!-- Image Gallery (if multiple images) -->
            <div v-if="productImages.length > 1" class="image-gallery">
              <div class="row g-2">
                <div 
                  v-for="(image, index) in productImages" 
                  :key="index"
                  class="col-3"
                >
                  <img 
                    :src="getImageUrl(image.image_url)" 
                    :alt="image.alt_text || product.name"
                    class="thumbnail-image"
                    @click="setMainImage(image.image_url)"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="col-lg-6">
          <div class="product-info">
            <!-- Product Title -->
            <h1 class="product-title mb-3">{{ product.name }}</h1>
            
            <!-- Product SKU -->
            <p v-if="product.sku" class="text-muted mb-2">
              SKU: {{ product.sku }}
            </p>

            

            <!-- Product Price -->
            <div class="product-price mb-4">
              <div v-if="product.sale_price" class="d-flex align-items-center">
                <span class="current-price fs-2 fw-bold text-primary me-3">
                  ${{ product.sale_price }}
                </span>
                <span class="original-price fs-5 text-decoration-line-through text-muted">
                  ${{ product.price }}
                </span>
                <span class="discount-badge ms-2 badge bg-danger">
                  {{ Math.round(((product.price - product.sale_price) / product.price) * 100) }}% OFF
                </span>
              </div>
              <div v-else>
                <span class="current-price fs-2 fw-bold text-primary">
                  ${{ product.price }}
                </span>
              </div>
            </div>

            <!-- Product Description -->
            <div class="product-description mb-4">
              <h5>Description</h5>
              <p v-if="product.short_description" class="text-muted mb-2">
                {{ product.short_description }}
              </p>
              <div v-if="product.description" v-html="product.description"></div>
              <p v-if="!product.description && !product.short_description" class="text-muted">
                No description available for this product.
              </p>
            </div>

            <!-- Product Details -->
            <div class="product-details mb-4">
              <h5>Product Details</h5>
              <div class="row">
                <div class="col-md-6">
                  <p v-if="product.category_name">
                    <strong>Category:</strong> 
                    <router-link :to="`/category/${product.category_slug}`" class="text-decoration-none">
                      {{ product.category_name }}
                    </router-link>
                  </p>
                                     <p v-if="product.stock_quantity !== null">
                     <strong>Availability:</strong> 
                     <span :class="product.stock_quantity > 0 ? 'text-success' : 'text-danger'">
                       <i :class="product.stock_quantity > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                       {{ product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock' }}
                     </span>
                   </p>
                </div>
                <div class="col-md-6">
                  <p v-if="product.weight">
                    <strong>Weight:</strong> {{ product.weight }} lbs
                  </p>
                  <p v-if="product.dimensions">
                    <strong>Dimensions:</strong> {{ product.dimensions }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Add to Cart Section -->
            <div class="add-to-cart-section">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Quantity:</label>
                  <div class="input-group">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="decreaseQuantity"
                      :disabled="quantity <= 1"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      class="form-control text-center" 
                      v-model.number="quantity"
                      min="1"
                      :max="getMaxQuantity()"
                    />
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="increaseQuantity"
                      :disabled="quantity >= getMaxQuantity()"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <button 
                    @click="addToCart()"
                    class="btn btn-primary btn-lg w-100"
                    :disabled="!product.stock_quantity || product.stock_quantity <= 0"
                  >
                    <i class="fas fa-shopping-cart me-2"></i>
                    {{ product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock' }}
                  </button>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <section class="related-products mt-5 pt-5 border-top">
        <div class="row">
          <div class="col-12">
            <h3 class="mb-4">Related Products</h3>
          </div>
        </div>
        <div class="row g-4">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            class="col-lg-3 col-md-6"
          >
            <div class="product-card card h-100 border-0 shadow-sm">
              <div class="product-image-container">
                <img 
                  :src="getProductImage(relatedProduct)" 
                  :alt="relatedProduct.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="product-overlay">
                  <div class="product-actions">
                    <button 
                      @click="addToCart(relatedProduct)" 
                      class="btn btn-primary btn-sm"
                      title="Add to Cart"
                    >
                      <i class="fas fa-shopping-cart"></i>
                    </button>
                    <router-link 
                      :to="`/product/${relatedProduct.slug}`" 
                      class="btn btn-outline-primary btn-sm"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title product-title">{{ relatedProduct.name }}</h6>
                <p class="card-text text-muted small flex-grow-1">{{ relatedProduct.short_description }}</p>
                <div class="product-price mt-auto">
                  <span v-if="relatedProduct.sale_price" class="text-decoration-line-through text-muted me-2">
                    ${{ relatedProduct.price }}
                  </span>
                  <span class="fw-bold text-primary">
                    ${{ relatedProduct.sale_price || relatedProduct.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const toastStore = useToastStore()
    
    // State
    const loading = ref(true)
    const product = ref(null)
    const productImages = ref([])
    const relatedProducts = ref([])
    const quantity = ref(1)
    const mainImageUrl = ref('')

    // Computed
    const currentPrice = computed(() => {
      return product.value?.sale_price || product.value?.price || 0
    })

    // Methods
    const fetchProduct = async () => {
      loading.value = true
      try {
        const productData = await productStore.fetchProductBySlug(route.params.slug)
        if (productData) {
          product.value = productData
          
          // Fetch category information separately if missing
          if (productData.category_id && !productData.category_name) {
            try {
              const categoryResponse = await fetch(`/api/categories.php`)
              const categories = await categoryResponse.json()
              const category = categories.find(c => c.id === productData.category_id)
              if (category) {
                product.value.category_name = category.name
                product.value.category_slug = category.slug
              }
            } catch (error) {
              console.error('Error fetching category:', error)
            }
          }
          
          // Fetch product images if primary_image is missing
          if (!productData.primary_image && productData.id) {
            try {
              const imageResponse = await fetch(`/api/product_images.php?product_id=${productData.id}`)
              const imageData = await imageResponse.json()
              if (imageData.success && imageData.images.length > 0) {
                const primaryImage = imageData.images.find(img => img.is_primary) || imageData.images[0]
                product.value.primary_image = primaryImage.image_url
                mainImageUrl.value = getImageUrl(primaryImage.image_url)
              }
            } catch (error) {
              console.error('Error fetching primary image:', error)
            }
          } else {
            mainImageUrl.value = productData.primary_image || ''
          }
          
          await fetchProductImages()
          await fetchRelatedProducts()
        } else {
          product.value = null
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        product.value = null
      } finally {
        loading.value = false
      }
    }

    const fetchProductImages = async () => {
      if (!product.value?.id) return
      
      try {
        const response = await fetch(`/api/product_images.php?product_id=${product.value.id}`)
        const data = await response.json()
        if (data.success) {
          productImages.value = data.images || []
        }
      } catch (error) {
        console.error('Error fetching product images:', error)
      }
    }

    const fetchRelatedProducts = async () => {
      if (!product.value?.category_id) return
      
      try {
        const response = await fetch(`/api/products.php?category_id=${product.value.category_id}&limit=4`)
        const data = await response.json()
        if (data.success) {
          // Filter out the current product
          relatedProducts.value = data.products?.filter(p => p.id !== product.value.id) || []
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    const getProductImage = (product) => {
      if (!product.primary_image) {
        const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#6c757d">No Image</text></svg>');
        return `data:image/svg+xml;utf8,${placeholderSvg}`;
      }
      
      if (product.primary_image.startsWith('http://') || product.primary_image.startsWith('https://')) {
        return product.primary_image;
      }
      
      if (product.primary_image.startsWith('/images')) {
        return window.location.protocol + '//' + window.location.hostname + product.primary_image;
      }
      
      return product.primary_image;
    }

    const getImageUrl = (imageUrl) => {
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      
      if (imageUrl.startsWith('/images')) {
        return window.location.protocol + '//' + window.location.hostname + imageUrl;
      }
      
      return imageUrl;
    }

    const setMainImage = (imageUrl) => {
      mainImageUrl.value = imageUrl
    }

    const handleImageError = (event) => {
      const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#6c757d">No Image</text></svg>');
      event.target.src = `data:image/svg+xml;utf8,${placeholderSvg}`;
    }

    const getMaxQuantity = () => {
      if (!product.value) return 1
      const currentStock = product.value.stock_quantity || 0
      const existingItem = cartStore.cartItems.find(item => item.id === product.value.id)
      const currentCartQuantity = existingItem ? existingItem.quantity : 0
      return Math.max(1, currentStock - currentCartQuantity)
    }

    const increaseQuantity = () => {
      const maxQuantity = getMaxQuantity()
      if (quantity.value < maxQuantity) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = (targetProduct = null) => {
      const productToAdd = targetProduct || product.value
      if (!productToAdd) {
        console.error('No product to add to cart')
        return
      }
      
      const qty = targetProduct ? 1 : quantity.value
      
              try {
          const success = cartStore.addToCart(productToAdd, qty)
          if (success) {
            toastStore.show('Product added to cart!', 'success')
          } else {
            // Check if it's a stock limitation
            const currentStock = productToAdd.stock_quantity || 0
            const existingItem = cartStore.cartItems.find(item => item.id === productToAdd.id)
            const currentCartQuantity = existingItem ? existingItem.quantity : 0
            const availableToAdd = currentStock - currentCartQuantity
            
            if (availableToAdd <= 0) {
              toastStore.show('No more stock available!', 'error')
            } else {
              toastStore.show(`Only ${availableToAdd} more available in stock!`, 'warning')
            }
          }
        } catch (error) {
        console.error('Error adding to cart:', error)
        toastStore.show('Error adding product to cart', 'error')
      }
    }



    // Watchers
    watch(() => route.params.slug, () => {
      fetchProduct()
    })

    // Lifecycle
    onMounted(() => {
      fetchProduct()
    })

    return {
      loading,
      product,
      productImages,
      relatedProducts,
      quantity,
      mainImageUrl,
      currentPrice,
      getProductImage,
      getImageUrl,
      setMainImage,
      handleImageError,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      getMaxQuantity
    }
  }
}
</script>

<style scoped>
.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-color);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.main-image-container {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.main-product-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-product-image:hover {
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border: 2px solid #dee2e6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.thumbnail-image:hover {
  border-color: var(--primary-color);
}

.current-price {
  color: var(--primary-color);
}

.original-price {
  color: #6c757d;
}

.discount-badge {
  font-size: 0.75rem;
}



.product-description {
  line-height: 1.6;
}

.product-details p {
  margin-bottom: 0.5rem;
}

.add-to-cart-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.input-group .form-control {
  text-align: center;
  font-weight: 600;
}



/* Related Products */
.related-products .product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-products .product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.related-products .product-image-container {
  position: relative;
  overflow: hidden;
}

.related-products .product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-products .product-overlay {
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

.related-products .product-card:hover .product-overlay {
  opacity: 1;
}

.related-products .product-actions {
  display: flex;
  gap: 0.5rem;
}

.related-products .product-title {
  font-size: 0.9rem;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Breadcrumb */
.breadcrumb-item a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .product-title {
    font-size: 2rem;
  }
  
  .main-product-image {
    height: 300px;
  }
  
  .add-to-cart-section .row {
    flex-direction: column;
  }
  
  .add-to-cart-section .col-md-4 {
    margin-bottom: 1rem;
  }
}
</style>
