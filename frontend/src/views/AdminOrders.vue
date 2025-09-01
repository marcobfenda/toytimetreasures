<template>
  <div class="admin-orders-page container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Orders</h1>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="fetchOrders" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          Refresh
        </button>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <input v-model="filters.search" type="text" class="form-control" placeholder="Search by order number, email, or name" @input="applyFilters">
          </div>
          <div class="col-md-3">
            <select v-model="filters.status" class="form-select" @change="applyFilters">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="order in filteredOrders" :key="order.id">
                <tr>
                  <td><span class="fw-semibold">{{ order.order_number || `#${order.id}` }}</span></td>
                  <td>{{ order.shipping_first_name || '-' }} {{ order.shipping_last_name || '' }}</td>
                  <td>{{ order.shipping_email || '-' }}</td>
                  <td>{{ formatPrice(order.total_amount) }}</td>
                  <td>
                    <select class="form-select form-select-sm w-auto" v-model="order.status" @change="updateStatus(order)">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" @click="toggleExpand(order)">
                      {{ expanded.has(order.id) ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="expanded.has(order.id)" class="bg-light">
                  <td colspan="7">
                    <div class="p-3">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <h6 class="mb-2">Shipping</h6>
                          <div class="small text-muted">{{ order.shipping_address || order.shipping_address_json }}</div>
                          <div class="small text-muted">{{ order.shipping_city }} {{ order.shipping_state }} {{ order.shipping_zip_code }}</div>
                          <div class="small text-muted">{{ order.shipping_phone }}</div>
                        </div>
                        <div class="col-md-4">
                          <h6 class="mb-2">Items</h6>
                          <div v-if="order.items_summary" class="small">{{ order.items_summary }}</div>
                          <ul v-else class="small mb-0">
                            <li v-for="it in order.items" :key="it.id">{{ it.quantity }}x {{ it.name || it.product_name }} - {{ formatPrice((it.price || it.unit_price) * it.quantity) }}</li>
                          </ul>
                        </div>
                        <div class="col-md-4">
                          <h6 class="mb-2">Summary</h6>
                          <div class="small">Subtotal: {{ formatPrice(order.subtotal ?? order.total_amount - ((order.shipping_cost||0)+(order.tax_amount||0))) }}</div>
                          <div class="small">Shipping: {{ formatPrice(order.shipping_cost || 0) }}</div>
                          <div class="small">Tax: {{ formatPrice(order.tax_amount || 0) }}</div>
                          <div class="fw-semibold">Total: {{ formatPrice(order.total_amount) }}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && filteredOrders.length === 0" class="text-center text-muted py-4">
          No orders found.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdminOrders',
  setup() {
    const authStore = useAuthStore()
    const loading = ref(false)
    const orders = ref([])
    const expanded = ref(new Set())

    const filters = reactive({ search: '', status: '' })

    const apiBase = (window.location.port === '3000' || window.location.port === '3001') ? 'http://localhost' : ''

    const fetchOrders = async () => {
      loading.value = true
      try {
        const res = await fetch(`${apiBase}/api/orders.php`)
        const json = await res.json()
        if (json.success) {
          // We may need to fetch items per order if API doesn't embed them; do a best-effort attempt
          const withItems = await Promise.all((json.orders || []).map(async (o) => {
            try {
              const itemsRes = await fetch(`${apiBase}/api/orders.php?id=${o.id}`)
              const itemsJson = await itemsRes.json()
              if (itemsJson.success && itemsJson.order) {
                // items_summary available; but items list not; keep summary only
                o.items = []
              }
            } catch (_) {}
            return o
          }))
          orders.value = withItems
        } else {
          orders.value = []
        }
      } catch (e) {
        orders.value = []
      } finally {
        loading.value = false
      }
    }

    const updateStatus = async (order) => {
      try {
        const res = await fetch(`${apiBase}/api/orders.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: order.id, status: order.status })
        })
        const json = await res.json()
        if (!json.success) {
          throw new Error(json.message || 'Failed to update')
        }
      } catch (e) {
        // revert UI change if failed
        await fetchOrders()
      }
    }

    const applyFilters = () => {}

    const filteredOrders = computed(() => {
      const q = (filters.search || '').toLowerCase()
      const st = filters.status
      return (orders.value || []).filter(o => {
        if (st && o.status !== st) return false
        if (!q) return true
        const hay = [o.order_number, o.shipping_email, o.shipping_first_name, o.shipping_last_name, o.items_summary]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
    })

    const toggleExpand = (order) => {
      const s = new Set(expanded.value)
      s.has(order.id) ? s.delete(order.id) : s.add(order.id)
      expanded.value = s
    }

    const formatPrice = (v) => {
      const n = Number(v)
      if (Number.isNaN(n)) return '$0.00'
      return `$${n.toFixed(2)}`
    }

    const formatDate = (val) => {
      if (!val) return '-'
      const d = new Date(val)
      return d.toLocaleString()
    }

    onMounted(fetchOrders)

    return {
      authStore,
      loading,
      orders,
      filters,
      filteredOrders,
      expanded,
      fetchOrders,
      updateStatus,
      toggleExpand,
      applyFilters,
      formatPrice,
      formatDate
    }
  }
}
</script>

<style scoped>
.table td, .table th { vertical-align: middle; }
</style>
