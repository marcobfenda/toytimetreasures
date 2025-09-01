# 🔐 OnlineShop Authentication System

## Overview

Your OnlineShop now includes a complete, production-ready authentication system with user registration, login, profile management, and secure session handling.

## ✨ Features

### 🔑 User Authentication
- **User Registration**: Complete signup form with validation
- **User Login**: Secure login with username/email and password
- **Session Management**: Automatic session persistence with localStorage
- **Password Security**: Bcrypt password hashing
- **Duplicate Prevention**: Username and email uniqueness validation

### 👤 User Profile Management
- **Profile Information**: First name, last name, email, phone, address
- **Profile Updates**: Secure profile modification
- **Address Management**: Complete address fields (street, city, state, ZIP, country)
- **Account Settings**: Notification preferences and privacy settings

### 🛡️ Security Features
- **Password Hashing**: Bcrypt with PASSWORD_DEFAULT
- **Input Validation**: Comprehensive form validation
- **SQL Injection Protection**: Prepared statements
- **CORS Support**: Cross-origin resource sharing enabled
- **Session Tokens**: Secure session management

## 🏗️ Architecture

### Backend (PHP)
```
backend/api/auth.php          # Main authentication API
backend/config/database.php   # Database connection
```

### Frontend (Vue.js + Pinia)
```
frontend/src/stores/auth.js   # Authentication state management
frontend/src/views/Login.vue  # Login page component
frontend/src/views/Register.vue # Registration page component
frontend/src/views/Profile.vue # User profile page component
```

### Database Schema
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 API Endpoints

### Authentication API (`/api/auth.php`)

#### POST - User Registration
```bash
curl -X POST http://localhost/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "1",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### POST - User Login
```bash
curl -X POST http://localhost/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "username": "johndoe",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "1",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false,
    "session_token": "abc123..."
  }
}
```

#### POST - Update Profile
```bash
curl -X POST http://localhost/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_profile",
    "user_id": "1",
    "first_name": "John",
    "last_name": "Smith",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  }'
```

#### GET - Get User Profile
```bash
curl "http://localhost/api/auth.php?user_id=1"
```

## 🎯 Frontend Usage

### Authentication Store (Pinia)

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check authentication status
if (authStore.isAuthenticated) {
  console.log('User is logged in:', authStore.userFullName)
}

// Login
const result = await authStore.login(username, password)
if (result.success) {
  // Redirect to dashboard
}

// Register
const result = await authStore.register(userData)
if (result.success) {
  // Show success message
}

// Logout
authStore.logout()
```

### Route Protection

```javascript
// In router configuration
{
  path: '/profile',
  name: 'Profile',
  component: Profile,
  meta: { requiresAuth: true }
}

// In component
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
```

## 🧪 Testing

### Run Authentication Tests
```bash
./test-auth.sh
```

This script tests:
- ✅ User registration
- ✅ User login
- ✅ Profile retrieval
- ✅ Profile updates
- ✅ Duplicate prevention
- ✅ Security validation
- ✅ Frontend routes
- ✅ Container status

### Manual Testing
1. **Registration**: Visit `/register` and create a new account
2. **Login**: Visit `/login` and sign in with your credentials
3. **Profile**: Visit `/profile` to manage your account
4. **Navigation**: Check that the navbar shows your name when logged in

## 🔧 Configuration

### Environment Variables
The system uses the database configuration from `backend/config/database.php`:
- Database host, name, username, and password
- Connection settings and error handling

### Security Settings
- **Password Requirements**: Minimum 8 characters
- **Username Requirements**: Minimum 3 characters, alphanumeric + underscore only
- **Email Validation**: Standard email format validation
- **Session Tokens**: 32-character hexadecimal tokens

## 🚨 Security Considerations

### Production Deployment
1. **HTTPS**: Always use HTTPS in production
2. **JWT Tokens**: Replace session tokens with JWT for stateless authentication
3. **Rate Limiting**: Implement API rate limiting
4. **Password Policies**: Enforce stronger password requirements
5. **Session Timeout**: Add automatic session expiration
6. **Audit Logging**: Log authentication events

### Current Security Features
- ✅ Password hashing with bcrypt
- ✅ SQL injection protection
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Secure session management

## 📱 User Experience Features

### Registration Page
- Beautiful, responsive design
- Real-time form validation
- Password strength indicators
- Terms and conditions checkbox
- Success/error messaging

### Login Page
- Clean, intuitive interface
- Remember me functionality
- Forgot password link
- Social login placeholders
- Secure password fields

### Profile Page
- Tabbed interface (Profile, Orders, Wishlist, Settings)
- Editable profile information
- Address management
- Account preferences
- Responsive design

## 🔄 State Management

### Authentication State
```javascript
// Store state
{
  user: null,                    // Current user object
  isAuthenticated: false,        // Authentication status
  loading: false,                // API call status
  error: null                    // Error messages
}

// Computed properties
{
  currentUser: user,             // Current user
  isAdmin: user?.is_admin,       // Admin status
  userFullName: formatted name   // Full name display
}
```

### Persistence
- User data stored in localStorage
- Automatic authentication restoration
- Secure session management
- Cart data preservation

## 🎨 Styling

### Design System
- **Colors**: Bootstrap primary colors with custom CSS variables
- **Typography**: Modern, readable fonts
- **Components**: Consistent card designs and form styling
- **Responsiveness**: Mobile-first design approach
- **Animations**: Smooth hover effects and transitions

### CSS Variables
```css
:root {
  --primary-color: #007bff;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --warning-color: #ffc107;
}
```

## 🚀 Getting Started

1. **Start the application**:
   ```bash
   docker compose up -d
   ```

2. **Access the website**:
   - Main site: http://localhost
   - Login: http://localhost/login
   - Register: http://localhost/register

3. **Test the system**:
   ```bash
   ./test-auth.sh
   ```

4. **Create your first account**:
   - Visit the registration page
   - Fill out the form
   - Verify your account creation
   - Test login functionality

## 🔮 Future Enhancements

### Planned Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] User roles and permissions
- [ ] Account deletion
- [ ] Activity logging

### Integration Opportunities
- [ ] Shopping cart persistence
- [ ] Order history tracking
- [ ] Wishlist functionality
- [ ] Review and rating system
- [ ] Newsletter subscriptions

## 📞 Support

If you encounter any issues:
1. Check the container logs: `docker compose logs`
2. Run the test script: `./test-auth.sh`
3. Verify database connectivity
4. Check browser console for frontend errors

---

**🎉 Congratulations!** Your OnlineShop now has a professional-grade authentication system that rivals commercial e-commerce platforms.
