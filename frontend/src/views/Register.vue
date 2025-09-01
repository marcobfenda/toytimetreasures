<template>
  <div class="register-page">
    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="display-4 fw-bold">Create Account</h1>
            <p class="lead">Join our community and start shopping today!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Registration Form -->
    <section class="registration-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <h2 class="text-center mb-4">Sign Up</h2>
                
                <!-- Success Message -->
                <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ successMessage }}
                  <button type="button" class="btn-close" @click="successMessage = ''"></button>
                </div>

                <!-- Error Message -->
                <div v-if="authStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ authStore.error }}
                  <button type="button" class="btn-close" @click="authStore.clearError()"></button>
                </div>

                <form @submit.prevent="handleRegister" class="needs-validation" novalidate>
                  <div class="row">
                    <!-- First Name -->
                    <div class="col-md-6 mb-3">
                      <label for="first_name" class="form-label">First Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.first_name }"
                        id="first_name"
                        v-model="form.first_name"
                        required
                        placeholder="Enter your first name"
                      >
                      <div class="invalid-feedback" v-if="errors.first_name">
                        {{ errors.first_name }}
                      </div>
                    </div>

                    <!-- Last Name -->
                    <div class="col-md-6 mb-3">
                      <label for="last_name" class="form-label">Last Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.last_name }"
                        id="last_name"
                        v-model="form.last_name"
                        required
                        placeholder="Enter your last name"
                      >
                      <div class="invalid-feedback" v-if="errors.last_name">
                        {{ errors.last_name }}
                      </div>
                    </div>
                  </div>

                  <!-- Username -->
                  <div class="mb-3">
                    <label for="username" class="form-label">Username *</label>
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
                        placeholder="Choose a unique username"
                        minlength="3"
                      >
                    </div>
                    <div class="invalid-feedback" v-if="errors.username">
                      {{ errors.username }}
                    </div>
                    <small class="form-text text-muted">Username must be at least 3 characters long</small>
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label for="email" class="form-label">Email Address *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        id="email"
                        v-model="form.email"
                        required
                        placeholder="Enter your email address"
                      >
                    </div>
                    <div class="invalid-feedback" v-if="errors.email">
                      {{ errors.email }}
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
                        placeholder="Create a strong password"
                        minlength="8"
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
                    <small class="form-text text-muted">Password must be at least 8 characters long</small>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-3">
                    <label for="confirm_password" class="form-label">Confirm Password *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        :class="{ 'is-invalid': errors.confirm_password }"
                        id="confirm_password"
                        v-model="form.confirm_password"
                        required
                        placeholder="Confirm your password"
                      >
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" v-if="errors.confirm_password">
                      {{ errors.confirm_password }}
                    </div>
                  </div>

                  <!-- Terms and Conditions -->
                  <div class="mb-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        :class="{ 'is-invalid': errors.terms }"
                        type="checkbox"
                        id="terms"
                        v-model="form.terms"
                        required
                      >
                      <label class="form-check-label" for="terms">
                        I agree to the <a href="#" class="text-primary">Terms and Conditions</a> and 
                        <a href="#" class="text-primary">Privacy Policy</a> *
                      </label>
                      <div class="invalid-feedback" v-if="errors.terms">
                        {{ errors.terms }}
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid mb-3">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg"
                      :disabled="authStore.loading"
                    >
                      <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      <i v-else class="fas fa-user-plus me-2"></i>
                      {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
                    </button>
                  </div>

                  <!-- Login Link -->
                  <div class="text-center">
                    <p class="mb-0">
                      Already have an account? 
                      <router-link to="/login" class="text-primary fw-bold">Sign In</router-link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <!-- Benefits Section -->
            <div class="card mt-4 border-0 bg-light">
              <div class="card-body text-center">
                <h5 class="mb-3">Why Create an Account?</h5>
                <div class="row g-3">
                  <div class="col-4">
                    <div class="benefit-item">
                      <i class="fas fa-shopping-cart fa-2x text-primary mb-2"></i>
                      <p class="small mb-0">Save Cart Items</p>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="benefit-item">
                      <i class="fas fa-heart fa-2x text-primary mb-2"></i>
                      <p class="small mb-0">Wishlist</p>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="benefit-item">
                      <i class="fas fa-truck fa-2x text-primary mb-2"></i>
                      <p class="small mb-0">Track Orders</p>
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
  name: 'Register',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    // Form data
    const form = reactive({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      terms: false
    })

    // Form state
    const errors = reactive({})
    const successMessage = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Validation rules
    const validateForm = () => {
      errors.value = {}
      let isValid = true

      // First Name validation
      if (!form.first_name.trim()) {
        errors.first_name = 'First name is required'
        isValid = false
      } else if (form.first_name.trim().length < 2) {
        errors.first_name = 'First name must be at least 2 characters'
        isValid = false
      }

      // Last Name validation
      if (!form.last_name.trim()) {
        errors.last_name = 'Last name is required'
        isValid = false
      } else if (form.last_name.trim().length < 2) {
        errors.last_name = 'Last name must be at least 2 characters'
        isValid = false
      }

      // Username validation
      if (!form.username.trim()) {
        errors.username = 'Username is required'
        isValid = false
      } else if (form.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters'
        isValid = false
      } else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) {
        errors.username = 'Username can only contain letters, numbers, and underscores'
        isValid = false
      }

      // Email validation
      if (!form.email.trim()) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      // Password validation
      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
        isValid = false
      }

      // Confirm Password validation
      if (!form.confirm_password) {
        errors.confirm_password = 'Please confirm your password'
        isValid = false
      } else if (form.password !== form.confirm_password) {
        errors.confirm_password = 'Passwords do not match'
        isValid = false
      }

      // Terms validation
      if (!form.terms) {
        errors.terms = 'You must agree to the terms and conditions'
        isValid = false
      }

      return isValid
    }

    // Handle form submission
    const handleRegister = async () => {
      if (!validateForm()) {
        return
      }

      const result = await authStore.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim()
      })

      if (result.success) {
        successMessage.value = result.message
        // Clear form
        Object.keys(form).forEach(key => {
          if (key === 'terms') {
            form[key] = false
          } else {
            form[key] = ''
          }
        })
        
        // Redirect to login (preserve redirect if present) after 1.5 seconds
        setTimeout(() => {
          if (route.query.redirect) {
            router.push({ name: 'Login', query: { redirect: route.query.redirect } })
          } else {
            router.push({ name: 'Login' })
          }
        }, 1500)
      }
    }

    // Clear errors when component mounts
    onMounted(() => {
      authStore.clearError()
    })

    return {
      form,
      errors,
      successMessage,
      showPassword,
      showConfirmPassword,
      route,
      authStore,
      handleRegister
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

.benefit-item {
  padding: 1rem;
}

.benefit-item i {
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

.alert-success {
  background-color: #d1e7dd;
  color: #0f5132;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .benefit-item {
    padding: 0.5rem;
  }
}
</style>
