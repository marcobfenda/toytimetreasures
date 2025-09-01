<template>
  <div class="login-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">Welcome Back</h1>
            <p class="lead">Sign in to your account to continue shopping</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Login Form -->
    <section class="login-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-7">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <h2 class="text-center mb-4">Sign In</h2>
                
                <!-- Error Message -->
                <div v-if="authStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ authStore.error }}
                  <button type="button" class="btn-close" @click="authStore.clearError()"></button>
                </div>

                <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
                  <!-- Username/Email -->
                  <div class="mb-3">
                    <label for="username" class="form-label">Username or Email *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.username }"
                        id="username"
                        v-model="form.username"
                        required
                        placeholder="Enter your username or email"
                        autocomplete="username"
                      >
                    </div>
                    <div class="invalid-feedback" v-if="errors.username">
                      {{ errors.username }}
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label for="password" class="form-label">Password *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        :class="{ 'is-invalid': errors.password }"
                        id="password"
                        v-model="form.password"
                        required
                        placeholder="Enter your password"
                        autocomplete="current-password"
                      >
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" v-if="errors.password">
                      {{ errors.password }}
                    </div>
                  </div>

                  <!-- Remember Me & Forgot Password -->
                  <div class="row mb-4">
                    <div class="col-6">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="remember"
                          v-model="form.remember"
                        >
                        <label class="form-check-label" for="remember">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div class="col-6 text-end">
                      <a href="#" class="text-primary text-decoration-none">Forgot password?</a>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid mb-4">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg"
                      :disabled="authStore.loading"
                    >
                      <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      <i v-else class="fas fa-sign-in-alt me-2"></i>
                      {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
                    </button>
                  </div>

                  <!-- Divider -->
                  <div class="text-center mb-4">
                    <span class="text-muted">or</span>
                  </div>

                  <!-- Social Login Buttons -->
                  <div class="row g-2 mb-4">
                    <div class="col-6">
                      <button type="button" class="btn btn-outline-dark w-100">
                        <i class="fab fa-google me-2"></i>
                        Google
                      </button>
                    </div>
                    <div class="col-6">
                      <button type="button" class="btn btn-outline-primary w-100">
                        <i class="fab fa-facebook-f me-2"></i>
                        Facebook
                      </button>
                    </div>
                  </div>

                  <!-- Register Link -->
                  <div class="text-center">
                    <p class="mb-0">
                      Don't have an account? 
                      <router-link :to="route.query.redirect ? { name: 'Register', query: { redirect: route.query.redirect } } : { name: 'Register' }" class="text-primary fw-bold">Sign Up</router-link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <!-- Features Section -->
            <div class="card mt-4 border-0 bg-light">
              <div class="card-body text-center">
                <h6 class="mb-3">Benefits of Signing In</h6>
                <div class="row g-2">
                  <div class="col-4">
                    <div class="feature-item">
                      <i class="fas fa-shopping-bag fa-lg text-primary mb-1"></i>
                      <p class="small mb-0">Quick Checkout</p>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="feature-item">
                      <i class="fas fa-history fa-lg text-primary mb-1"></i>
                      <p class="small mb-0">Order History</p>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="feature-item">
                      <i class="fas fa-star fa-lg text-primary mb-1"></i>
                      <p class="small mb-0">Save Favorites</p>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    // Form data
    const form = reactive({
      username: '',
      password: '',
      remember: false
    })

    // Form state
    const errors = reactive({})
    const showPassword = ref(false)

    // Validation rules
    const validateForm = () => {
      errors.value = {}
      let isValid = true

      // Username validation
      if (!form.username.trim()) {
        errors.username = 'Username or email is required'
        isValid = false
      }

      // Password validation
      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      }

      return isValid
    }

    // Handle form submission
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      const result = await authStore.login(form.username.trim(), form.password)

      if (result.success) {
        // Redirect to intended page or default to home
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }
    }

    // Clear errors when component mounts
    onMounted(() => {
      authStore.clearError()
      
      // Check if user is already logged in
      if (authStore.isAuthenticated) {
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }
    })

    return {
      form,
      errors,
      showPassword,
      route,
      authStore,
      handleLogin
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

.card-body {
  padding: 2.5rem;
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

.form-control.is-invalid {
  border-color: var(--danger-color);
}

.input-group-text {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-right: none;
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-control:focus {
  border-left: 1px solid var(--primary-color);
}

.btn-primary {
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.btn-outline-dark,
.btn-outline-primary {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-outline-dark:hover,
.btn-outline-primary:hover {
  transform: translateY(-1px);
}

.feature-item {
  padding: 0.5rem;
}

.feature-item i {
  display: block;
  margin: 0 auto;
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.alert {
  border-radius: 0.5rem;
  border: none;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .feature-item {
    padding: 0.25rem;
  }
}
</style>
