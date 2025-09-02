# Playwright Test Suite for Online Shop

This directory contains comprehensive end-to-end tests for the online shop application using Playwright.

## Test Coverage

The test suite covers the following functionality:

### 1. Navigation Tests (`navigation.spec.js`)
- Header navigation and menu functionality
- Footer links and content
- Mobile responsive navigation
- Navigation state persistence

### 2. Home Page Tests (`home.spec.js`)
- Hero section display
- Featured products section
- Call-to-action buttons
- Categories section
- Search functionality
- Newsletter signup
- Responsive design across devices

### 3. Authentication Tests (`authentication.spec.js`)
- Login form functionality
- Registration form functionality
- Form validation
- User authentication flow
- Protected route access
- Session management
- Logout functionality

### 4. Products Tests (`products.spec.js`)
- Product listing page
- Product detail pages
- Product cards and information
- Category filtering
- Product search
- Product sorting
- Pagination
- Add to cart functionality

### 5. Shopping Cart Tests (`cart.spec.js`)
- Empty cart state
- Adding products to cart
- Cart item management
- Quantity updates
- Cart totals calculation
- Cart persistence
- Checkout navigation

### 6. Checkout Tests (`checkout.spec.js`)
- Authentication requirements
- Order summary display
- Billing information forms
- Shipping address forms
- Payment method selection
- Form validation
- Shipping cost calculation
- Order total breakdown

### 7. Admin Panel Tests (`admin.spec.js`)
- Admin access control
- Admin panel navigation
- Product management
- Order management
- Category management
- Site settings
- Contact message management

## Running Tests

### Prerequisites
- Node.js and npm installed
- Frontend application running on `http://localhost:3000`
- Backend API running on `http://localhost:8000`

### Test Commands

```bash
# Run all tests in headless mode
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

### Running Specific Test Files

```bash
# Run only navigation tests
npx playwright test navigation.spec.js

# Run only authentication tests
npx playwright test authentication.spec.js

# Run tests matching a pattern
npx playwright test --grep "login"
```

### Running Tests in Different Browsers

```bash
# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Configuration

The tests are configured in `playwright.config.js` with the following features:

- **Base URL**: `http://localhost:3000`
- **Web Server**: Automatically starts the dev server before tests
- **Browsers**: Chrome, Firefox, Safari, and mobile variants
- **Screenshots**: Captured on test failure
- **Videos**: Recorded on test failure
- **Traces**: Collected on first retry
- **Parallel Execution**: Tests run in parallel for faster execution

## Test Structure

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

## Test Data and Mocking

Tests use local storage mocking to simulate:
- User authentication states
- Admin privileges
- Cart contents
- User preferences

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Tests clean up their state in `beforeEach` hooks
3. **Selectors**: Use flexible selectors that work with different CSS class naming conventions
4. **Waiting**: Use proper wait strategies instead of arbitrary timeouts
5. **Assertions**: Comprehensive assertions to verify expected behavior

## Debugging Tests

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Step-by-Step Debugging
```bash
npx playwright test --debug navigation.spec.js
```

### Viewing Test Reports
```bash
npm run test:report
```

## Continuous Integration

The test suite is configured for CI environments:
- Retries on failure (2 retries in CI)
- Single worker in CI for stability
- Forbid-only mode to prevent accidental test.only usage

## Troubleshooting

### Common Issues

1. **Tests failing due to missing elements**: Check if CSS classes have changed
2. **Timing issues**: Increase wait timeouts or use proper wait strategies
3. **Browser compatibility**: Test in different browsers to identify issues
4. **Local storage issues**: Ensure proper cleanup in beforeEach hooks

### Debug Commands

```bash
# Show browser information
npx playwright --version

# Install browsers
npx playwright install

# Update browsers
npx playwright install --with-deps
```

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Use descriptive test names
3. Include proper setup and cleanup
4. Use flexible selectors
5. Add appropriate assertions
6. Test both positive and negative scenarios

## Test Maintenance

Regular maintenance tasks:
- Update selectors when UI changes
- Review and update test data
- Monitor test execution times
- Update browser versions
- Review test coverage gaps
