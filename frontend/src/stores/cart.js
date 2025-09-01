import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  // Getters
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      // Convert string prices to numbers if needed
      const price = typeof item.sale_price === 'string' ? parseFloat(item.sale_price) : item.sale_price
      const regularPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      const finalPrice = price || regularPrice
      
      // Add safety check to ensure price is a valid number
      if (typeof finalPrice !== 'number' || isNaN(finalPrice)) {
        console.warn('Invalid price for item:', item.id, 'price:', finalPrice)
        return total
      }
      return total + (finalPrice * item.quantity)
    }, 0)
  })

  const cartItemCount = computed(() => {
    return cartItems.value.length
  })

  // Actions
  const addToCart = (product, quantity = 1) => {
    // Validate that product has required price data and convert string prices to numbers
    if (!product) {
      console.error('No product provided')
      return
    }
    
    // Convert string prices to numbers if needed
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const salePrice = typeof product.sale_price === 'string' ? parseFloat(product.sale_price) : product.sale_price
    
    if (typeof (salePrice || price) !== 'number' || isNaN(salePrice || price)) {
      console.error('Invalid product or missing price data:', product)
      return
    }
    
    // Check stock availability
    const currentStock = product.stock_quantity || 0
    const existingItem = cartItems.value.find(item => item.id === product.id)
    const currentCartQuantity = existingItem ? existingItem.quantity : 0
    const requestedQuantity = currentCartQuantity + quantity
    
    if (requestedQuantity > currentStock) {
      console.error(`Cannot add ${quantity} more items. Only ${currentStock - currentCartQuantity} available.`)
      return false // Return false to indicate failure
    }
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: price,
        sale_price: salePrice,
        primary_image: product.primary_image,
        quantity: quantity
      })
    }
    
    // Save to localStorage
    saveCartToStorage()
    // if user logged in, also save to server
    try { if (window.__USER_ID__) saveCartToServer(window.__USER_ID__) } catch(e) {}
    
    return true // Return true to indicate success
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage()
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCartToStorage()
  try { if (window.__USER_ID__) saveCartToServer(window.__USER_ID__) } catch(e) {}
  }

  const saveCartToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart)
      } catch (error) {
        console.error('Error loading cart from storage:', error)
        cartItems.value = []
      }
    }
  }

  // Server persistence
  const saveCartToServer = async (userId) => {
    try {
      const payload = { user_id: userId, items: cartItems.value.map(i => ({ id: i.id, quantity: i.quantity })) }
      await fetch((window.location.port === '3000' || window.location.port === '3001' ? 'http://localhost' : '') + '/api/cart.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
    } catch (e) {
      console.error('Failed to save cart to server', e)
    }
  }

  const loadCartFromServer = async (userId) => {
    try {
      const url = (window.location.port === '3000' || window.location.port === '3001' ? 'http://localhost' : '') + `/api/cart.php?user_id=${userId}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.success && Array.isArray(json.items)) {
        // Fetch full product details for each cart item
        const cartItemsWithDetails = []
        for (const item of json.items) {
          try {
            const productRes = await fetch((window.location.port === '3000' || window.location.port === '3001' ? 'http://localhost' : '') + `/api/products.php?id=${item.product_id}`)
            const productData = await productRes.json()
            if (productData.success && productData.product) {
              cartItemsWithDetails.push({
                id: item.product_id,
                name: productData.product.name,
                slug: productData.product.slug,
                price: productData.product.price,
                sale_price: productData.product.sale_price,
                primary_image: productData.product.primary_image,
                quantity: item.quantity
              })
            }
          } catch (error) {
            console.error('Error fetching product details for cart item:', error)
          }
        }
        cartItems.value = cartItemsWithDetails
        saveCartToStorage()
      }
    } catch (e) {
      console.error('Failed to load cart from server', e)
    }
  }

  const increment = (productId, by = 1) => {
    const item = cartItems.value.find(i => i.id === productId)
    if (item) { item.quantity += by; saveCartToStorage(); try { if (window.__USER_ID__) saveCartToServer(window.__USER_ID__) } catch(e) {} }
  }

  const decrement = (productId, by = 1) => {
    const item = cartItems.value.find(i => i.id === productId)
    if (item) {
      item.quantity -= by
      if (item.quantity <= 0) removeFromCart(productId)
      else saveCartToStorage()
      try { if (window.__USER_ID__) saveCartToServer(window.__USER_ID__) } catch(e) {}
    }
  }

  const getCartItem = (productId) => {
    return cartItems.value.find(item => item.id === productId)
  }

  // Initialize cart from localStorage
  loadCartFromStorage()

  return {
    // State
    cartItems,
    
    // Getters
    totalItems,
    totalPrice,
    cartItemCount,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromStorage,
    getCartItem
  ,saveCartToServer,loadCartFromServer,increment,decrement
  }
})
