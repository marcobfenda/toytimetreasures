import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Get the correct API base URL based on current environment
  const getApiUrl = () => {
    // If we're on localhost:3000 (Vite dev server), use localhost:80 for API
    if (window.location.port === '3000') {
      return 'http://localhost'
    }
    // Otherwise use relative URL (for production/Nginx)
    return ''
  }

  // Getters
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.is_admin || false)
  const userFullName = computed(() => {
    if (user.value) {
      return `${user.value.first_name} ${user.value.last_name}`
    }
    return ''
  })

  // Actions
  const login = async (username, password) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${getApiUrl()}/api/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      })

      const data = await response.json()
      
      if (data.success) {
        user.value = data.user
        isAuthenticated.value = true
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('isAdmin', data.user.is_admin ? 'true' : 'false')
        
        // Debug logging
        console.log('Login successful:', {
          user: data.user,
          isAdmin: data.user.is_admin,
          storedAdmin: localStorage.getItem('isAdmin')
        })
        
        return { success: true, message: data.message }
      } else {
        error.value = data.message
        return { success: false, message: data.message }
      }
    } catch (err) {
      error.value = 'Network error occurred'
      return { success: false, message: 'Network error occurred' }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${getApiUrl()}/api/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          ...userData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Don't auto-login after registration, user needs to login
        return { success: true, message: data.message }
      } else {
        error.value = data.message
        return { success: false, message: data.message }
      }
    } catch (err) {
      error.value = 'Network error occurred'
      return { success: false, message: 'Network error occurred' }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('isAdmin')
    
    // Clear any other stored data
    localStorage.removeItem('cart')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated')
    
    if (storedUser && storedAuth === 'true') {
      try {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        return true
      } catch (err) {
        // Invalid stored data, clear it
        logout()
        return false
      }
    }
    return false
  }

  const updateProfile = async (profileData) => {
    if (!user.value) {
      return { success: false, message: 'User not authenticated' }
    }

    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${getApiUrl()}/api/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_profile',
          user_id: user.value.id,
          ...profileData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local user data
        user.value = { ...user.value, ...profileData }
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user.value))
        localStorage.setItem('isAdmin', user.value.is_admin ? 'true' : 'false')
        
        return { success: true, message: data.message }
      } else {
        error.value = data.message
        return { success: false, message: data.message }
      }
    } catch (err) {
      error.value = 'Network error occurred'
      return { success: false, message: 'Network error occurred' }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on store creation
  checkAuth()

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Getters
    currentUser,
    isAdmin,
    userFullName,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    clearError
  }
})
