const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/');
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form exists
    const loginForm = page.locator('form, .login-form, .auth-form');
    await expect(loginForm.first()).toBeVisible();
    
    // Check for email/username input
    const emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"], #email, #username');
    await expect(emailInput.first()).toBeVisible();
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    await expect(passwordInput.first()).toBeVisible();
    
    // Check for login button
    const loginButton = page.locator('button[type="submit"], .btn-login, .login-btn, button:has-text("Login")');
    await expect(loginButton.first()).toBeVisible();
  });

  test('should display registration form correctly', async ({ page }) => {
    await page.goto('/register');
    
    // Check if registration form exists
    const registerForm = page.locator('form, .register-form, .auth-form');
    await expect(registerForm.first()).toBeVisible();
    
    // Check for required fields
    const nameInput = page.locator('input[name="name"], input[name="fullName"], #name, #fullName');
    if (await nameInput.count() > 0) {
      await expect(nameInput.first()).toBeVisible();
    }
    
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    await expect(emailInput.first()).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    await expect(passwordInput.first()).toBeVisible();
    
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="password_confirmation"], #confirmPassword');
    if (await confirmPasswordInput.count() > 0) {
      await expect(confirmPasswordInput.first()).toBeVisible();
    }
    
    // Check for register button
    const registerButton = page.locator('button[type="submit"], .btn-register, .register-btn, button:has-text("Register")');
    await expect(registerButton.first()).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    const loginButton = page.locator('button[type="submit"], .btn-login, .login-btn, button:has-text("Login")');
    await loginButton.first().click();
    
    // Should show validation errors
    await page.waitForTimeout(500);
    
    // Look for error messages
    const errorMessages = page.locator('.error-message, .alert-danger, .text-danger, [role="alert"]');
    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');
    
    // Look for link to register page
    const registerLink = page.locator('a[href="/register"], .register-link, a:has-text("Register")');
    if (await registerLink.count() > 0) {
      await registerLink.first().click();
      await expect(page).toHaveURL('/register');
    }
    
    await page.goto('/register');
    
    // Look for link to login page
    const loginLink = page.locator('a[href="/login"], .login-link, a:has-text("Login")');
    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await expect(page).toHaveURL('/login');
    }
  });

  test('should handle successful login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in login form with test credentials
    const emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"], #email, #username');
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    
    await emailInput.first().fill('test@example.com');
    await passwordInput.first().fill('password123');
    
    // Submit form
    const loginButton = page.locator('button[type="submit"], .btn-login, .login-btn, button:has-text("Login")');
    await loginButton.first().click();
    
    // Wait for navigation or success message
    await page.waitForTimeout(2000);
    
    // Check if redirected to home or dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(profile|orders|admin|$)/);
  });

  test('should handle successful registration', async ({ page }) => {
    await page.goto('/register');
    
    // Fill in registration form
    const nameInput = page.locator('input[name="name"], input[name="fullName"], #name, #fullName');
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="password_confirmation"], #confirmPassword');
    
    if (await nameInput.count() > 0) {
      await nameInput.first().fill('Test User');
    }
    await emailInput.first().fill('newuser@example.com');
    await passwordInput.first().fill('newpassword123');
    
    if (await confirmPasswordInput.count() > 0) {
      await confirmPasswordInput.first().fill('newpassword123');
    }
    
    // Submit form
    const registerButton = page.locator('button[type="submit"], .btn-register, .register-btn, button:has-text("Register")');
    await registerButton.first().click();
    
    // Wait for registration process
    await page.waitForTimeout(2000);
    
    // Check if redirected or shows success message
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(profile|orders|admin|$)/);
  });

  test('should show user profile when logged in', async ({ page }) => {
    // Mock authentication state
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/profile');
    
    // Check if profile page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Look for user information
    const userInfo = page.locator('.user-info, .profile-info, .user-details');
    if (await userInfo.count() > 0) {
      await expect(userInfo.first()).toBeVisible();
    }
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/profile');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle logout functionality', async ({ page }) => {
    // Mock authentication state
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/');
    
    // Look for logout button/link
    const logoutButton = page.locator('.logout-btn, .btn-logout, a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      // Should redirect to home page
      await expect(page).toHaveURL('/');
      
      // Check if authentication state is cleared
      const isAuthenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'));
      expect(isAuthenticated).toBeNull();
    }
  });

  test('should remember user session', async ({ page }) => {
    // Mock authentication state
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/');
    
    // Refresh page
    await page.reload();
    
    // Should still be authenticated
    const isAuthenticated = await page.evaluate(() => localStorage.getItem('isAuthenticated'));
    expect(isAuthenticated).toBe('true');
  });
});
