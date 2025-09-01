import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const featuredProducts = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getProductBySlug = computed(() => {
    return (slug) => products.value.find(product => product.slug === slug)
  })

  const getProductsByCategory = computed(() => {
    return (categorySlug) => products.value.filter(product => product.category_slug === categorySlug)
  })

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
  console.log('[productStore] fetchProducts start')
    try {
      const response = await fetch('/api/products.php')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
  console.log('[productStore] fetchProducts response', data)
  products.value = data
    } catch (err) {
      error.value = err.message
      console.error('[productStore] Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    loading.value = true
    error.value = null
  console.log('[productStore] fetchFeaturedProducts start')
    try {
  const response = await fetch('/api/products.php?featured=1')
      if (!response.ok) throw new Error('Failed to fetch featured products')
      const data = await response.json()
  console.log('[productStore] fetchFeaturedProducts response', data)
      featuredProducts.value = data
    } catch (err) {
      error.value = err.message
      console.error('[productStore] Error fetching featured products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    console.log('[productStore] fetchCategories start')
    try {
      const response = await fetch('/api/categories.php')
      console.log('[productStore] fetchCategories response status:', response.status)
      console.log('[productStore] fetchCategories response headers:', response.headers)
      
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const data = await response.json()
      console.log('[productStore] fetchCategories response data:', data)
      console.log('[productStore] fetchCategories data type:', typeof data)
      console.log('[productStore] fetchCategories data length:', Array.isArray(data) ? data.length : 'Not an array')
      
      categories.value = data
      console.log('[productStore] categories.value updated:', categories.value)
    } catch (err) {
      error.value = err.message
      console.error('[productStore] Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const searchProducts = async (query) => {
    loading.value = true
    error.value = null
    try {
  const response = await fetch(`/api/products.php?search=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to search products')
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error searching products:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getProductDetail = async (slug) => {
    loading.value = true
    error.value = null
    try {
  const response = await fetch(`/api/products.php?slug=${encodeURIComponent(slug)}`)
      if (!response.ok) throw new Error('Failed to fetch product detail')
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching product detail:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchProductBySlug = async (slug) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`/api/products.php?slug=${encodeURIComponent(slug)}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching product by slug:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    featuredProducts,
    categories,
    loading,
    error,
    
    // Getters
    getProductBySlug,
    getProductsByCategory,
    
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    searchProducts,
    getProductDetail,
    fetchProductBySlug
  }
})
