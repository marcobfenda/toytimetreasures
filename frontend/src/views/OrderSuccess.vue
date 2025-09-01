<template>
  <div class="order-success-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <div class="success-card">
            <div class="success-icon mb-4">
              <i class="fas fa-check-circle fa-5x text-success"></i>
            </div>
            
            <h1 class="mb-4 text-success">Order Placed Successfully!</h1>
            
            <div class="order-details mb-4">
              <p class="lead mb-3">Thank you for your order!</p>
              <p class="mb-2">Order Number: <strong>{{ orderNumber }}</strong></p>
              <p class="mb-2">Order Total: <strong>{{ formatPrice(orderTotal) }}</strong></p>
              <p class="text-muted">You will receive a confirmation email shortly.</p>
            </div>

            <div class="next-steps mb-5">
              <h5 class="mb-3">What happens next?</h5>
              <div class="row text-start">
                <div class="col-md-4 mb-3">
                  <div class="step-item">
                    <i class="fas fa-box fa-2x text-primary mb-2"></i>
                    <h6>Order Processing</h6>
                    <p class="small text-muted">We'll process your order and prepare it for shipping.</p>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-item">
                    <i class="fas fa-shipping-fast fa-2x text-primary mb-2"></i>
                    <h6>Shipping</h6>
                    <p class="small text-muted">Your order will be shipped within 1-2 business days.</p>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-item">
                    <i class="fas fa-home fa-2x text-primary mb-2"></i>
                    <h6>Delivery</h6>
                    <p class="small text-muted">Track your package and receive it at your doorstep.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <router-link to="/" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-home me-2"></i>
                Continue Shopping
              </router-link>
              <router-link to="/profile" class="btn btn-outline-secondary btn-lg" v-if="authStore.isAuthenticated">
                <i class="fas fa-user me-2"></i>
                View Orders
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'OrderSuccess',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    const orderNumber = ref('')
    const orderTotal = ref(0)

    onMounted(() => {
      // Get order details from route params or localStorage
      const orderId = route.params.orderId
      if (orderId) {
        // You could fetch order details here if needed
        orderNumber.value = `TTT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${orderId}`
      }
      
      // Get order total from localStorage if available
      const savedOrderTotal = localStorage.getItem('lastOrderTotal')
      if (savedOrderTotal) {
        orderTotal.value = parseFloat(savedOrderTotal)
        localStorage.removeItem('lastOrderTotal') // Clean up
      }
    })

    const formatPrice = (price) => {
      if (typeof price !== 'number' || isNaN(price)) return '$0.00'
      return `$${Number(price).toFixed(2)}`
    }

    return {
      orderNumber,
      orderTotal,
      formatPrice,
      authStore
    }
  }
}
</script>

<style scoped>
.order-success-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.success-card {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.success-icon {
  animation: bounceIn 0.8s ease-out;
}

.step-item {
  text-align: center;
  padding: 1rem;
}

.step-item i {
  display: block;
  margin: 0 auto;
}

.action-buttons {
  margin-top: 2rem;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .success-card {
    padding: 2rem 1rem;
  }
  
  .action-buttons .btn {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
