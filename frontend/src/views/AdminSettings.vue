<template>
  <div class="admin-settings-page container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Site Settings</h1>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="fetchSettings" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          Refresh
        </button>
        <button class="btn btn-sm btn-primary" @click="saveAllSettings" :disabled="loading || !hasChanges">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
          Save All Changes
        </button>
      </div>
    </div>

    <!-- Debug Info (temporary) -->
    <div class="alert alert-info mb-4">
      <h6>Debug Information:</h6>
      <div class="row">
        <div class="col-md-6">
          <strong>Auth Store:</strong><br>
          isAuthenticated: {{ authStore.isAuthenticated }}<br>
          isAdmin: {{ authStore.isAdmin }}<br>
          User ID: {{ authStore.currentUser?.id }}<br>
          User Admin Flag: {{ authStore.currentUser?.is_admin }}
        </div>
        <div class="col-md-6">
          <strong>Local Storage:</strong><br>
          isAuthenticated: {{ getLocalStorageItem('isAuthenticated') }}<br>
          isAdmin: {{ getLocalStorageItem('isAdmin') }}<br>
          User: {{ getLocalStorageItem('user') ? 'Present' : 'Not found' }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading site settings...</p>
    </div>

    <div v-else class="row">
      <!-- Shipping & Tax Settings -->
      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="fas fa-shipping-fast me-2"></i>
              Shipping & Tax Settings
            </h5>
          </div>
          <div class="card-body">
                          <div class="mb-3">
                <label for="shipping_fee" class="form-label">Standard Shipping Fee ($)</label>
                <input
                  type="number"
                  class="form-control"
                  id="shipping_fee"
                  v-model="settings.shipping_fee.setting_value"
                  step="0.01"
                  min="0"
                  @input="markAsChanged"
                >
                <small class="text-muted">{{ settings.shipping_fee?.description || 'Standard shipping fee' }}</small>
              </div>
            
            <div class="mb-3">
              <label for="free_shipping_threshold" class="form-label">Free Shipping Threshold ($)</label>
                              <input
                  type="number"
                  class="form-control"
                  id="free_shipping_threshold"
                  v-model="settings.free_shipping_threshold.setting_value"
                  step="0.01"
                  min="0"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.free_shipping_threshold?.description || 'Free shipping threshold' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="tax_rate" class="form-label">Tax Rate (%)</label>
                              <input
                  type="number"
                  class="form-control"
                  id="tax_rate"
                  v-model="settings.tax_rate.setting_value"
                  step="0.1"
                  min="0"
                  max="100"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.tax_rate?.description || 'Tax rate percentage' }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Site Information -->
      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2"></i>
              Site Information
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="site_name" class="form-label">Site Name</label>
                              <input
                  type="text"
                  class="form-control"
                  id="site_name"
                  v-model="settings.site_name.setting_value"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.site_name?.description || 'Website name' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="site_description" class="form-label">Site Description</label>
                              <textarea
                  class="form-control"
                  id="site_description"
                  v-model="settings.site_description.setting_value"
                  rows="3"
                  @input="markAsChanged"
                ></textarea>
              <small class="text-muted">{{ settings.site_description?.description || 'Website description' }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="fas fa-address-book me-2"></i>
              Contact Information
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="contact_email" class="form-label">Contact Email</label>
                              <input
                  type="email"
                  class="form-control"
                  id="contact_email"
                  v-model="settings.contact_email.setting_value"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.contact_email?.description || 'Contact email address' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="contact_phone" class="form-label">Contact Phone</label>
                              <input
                  type="tel"
                  class="form-control"
                  id="contact_phone"
                  v-model="settings.contact_phone.setting_value"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.contact_phone?.description || 'Contact phone number' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="business_address" class="form-label">Business Address</label>
                              <textarea
                  class="form-control"
                  id="business_address"
                  v-model="settings.business_address.setting_value"
                  rows="2"
                  @input="markAsChanged"
                ></textarea>
              <small class="text-muted">{{ settings.business_address?.description || 'Business address' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="business_hours" class="form-label">Business Hours</label>
                              <input
                  type="text"
                  class="form-control"
                  id="business_hours"
                  v-model="settings.business_hours.setting_value"
                  @input="markAsChanged"
                >
              <small class="text-muted">{{ settings.business_hours?.description || 'Business hours' }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Policies -->
      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <i class="fas fa-file-contract me-2"></i>
              Policies
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="return_policy" class="form-label">Return Policy</label>
                              <textarea
                  class="form-control"
                  id="return_policy"
                  v-model="settings.return_policy.setting_value"
                  rows="3"
                  @input="markAsChanged"
                ></textarea>
              <small class="text-muted">{{ settings.return_policy?.description || 'Return policy' }}</small>
            </div>
            
            <div class="mb-3">
              <label for="shipping_policy" class="form-label">Shipping Policy</label>
                              <textarea
                  class="form-control"
                  id="shipping_policy"
                  v-model="settings.shipping_policy.setting_value"
                  rows="3"
                  @input="markAsChanged"
                ></textarea>
              <small class="text-muted">{{ settings.shipping_policy?.description || 'Shipping policy' }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Settings Table -->
    <div class="card border-0 shadow-sm mt-4">
      <div class="card-header">
        <h5 class="mb-0">All Settings (Advanced)</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Setting Key</th>
                <th>Value</th>
                <th>Type</th>
                <th>Description</th>
                <th>Editable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="setting in allSettings" :key="setting.setting_key">
                <td><code>{{ setting.setting_key }}</code></td>
                <td>
                  <input
                    v-if="setting.is_editable"
                    type="text"
                    class="form-control form-control-sm"
                    v-model="setting.setting_value"
                    @input="markAsChanged"
                  >
                  <span v-else class="text-muted">{{ setting.setting_value }}</span>
                </td>
                <td><span class="badge bg-secondary">{{ setting.setting_type }}</span></td>
                <td>{{ setting.description }}</td>
                <td>
                  <span v-if="setting.is_editable" class="badge bg-success">Yes</span>
                  <span v-else class="badge bg-secondary">No</span>
                </td>
                <td>
                  <button
                    v-if="setting.is_editable"
                    class="btn btn-sm btn-outline-primary"
                    @click="updateSetting(setting.setting_key, setting.setting_value)"
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdminSettings',
  setup() {
    const authStore = useAuthStore()
    const loading = ref(false)
    const saving = ref(false)
    const hasChanges = ref(false)
    
    const settings = reactive({
      shipping_fee: { setting_value: '5.99', description: 'Standard shipping fee for orders under free shipping threshold' },
      free_shipping_threshold: { setting_value: '50.00', description: 'Order amount threshold for free shipping' },
      tax_rate: { setting_value: '8.5', description: 'Tax rate as percentage' },
      site_name: { setting_value: 'Toy Time Treasures', description: 'Website name' },
      site_description: { setting_value: 'Your one-stop shop for new and vintage toys', description: 'Website description' },
      contact_email: { setting_value: 'info@toytimetreasures.com', description: 'Contact email address' },
      contact_phone: { setting_value: '+1 (555) 123-4567', description: 'Contact phone number' },
      business_address: { setting_value: '123 Toy Street, Play City, PC 12345', description: 'Business address' },
      business_hours: { setting_value: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed', description: 'Business hours' },
      return_policy: { setting_value: '30-day return policy for unused items in original packaging', description: 'Return policy' },
      shipping_policy: { setting_value: 'Standard shipping: 3-5 business days, Express shipping: 1-2 business days', description: 'Shipping policy' }
    })
    const allSettings = ref([])
    const originalValues = ref({})

    const apiBase = (window.location.port === '3000' || window.location.port === '3001') ? 'http://localhost' : ''

    const fetchSettings = async () => {
      loading.value = true
      try {
        const response = await fetch(`${apiBase}/api/site-settings.php`)
        const result = await response.json()
        
        if (result.success) {
          allSettings.value = result.settings
          
          // Organize settings by category for the form
          result.settings.forEach(setting => {
            if (settings[setting.setting_key]) {
              // Update existing setting with fetched data
              settings[setting.setting_key].setting_value = setting.setting_value
              settings[setting.setting_key].description = setting.description
              settings[setting.setting_key].setting_type = setting.setting_type
              settings[setting.setting_key].is_editable = setting.is_editable
            } else {
              // Add new setting if it doesn't exist in our defaults
              settings[setting.setting_key] = setting
            }
            originalValues.value[setting.setting_key] = setting.setting_value
          })
        } else {
          console.error('Failed to fetch settings:', result.message)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        // If API fails, use defaults and set original values
        Object.keys(settings).forEach(key => {
          originalValues.value[key] = settings[key].setting_value
        })
      } finally {
        loading.value = false
      }
    }

    const updateSetting = async (key, value) => {
      try {
        const response = await fetch(`${apiBase}/api/site-settings.php`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, value })
        })
        
        const result = await response.json()
        if (result.success) {
          originalValues.value[key] = value
          checkForChanges()
        } else {
          throw new Error(result.message || 'Failed to update setting')
        }
      } catch (error) {
        console.error('Error updating setting:', error)
        alert('Failed to update setting: ' + error.message)
      }
    }

    const saveAllSettings = async () => {
      saving.value = true
      try {
        const promises = []
        
        for (const [key, setting] of Object.entries(settings)) {
          if (setting.setting_value !== originalValues.value[key]) {
            promises.push(updateSetting(key, setting.setting_value))
          }
        }
        
        await Promise.all(promises)
        hasChanges.value = false
        alert('All settings saved successfully!')
      } catch (error) {
        console.error('Error saving settings:', error)
        alert('Failed to save some settings')
      } finally {
        saving.value = false
      }
    }

    const getLocalStorageItem = (key) => {
      try {
        return typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : null
      } catch (e) {
        return null
      }
    }

    const markAsChanged = () => {
      checkForChanges()
    }

    const checkForChanges = () => {
      hasChanges.value = Object.entries(settings).some(([key, setting]) => {
        return setting.setting_value !== originalValues.value[key]
      })
    }

    onMounted(() => {
      fetchSettings()
    })

    return {
      authStore,
      loading,
      saving,
      hasChanges,
      settings,
      allSettings,
      fetchSettings,
      updateSetting,
      saveAllSettings,
      markAsChanged,
      getLocalStorageItem
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.form-control {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.table td, .table th {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
}
</style>
