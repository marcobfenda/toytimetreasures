<template>
  <div class="checkout-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Checkout</h1>
        </div>
      </div>

      <div class="row">
        <!-- Checkout Form -->
        <div class="col-lg-8">
          <form @submit.prevent="processOrder" class="checkout-form">
            <!-- Shipping Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-shipping-fast me-2"></i>
                  Shipping Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      v-model="shippingInfo.firstName" 
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      v-model="shippingInfo.lastName" 
                      required
                    >
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="shippingInfo.email" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone" 
                    v-model="shippingInfo.phone" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Street Address *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="address" 
                    v-model="shippingInfo.address" 
                    required
                  >
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">City *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="city" 
                      v-model="shippingInfo.city" 
                      required
                    >
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="state" class="form-label">State *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="state" 
                      v-model="shippingInfo.state" 
                      required
                    >
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="zipCode" class="form-label">ZIP Code *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="zipCode" 
                      v-model="shippingInfo.zipCode" 
                      required
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-credit-card me-2"></i>
                  Payment Information
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="cardNumber" class="form-label">Card Number *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="cardNumber" 
                    v-model="paymentInfo.cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    required
                  >
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expiryDate" class="form-label">Expiry Date *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="expiryDate" 
                      v-model="paymentInfo.expiryDate" 
                      placeholder="MM/YY"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="cvv" 
                      v-model="paymentInfo.cvv" 
                      placeholder="123"
                      required
                    >
                  </div>
                </div>
                <div class="mb-3">
                  <label for="cardholderName" class="form-label">Cardholder Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="cardholderName" 
                    v-model="paymentInfo.cardholderName" 
                    required
                  >
                </div>
              </div>
            </div>

            <!-- Order Notes -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-sticky-note me-2"></i>
                  Order Notes (Optional)
                </h5>
              </div>
              <div class="card-body">
                <textarea 
                  class="form-control" 
                  rows="3" 
                  placeholder="Special instructions, gift messages, or any other notes..."
                  v-model="orderNotes"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="d-grid">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg" 
                :disabled="isProcessing || !cartStore.totalItems"
              >
                <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isProcessing ? 'Processing Order...' : `Place Order - ${formatPrice(cartStore.totalPrice)}` }}
              </button>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 2rem;">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div class="card-body">
              <!-- Cart Items -->
              <div class="cart-items mb-3">
                <h6>Items ({{ cartStore.totalItems }})</h6>
                <div v-for="item in cartStore.cartItems" :key="item.id" class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center">
                    <img 
                      v-if="item.primary_image" 
                      :src="item.primary_image" 
                      :alt="item.name"
                      class="me-2"
                      style="width: 40px; height: 40px; object-fit: contain;"
                    >
                    <div>
                      <div class="small fw-bold">{{ item.name }}</div>
                      <div class="small text-muted">Qty: {{ item.quantity }}</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="small fw-bold">{{ formatPrice((item.sale_price || item.price || 0) * item.quantity) }}</div>
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <hr>
              <div class="price-breakdown">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>{{ formatPrice(shippingCost) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>{{ formatPrice(taxAmount) }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>{{ formatPrice(totalWithTaxAndShipping) }}</span>
                </div>
              </div>

              <!-- Back to Cart -->
              <div class="mt-3">
                <router-link to="/cart" class="btn btn-outline-secondary w-100">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Cart
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Checkout',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const toast = useToastStore()
    const authStore = useAuthStore()

    // Form data
    const shippingInfo = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    })

    const paymentInfo = ref({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })

    const orderNotes = ref('')
    const isProcessing = ref(false)

    // Pre-fill shipping info if user is logged in
    onMounted(() => {
      if (authStore.isAuthenticated && authStore.user) {
        shippingInfo.value.firstName = authStore.user.first_name || ''
        shippingInfo.value.lastName = authStore.user.last_name || ''
        shippingInfo.value.email = authStore.user.email || ''
      }
      
      // Fetch shipping and tax settings
      fetchSettings()
    })

    // Shipping and tax settings
    const shippingSettings = ref({ shipping_fee: 5.99, free_shipping_threshold: 50.00 })
    const taxRate = ref(8.5)

    // Fetch shipping and tax settings
    const fetchSettings = async () => {
      try {
        const apiBase = (window.location.port === '3000' || window.location.port === '3001') ? 'http://localhost' : ''
        
        // Fetch shipping settings
        const shippingResponse = await fetch(`${apiBase}/api/site-settings.php?shipping`)
        const shippingResult = await shippingResponse.json()
        if (shippingResult.success) {
          shippingSettings.value = shippingResult.shipping
        }
        
        // Fetch tax rate
        const taxResponse = await fetch(`${apiBase}/api/site-settings.php?tax`)
        const taxResult = await taxResponse.json()
        if (taxResult.success) {
          taxRate.value = taxResult.tax_rate
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        // Use defaults if API fails
      }
    }

    // Computed properties
    const shippingCost = computed(() => {
      // Free shipping for orders over threshold, otherwise use configured fee
      return cartStore.totalPrice >= shippingSettings.value.free_shipping_threshold ? 0 : shippingSettings.value.shipping_fee
    })

    const taxAmount = computed(() => {
      // Dynamic tax calculation based on configured rate
      return cartStore.totalPrice * (taxRate.value / 100)
    })

    const totalWithTaxAndShipping = computed(() => {
      return cartStore.totalPrice + shippingCost.value + taxAmount.value
    })

    // Methods
    const formatPrice = (price) => {
      if (typeof price !== 'number' || isNaN(price)) return '$0.00'
      return `$${Number(price).toFixed(2)}`
    }

    const validateForm = () => {
      // Basic validation
      if (!shippingInfo.value.firstName || !shippingInfo.value.lastName) {
        toast.show('Please fill in all required fields', 'danger')
        return false
      }
      if (!paymentInfo.value.cardNumber || !paymentInfo.value.expiryDate || !paymentInfo.value.cvv) {
        toast.show('Please fill in all payment information', 'danger')
        return false
      }
      return true
    }

    const processOrder = async () => {
      if (!validateForm()) return
      if (cartStore.totalItems === 0) {
        toast.show('Your cart is empty', 'danger')
        return
      }

      isProcessing.value = true

      try {
        // Create order payload
        const orderData = {
          user_id: authStore.isAuthenticated ? authStore.user.id : null,
          shipping_info: shippingInfo.value,
          payment_info: paymentInfo.value,
          order_notes: orderNotes.value,
          items: cartStore.cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.sale_price || item.price
          })),
          subtotal: cartStore.totalPrice,
          shipping_cost: shippingCost.value,
          tax_amount: taxAmount.value,
          total_amount: totalWithTaxAndShipping.value
        }

        // Send order to backend
        const apiBase = (window.location.port === '3000' || window.location.port === '3001') ? 'http://localhost' : ''
        const response = await fetch(`${apiBase}/api/orders.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })

        let result
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch (e) {
          console.error('Non-JSON response from orders API:', text)
          throw new Error('Server returned an unexpected response. Please check API logs.')
        }

        if (result.success) {
          // Save order total to localStorage for success page
          localStorage.setItem('lastOrderTotal', totalWithTaxAndShipping.value.toString())
          
          // Clear cart and redirect to success page
          cartStore.clearCart()
          toast.show('Order placed successfully!', 'success')
          router.push(`/order-success/${result.order_id}`)
        } else {
          throw new Error(result.message || 'Failed to place order')
        }
      } catch (error) {
        console.error('Order processing error:', error)
        toast.show(error.message || 'Failed to process order. Please try again.', 'danger')
      } finally {
        isProcessing.value = false
      }
    }

    return {
      cartStore,
      shippingInfo,
      paymentInfo,
      orderNotes,
      isProcessing,
      shippingCost,
      taxAmount,
      totalWithTaxAndShipping,
      formatPrice,
      processOrder
    }
  }
}
</script>

<style scoped>
.checkout-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.checkout-form .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.checkout-form .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.cart-items img {
  border-radius: 4px;
}

.price-breakdown {
  font-size: 0.9rem;
}

.sticky-top {
  z-index: 1020;
}

@media (max-width: 991.98px) {
  .sticky-top {
    position: static !important;
    margin-top: 2rem;
  }
}
</style>
