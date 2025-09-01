<template>
  <div class="cart-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <h1>Shopping Cart</h1>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-lg-8">
          <div v-if="!items.length" class="alert alert-info">Your cart is empty.</div>

          <div v-else class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th style="width:120px">Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td style="width:80px">
                    <img v-if="item.primary_image" :src="item.primary_image" alt="" style="max-width:70px; max-height:70px; object-fit:contain" />
                  </td>
                  <td>
                    <router-link :to="`/product/${item.slug}`">{{ item.name }}</router-link>
                  </td>
                  <td>{{ formatPrice(item.sale_price || item.price || 0) }}</td>
                  <td>
                    <input type="number" class="form-control" min="0" :value="item.quantity" @change="onQtyChange($event, item.id)" />
                  </td>
                  <td>{{ formatPrice((item.sale_price || item.price || 0) * item.quantity) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="remove(item.id)">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Summary</h5>
              <p class="mb-2">Items: <strong>{{ cartStore.totalItems }}</strong></p>
              <p class="mb-3">Total: <strong>{{ formatPrice(cartStore.totalPrice) }}</strong></p>
              <div class="d-grid gap-2">
                <button class="btn btn-primary" :disabled="!items.length" @click="proceedToCheckout">Proceed to Checkout</button>
                <button class="btn btn-outline-secondary" :disabled="!items.length" @click="clearCart">Clear Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'Cart',
  setup() {
    const cartStore = useCartStore()
    const toast = useToastStore()
    const router = useRouter()

    onMounted(() => {
      // load persisted cart
      if (cartStore.loadCartFromStorage) cartStore.loadCartFromStorage()
    })

    const items = computed(() => cartStore.cartItems)

    const formatPrice = (v) => {
      if (v == null || typeof v !== 'number' || isNaN(v)) return '$0.00'
      return `$${Number(v).toFixed(2)}`
    }

    const onQtyChange = (e, id) => {
      const val = Number(e.target.value)
      if (Number.isNaN(val)) return
      cartStore.updateQuantity(id, val)
      toast.show('Cart updated', 'success')
    }

    const remove = (id) => {
      cartStore.removeFromCart(id)
      toast.show('Item removed', 'info')
    }

    const clearCart = () => {
      if (!confirm('Clear the cart?')) return
      cartStore.clearCart()
      toast.show('Cart cleared', 'info')
    }

    const proceedToCheckout = () => {
      router.push('/checkout')
    }

    return {
      cartStore,
      items,
      formatPrice,
      onQtyChange,
      remove,
      clearCart,
      proceedToCheckout
    }
  }
}
</script>
