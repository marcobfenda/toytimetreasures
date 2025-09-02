# OnlineShop - Modern E-commerce Website

A modern, responsive e-commerce website built with Vue.js, PHP, MySQL, and Docker. This project replicates the look and feel of the Vasterad Trizzy theme with a clean, professional design.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Vue.js Frontend**: Single Page Application with Vue 3 Composition API
- **PHP Backend**: RESTful API with MySQL database
- **Docker Support**: Complete containerized development environment
- **Bootstrap 5**: Modern CSS framework for responsive design
- **Font Awesome**: Beautiful icons throughout the interface
- **Product Management**: Categories, products, search, and filtering
- **Shopping Cart**: Persistent cart with localStorage
- **User Authentication**: Secure login/registration system with JWT-like tokens
- **User Profiles**: Personal profile management and order history
- **Order Management**: Complete order processing with detailed item tracking
- **Admin Panel**: Administrative interface for managing products, categories, and orders
- **Responsive Design**: Mobile-first approach for all devices
- **Comprehensive Testing**: Full Playwright test suite covering all functionality

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Vite** - Build tool and dev server
- **Playwright** - End-to-end testing framework

### Backend
- **PHP 8.2** - Server-side scripting
- **MySQL 8.0** - Database
- **Apache** - Web server
- **PDO** - Database abstraction layer

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd onlineshop
```

### 2. Start the Application

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Main Site**: http://localhost (via Nginx)
- **Database**: localhost:3306

### 4. Stop the Application

```bash
docker compose down
```

## 🏗️ Project Structure

```
onlineshop/
├── backend/                 # PHP Backend
│   ├── api/                # API endpoints
│   ├── config/             # Database configuration
│   ├── database/           # Database initialization
│   ├── Dockerfile          # Backend container
│   └── php.ini            # PHP configuration
├── frontend/               # Vue.js Frontend
│   ├── src/               # Source code
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Vue components
│   │   ├── router/        # Vue router
│   │   ├── stores/        # Pinia stores
│   │   ├── views/         # Page components
│   │   ├── App.vue        # Main app component
│   │   └── main.js        # App entry point
│   ├── tests/             # Playwright test suite
│   │   ├── navigation.spec.js    # Navigation tests
│   │   ├── home.spec.js          # Home page tests
│   │   ├── authentication.spec.js # Authentication tests
│   │   ├── products.spec.js      # Product tests
│   │   ├── cart.spec.js          # Shopping cart tests
│   │   ├── checkout.spec.js      # Checkout tests
│   │   ├── admin.spec.js         # Admin panel tests
│   │   ├── run-tests.sh          # Test runner script
│   │   └── README.md             # Testing documentation
│   ├── Dockerfile         # Frontend container
│   ├── package.json       # Dependencies
│   ├── playwright.config.js # Playwright configuration
│   └── vite.config.js     # Vite configuration
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Docker services
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

- `DB_HOST`: MySQL host (default: mysql)
- `DB_NAME`: Database name (default: onlineshop)
- `DB_USER`: Database user (default: onlineshop_user)
- `DB_PASS`: Database password (default: onlineshop_password)

### Database

The MySQL database is automatically initialized with:
- Sample categories (Electronics, Clothing, Home & Garden, Sports, Books)
- Sample products with images
- Admin user (username: admin, password: admin123)
- Site settings table with configurable parameters
- Enhanced orders table with subtotal, shipping, and tax breakdown
- Order items table for detailed order tracking

## 📱 Available Routes

### Frontend Routes
- `/` - Home page with hero section and featured products
- `/products` - All products listing
- `/product/:slug` - Individual product detail
- `/category/:slug` - Products by category
- `/search` - Product search results
- `/cart` - Shopping cart
- `/checkout` - Secure checkout process (requires authentication)
- `/order-success/:orderId` - Order confirmation page
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile management
- `/orders` - User order history and tracking
- `/admin/*` - Administrative routes (requires admin privileges)

### Backend API Endpoints
- `GET /api/products.php` - Get all products
- `GET /api/products.php?featured=1` - Get featured products
- `GET /api/products.php?slug={slug}` - Get product by slug
- `GET /api/products.php?category={category}` - Get products by category
- `GET /api/products.php?search={query}` - Search products
- `GET /api/categories.php` - Get all categories
- `GET /api/categories.php?slug={slug}` - Get category by slug
- `POST /api/auth.php` - User authentication (login/register)
- `GET /api/orders.php?user_id={id}` - Get user orders with detailed items
- `POST /api/orders.php` - Create new order
- `PUT /api/orders.php` - Update order status
- `GET /api/site-settings.php` - Get site configuration
- `POST /api/contact.php` - Submit contact form

## 🎨 Customization

### Styling
- Main CSS file: `frontend/src/assets/css/style.css`
- CSS variables for easy color customization
- Responsive breakpoints for mobile-first design

### Order Management System
- **Enhanced Orders Table**: Includes subtotal, shipping cost, tax amount, and total breakdown
- **Order Items Tracking**: Detailed tracking of individual products in each order
- **Shipping Information**: Comprehensive shipping address and contact details
- **Payment Processing**: Secure payment information handling
- **Order Status Management**: Track orders from pending to delivered

### Components
- All Vue components are in `frontend/src/components/`
- Page views are in `frontend/src/views/`
- Reusable components can be created and imported

### Database
- Database schema: `backend/database/init.sql`
- Add new tables or modify existing ones
- Sample data can be customized

## 🧪 Testing

### Playwright Test Suite

This project includes a comprehensive end-to-end testing suite built with Playwright, covering all major functionality of the online shop.

#### Test Coverage

The test suite covers the following areas:

- **Navigation Tests** - Header, footer, mobile navigation, routing
- **Home Page Tests** - Hero section, featured products, search, responsiveness
- **Authentication Tests** - Login, registration, user management, protected routes
- **Products Tests** - Product listing, details, categories, search, filtering
- **Shopping Cart Tests** - Cart functionality, item management, totals
- **Checkout Tests** - Checkout forms, validation, payment methods, shipping
- **Admin Panel Tests** - Admin access, product/order management, admin controls

#### Running Tests

**Prerequisites:**
- Frontend application running on `http://localhost:3000`
- Backend API running on `http://localhost:8000`
- Node.js and npm installed

**Quick Test Commands:**
```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm run test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

**Using the Test Runner Script:**
```bash
# Make script executable (first time only)
chmod +x tests/run-tests.sh

# Run all tests
./tests/run-tests.sh all

# Run specific test file
./tests/run-tests.sh specific navigation.spec.js

# Run tests in specific browser
./tests/run-tests.sh browser firefox

# Show all options
./tests/run-tests.sh help
```

**Running Specific Tests:**
```bash
# Run only navigation tests
npx playwright test navigation.spec.js

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

#### Test Configuration

The tests are configured in `playwright.config.js` with:

- **Multi-browser support** - Chrome, Firefox, Safari, and mobile variants
- **Automatic dev server startup** - Runs `npm run dev` before tests
- **Screenshots & videos** - Captured on test failure for debugging
- **Parallel execution** - Tests run in parallel for faster execution
- **Retry logic** - Automatic retries on failure in CI environments

#### Test Structure

Each test file follows this pattern:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code for each test
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });
});
```

#### Test Data and Mocking

Tests use local storage mocking to simulate:
- User authentication states
- Admin privileges
- Cart contents
- User preferences

#### Debugging Tests

**Debug Mode:**
```bash
npm run test:debug
```

**UI Mode (Interactive):**
```bash
npm run test:ui
```

**Step-by-Step Debugging:**
```bash
npx playwright test --debug navigation.spec.js
```

**Viewing Test Reports:**
```bash
npm run test:report
```

#### Continuous Integration

The test suite is configured for CI environments:
- Retries on failure (2 retries in CI)
- Single worker in CI for stability
- Forbid-only mode to prevent accidental test.only usage

#### Troubleshooting Tests

**Common Issues:**
1. **Tests failing due to missing elements** - Check if CSS classes have changed
2. **Timing issues** - Increase wait timeouts or use proper wait strategies
3. **Browser compatibility** - Test in different browsers to identify issues
4. **Local storage issues** - Ensure proper cleanup in beforeEach hooks

**Debug Commands:**
```bash
# Show browser information
npx playwright --version

# Install browsers
npx playwright install

# Update browsers
npx playwright install --with-deps
```

**Test Maintenance:**
- Update selectors when UI changes
- Review and update test data
- Monitor test execution times
- Update browser versions
- Review test coverage gaps

For detailed testing documentation, see `frontend/tests/README.md`.

---

## 🚀 Development

### Frontend Development

```bash
# Enter frontend container
docker compose exec frontend sh

# Install new dependencies
npm install package-name

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI mode
npm run test:ui
```

### Recent Updates
- **Orders System**: Complete order management with detailed item tracking
- **User Authentication**: Secure login/registration with profile management
- **Enhanced Database**: Improved orders table structure with subtotal/shipping breakdown
- **Admin Panel**: Administrative interface for managing the e-commerce system
- **Responsive Orders Page**: Dedicated orders route with expandable order details

### Backend Development

```bash
# Enter backend container
docker compose exec backend sh

# PHP files are automatically reloaded
# Database changes require container restart
```

### Database Management

```bash
# Access MySQL
docker compose exec mysql mysql -u onlineshop_user -p onlineshop

# Backup database
docker compose exec mysql mysqldump -u onlineshop_user -p onlineshop > backup.sql

# Restore database
docker compose exec -T mysql mysql -u onlineshop_user -p onlineshop < backup.sql
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 80, 3000, 8000, and 3306 are available
2. **Permission issues**: Run `docker compose down` and `docker compose up -d` again
3. **Database connection**: Wait for MySQL to fully start (check logs)
4. **Authentication issues**: Clear browser localStorage if login problems persist
5. **Order display issues**: Ensure the orders API is returning detailed item data

### Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs mysql
docker compose logs nginx
```

### Reset Everything

```bash
# Stop and remove all containers, volumes, and networks
docker compose down -v

# Rebuild and start
docker compose up -d --build
```

## 📦 Production Deployment

### Build for Production

```bash
# Build frontend
docker compose exec frontend npm run build

# The built files will be in frontend/dist/
```

### Security Considerations
- Change default admin credentials
- Set up proper SSL certificates
- Configure secure database passwords
- Enable rate limiting on API endpoints
- Set up proper CORS policies

### Environment Variables
- Set production database credentials
- Configure Nginx for production
- Set up SSL certificates
- Configure domain names

### Scaling
- Use multiple backend containers
- Set up Redis for caching
- Configure CDN for static assets
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Vasterad Trizzy Theme** - Design inspiration
- **Vue.js Team** - Amazing frontend framework
- **Bootstrap Team** - CSS framework
- **Font Awesome** - Icon library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: marcobfenda@gmail.com
- Documentation: Check the project structure and API endpoints above

---

**Happy Coding! 🎉**
