<template>
  <div class="profile-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">My Profile</h1>
            <p class="lead">Manage your account information and preferences</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile Content -->
    <section class="profile-section py-5">
      <div class="container">
        <div class="row">
          <!-- Profile Sidebar -->
          <div class="col-lg-3 mb-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <div class="profile-avatar mb-3">
                  <i class="fas fa-user-circle fa-4x text-primary"></i>
                </div>
                <h5 class="mb-1">{{ authStore.userFullName }}</h5>
                <p class="text-muted mb-0">{{ authStore.currentUser?.email }}</p>
                <small class="text-muted">Member since {{ formatDate(authStore.currentUser?.created_at) }}</small>
              </div>
            </div>

            <!-- Navigation Menu -->
            <div class="card mt-3 border-0 shadow-sm">
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <a href="#profile" class="list-group-item list-group-item-action active" @click="activeTab = 'profile'">
                    <i class="fas fa-user me-2"></i>Profile
                  </a>
                  <router-link to="/orders" class="list-group-item list-group-item-action">
                    <i class="fas fa-shopping-bag me-2"></i>Orders
                  </router-link>
                  <a href="#wishlist" class="list-group-item list-group-item-action" @click="activeTab = 'wishlist'">
                    <i class="fas fa-heart me-2"></i>Wishlist
                  </a>
                  <a href="#settings" class="list-group-item list-group-item-action" @click="activeTab = 'settings'">
                    <i class="fas fa-cog me-2"></i>Settings
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Content -->
          <div class="col-lg-9">
            <!-- Profile Information Tab -->
            <div v-if="activeTab === 'profile'" class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="mb-0">Profile Information</h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateProfile">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="first_name" class="form-label">First Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="first_name"
                        v-model="profileForm.first_name"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="last_name" class="form-label">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="last_name"
                        v-model="profileForm.last_name"
                        required
                      >
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      :value="authStore.currentUser?.email"
                      disabled
                    >
                    <small class="text-muted">Email cannot be changed</small>
                  </div>

                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      v-model="profileForm.phone"
                      placeholder="Enter your phone number"
                    >
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <textarea
                      class="form-control"
                      id="address"
                      v-model="profileForm.address"
                      rows="3"
                      placeholder="Enter your address"
                    ></textarea>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="city" class="form-label">City</label>
                      <input
                        type="text"
                        class="form-control"
                        id="city"
                        v-model="profileForm.city"
                        placeholder="Enter your city"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="state" class="form-label">State</label>
                      <input
                        type="text"
                        class="form-control"
                        id="state"
                        v-model="profileForm.state"
                        placeholder="Enter your state"
                      >
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="zip_code" class="form-label">ZIP Code</label>
                      <input
                        type="text"
                        class="form-control"
                        id="zip_code"
                        v-model="profileForm.zip_code"
                        placeholder="Enter ZIP code"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="country" class="form-label">Country</label>
                      <input
                        type="text"
                        class="form-control"
                        id="country"
                        v-model="profileForm.country"
                        placeholder="Enter your country"
                      >
                    </div>
                  </div>

                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary" :disabled="updating">
                      <span v-if="updating" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      {{ updating ? 'Updating...' : 'Update Profile' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>




            <!-- Wishlist Tab -->
            <div v-if="activeTab === 'wishlist'" class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="mb-0">My Wishlist</h5>
              </div>
              <div class="card-body text-center py-5">
                <i class="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5>Wishlist is Empty</h5>
                <p class="text-muted">Save your favorite products to your wishlist</p>
                <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-if="activeTab === 'settings'" class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="mb-0">Account Settings</h5>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <h6>Change Password</h6>
                  <p class="text-muted">Update your password to keep your account secure</p>
                  <button class="btn btn-outline-primary">Change Password</button>
                </div>

                <div class="mb-4">
                  <h6>Notification Preferences</h6>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="email_notifications" checked>
                    <label class="form-check-label" for="email_notifications">
                      Email notifications
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="sms_notifications">
                    <label class="form-check-label" for="sms_notifications">
                      SMS notifications
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <h6>Privacy Settings</h6>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="profile_public" checked>
                    <label class="form-check-label" for="profile_public">
                      Make profile public
                    </label>
                  </div>
                </div>

                <div class="d-grid">
                  <button class="btn btn-primary">Save Settings</button>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const activeTab = ref('profile')
    const updating = ref(false)

    const profileForm = reactive({
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: ''
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

        const formatPrice = (price) => {
      if (!price) return '$0.00'
      return `$${Number(price).toFixed(2)}`
    }

    const updateProfile = async () => {
      updating.value = true
      
      try {
        const result = await authStore.updateProfile(profileForm)
        if (result.success) {
          // Show success message or toast
          console.log('Profile updated successfully')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      } finally {
        updating.value = false
      }
    }

    onMounted(() => {
      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }

      // Populate form with current user data
      if (authStore.currentUser) {
        profileForm.first_name = authStore.currentUser.first_name || ''
        profileForm.last_name = authStore.currentUser.last_name || ''
        profileForm.phone = authStore.currentUser.phone || ''
        profileForm.address = authStore.currentUser.address || ''
        profileForm.city = authStore.currentUser.city || ''
        profileForm.state = authStore.currentUser.state || ''
        profileForm.zip_code = authStore.currentUser.zip_code || ''
        profileForm.country = authStore.currentUser.country || ''
      }
    })



    return {
      authStore,
      activeTab,
      updating,
      profileForm,
      formatDate,
      formatPrice,
      updateProfile
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

.profile-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-group-item {
  border: none;
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.list-group-item i {
  width: 20px;
}

.form-control {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.card-body {
  padding: 2rem;
}
</style>
