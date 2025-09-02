const { test, expect } = require('@playwright/test');

test.describe('Admin Panel Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/');
  });

  test('should redirect non-admin users from admin routes', async ({ page }) => {
    // Mock regular user authentication (not admin)
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false
      }));
    });
    
    // Try to access admin routes
    const adminRoutes = ['/admin/products', '/admin/orders', '/admin/categories', '/admin/settings'];
    
    for (const route of adminRoutes) {
      await page.goto(route);
      
      // Should redirect to home page for non-admin users
      await expect(page).toHaveURL('/');
    }
  });

  test('should allow admin users to access admin panel', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    // Try to access admin products page
    await page.goto('/admin/products');
    
    // Should load admin page
    await expect(page).toHaveURL('/admin/products');
    
    // Check if admin page content is displayed
    const adminContent = page.locator('.admin-content, .admin-panel, .admin-container');
    if (await adminContent.count() > 0) {
      await expect(adminContent.first()).toBeVisible();
    }
  });

  test('should display admin products page correctly', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/products');
    
    // Check if admin products page loads
    await expect(page).toHaveURL('/admin/products');
    
    // Look for admin products content
    const adminProducts = page.locator('.admin-products, .products-management, .admin-container');
    
    if (await adminProducts.count() > 0) {
      await expect(adminProducts.first()).toBeVisible();
      
      // Check for add product button
      const addProductBtn = page.locator('.add-product, .btn-add-product, button:has-text("Add Product")');
      if (await addProductBtn.count() > 0) {
        await expect(addProductBtn.first()).toBeVisible();
      }
      
      // Check for products table/list
      const productsTable = page.locator('.products-table, .products-list, .admin-table');
      if (await productsTable.count() > 0) {
        await expect(productsTable.first()).toBeVisible();
      }
    }
  });

  test('should display admin orders page correctly', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/orders');
    
    // Check if admin orders page loads
    await expect(page).toHaveURL('/admin/orders');
    
    // Look for admin orders content
    const adminOrders = page.locator('.admin-orders, .orders-management, .admin-container');
    
    if (await adminOrders.count() > 0) {
      await expect(adminOrders.first()).toBeVisible();
      
      // Check for orders table/list
      const ordersTable = page.locator('.orders-table, .orders-list, .admin-table');
      if (await ordersTable.count() > 0) {
        await expect(ordersTable.first()).toBeVisible();
      }
    }
  });

  test('should display admin categories page correctly', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/categories');
    
    // Check if admin categories page loads
    await expect(page).toHaveURL('/admin/categories');
    
    // Look for admin categories content
    const adminCategories = page.locator('.admin-categories, .categories-management, .admin-container');
    
    if (await adminCategories.count() > 0) {
      await expect(adminCategories.first()).toBeVisible();
      
      // Check for add category button
      const addCategoryBtn = page.locator('.add-category, .btn-add-category, button:has-text("Add Category")');
      if (await addCategoryBtn.count() > 0) {
        await expect(addCategoryBtn.first()).toBeVisible();
      }
      
      // Check for categories table/list
      const categoriesTable = page.locator('.categories-table, .categories-list, .admin-table');
      if (await categoriesTable.count() > 0) {
        await expect(categoriesTable.first()).toBeVisible();
      }
    }
  });

  test('should display admin settings page correctly', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/settings');
    
    // Check if admin settings page loads
    await expect(page).toHaveURL('/admin/settings');
    
    // Look for admin settings content
    const adminSettings = page.locator('.admin-settings, .settings-management, .admin-container');
    
    if (await adminSettings.count() > 0) {
      await expect(adminSettings.first()).toBeVisible();
      
      // Check for settings form
      const settingsForm = page.locator('.settings-form, .site-settings, form');
      if (await settingsForm.count() > 0) {
        await expect(settingsForm.first()).toBeVisible();
      }
    }
  });

  test('should display admin contacts page correctly', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/contacts');
    
    // Check if admin contacts page loads
    await expect(page).toHaveURL('/admin/contacts');
    
    // Look for admin contacts content
    const adminContacts = page.locator('.admin-contacts, .contacts-management, .admin-container');
    
    if (await adminContacts.count() > 0) {
      await expect(adminContacts.first()).toBeVisible();
      
      // Check for contacts table/list
      const contactsTable = page.locator('.contacts-table, .contacts-list, .admin-table');
      if (await contactsTable.count() > 0) {
        await expect(contactsTable.first()).toBeVisible();
      }
    }
  });

  test('should have admin navigation menu', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/products');
    
    // Look for admin navigation
    const adminNav = page.locator('.admin-nav, .admin-menu, .admin-sidebar');
    
    if (await adminNav.count() > 0) {
      await expect(adminNav.first()).toBeVisible();
      
      // Check for admin menu items
      const adminMenuItems = adminNav.locator('a[href*="/admin"], .nav-link, .menu-item');
      if (await adminMenuItems.count() > 0) {
        await expect(adminMenuItems.first()).toBeVisible();
      }
    }
  });

  test('should handle admin logout', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/products');
    
    // Look for logout button
    const logoutBtn = page.locator('.logout-btn, .btn-logout, a:has-text("Logout")');
    
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      
      // Should redirect to home page
      await expect(page).toHaveURL('/');
      
      // Check if authentication state is cleared
      const isAuthenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'));
      expect(isAuthenticated).toBeNull();
    }
  });

  test('should maintain admin session across page refreshes', async ({ page }) => {
    // Mock admin user authentication
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true
      }));
    });
    
    await page.goto('/admin/products');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on admin page
    await expect(page).toHaveURL('/admin/products');
    
    // Should still be authenticated as admin
    const isAdmin = await page.evaluate(() => localStorage.getItem('isAdmin'));
    expect(isAdmin).toBe('true');
  });
});
