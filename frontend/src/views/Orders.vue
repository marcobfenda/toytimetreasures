<template>
  <div class="orders-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">My Orders</h1>
            <p class="lead">View your order history and track your purchases</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders Section -->
    <section class="orders-section py-5">
      <div class="container">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Order History</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="fetchOrders" :disabled="ordersLoading">
              <span v-if="ordersLoading" class="spinner-border spinner-border-sm me-1"></span>
              Refresh
            </button>
          </div>
          <div class="card-body">
            <!-- Loading State -->
            <div v-if="ordersLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading your orders...</p>
            </div>

            <!-- No Orders State -->
            <div v-else-if="userOrders.length === 0" class="text-center py-4">
              <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">No Orders Yet</h5>
              <p class="text-muted">You haven't placed any orders yet. Start shopping to see your order history here.</p>
              <router-link to="/products" class="btn btn-primary">
                <i class="fas fa-shopping-cart me-2"></i>Browse Products
              </router-link>
            </div>

            <!-- Orders List -->
            <div v-else class="orders-list">
              <div v-for="order in userOrders" :key="order.id" class="order-item mb-4">
                <div class="card border">
                  <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Order #{{ order.order_number || order.id }}</h6>
                      <small class="text-muted">{{ formatDate(order.created_at) }}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span :class="getStatusBadgeClass(order.status)" class="badge">
                        {{ order.status }}
                      </span>
                      <button 
                        class="btn btn-sm btn-outline-primary" 
                        @click="toggleOrderDetails(order.id)"
                        :aria-expanded="expandedOrders.has(order.id)"
                      >
                        <i class="fas fa-chevron-down me-1" :class="{ 'fa-chevron-up': expandedOrders.has(order.id) }"></i>
                        {{ expandedOrders.has(order.id) ? 'Hide' : 'View' }} Details
                      </button>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-md-4">
                        <h6 class="mb-2">Shipping Address</h6>
                        <div class="small text-muted">
                          <div v-if="order.shipping_first_name && order.shipping_last_name">
                            {{ order.shipping_first_name }} {{ order.shipping_last_name }}<br>
                            {{ order.shipping_address }}<br>
                            {{ order.shipping_city }}, {{ order.shipping_state }} {{ order.shipping_zip_code }}<br>
                            {{ order.shipping_phone }}
                          </div>
                          <div v-else-if="order.shipping_address && typeof order.shipping_address === 'string'">
                            <span v-if="isValidJson(order.shipping_address)">
                              {{ parseShippingAddress(order.shipping_address) }}
                            </span>
                            <span v-else>
                              {{ order.shipping_address }}
                            </span>
                          </div>
                          <div v-else>
                            Shipping address not available
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <h6 class="mb-2">Order Summary</h6>
                        <div class="small">
                          <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>{{ formatPrice(order.subtotal || 0) }}</span>
                          </div>
                          <div class="d-flex justify-content-between">
                            <span>Shipping:</span>
                            <span>{{ formatPrice(order.shipping_cost || 0) }}</span>
                          </div>
                          <div class="d-flex justify-content-between">
                            <span>Tax:</span>
                            <span>{{ formatPrice(order.tax_amount || 0) }}</span>
                          </div>
                          <hr class="my-1">
                          <div class="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>{{ formatPrice(order.total_amount) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 text-end">
                        <div class="mb-2">
                          <strong>Status:</strong> {{ order.status }}
                        </div>
                        <div v-if="order.order_notes" class="small text-muted">
                          <strong>Notes:</strong> {{ order.order_notes }}
                        </div>
                      </div>
                    </div>

                    <!-- Expandable Order Details -->
                    <div v-if="expandedOrders.has(order.id)" class="mt-3 pt-3 border-top">
                      <h6 class="mb-3">Order Items</h6>
                      <div v-if="order.items && order.items.length > 0" class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in order.items" :key="item.id">
                              <td>{{ item.product_name }}</td>
                              <td>{{ formatPrice(item.price) }}</td>
                              <td>{{ item.quantity }}</td>
                              <td>{{ formatPrice(item.price * item.quantity) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-else class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        Order items details not available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Orders',
  setup() {
    const authStore = useAuthStore()
    const userOrders = ref([])
    const ordersLoading = ref(false)
    const expandedOrders = ref(new Set())

    const fetchOrders = async () => {
      if (!authStore.currentUser?.id) {
        console.error('No user ID available')
        return
      }

      ordersLoading.value = true
      try {
        const response = await fetch(`/api/orders.php?user_id=${authStore.currentUser.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        if (data.success) {
          userOrders.value = data.orders || []
        } else {
          console.error('Failed to fetch orders:', data.message)
          userOrders.value = []
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        userOrders.value = []
      } finally {
        ordersLoading.value = false
      }
    }

    const toggleOrderDetails = (orderId) => {
      if (expandedOrders.value.has(orderId)) {
        expandedOrders.value.delete(orderId)
      } else {
        expandedOrders.value.add(orderId)
      }
    }

    const getStatusBadgeClass = (status) => {
      const statusClasses = {
        'pending': 'bg-warning text-dark',
        'processing': 'bg-info text-white',
        'shipped': 'bg-primary text-white',
        'delivered': 'bg-success text-white',
        'cancelled': 'bg-danger text-white'
      }
      return statusClasses[status] || 'bg-secondary text-white'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return 'Invalid Date'
      }
    }

    const formatPrice = (price) => {
      if (price === null || price === undefined) return '$0.00'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price)
    }

    const isValidJson = (str) => {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        return false
      }
    }

    const parseShippingAddress = (addressJson) => {
      try {
        const address = JSON.parse(addressJson)
        return `${address.firstName} ${address.lastName}<br>${address.address}<br>${address.city}, ${address.state} ${address.zipCode}<br>${address.phone}`
      } catch (e) {
        return addressJson
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      userOrders,
      ordersLoading,
      expandedOrders,
      fetchOrders,
      toggleOrderDetails,
      getStatusBadgeClass,
      formatDate,
      formatPrice,
      isValidJson,
      parseShippingAddress,
      authStore
    }
  }
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%);
}

.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.order-item .card {
  transition: all 0.3s ease;
}

.order-item .card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.btn {
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-1px);
}

.table {
  font-size: 0.9rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.orders-list {
  max-width: 100%;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
  
  .order-item .row > div {
    margin-bottom: 1rem;
  }
  
  .order-item .row > div:last-child {
    margin-bottom: 0;
  }
}
</style>
