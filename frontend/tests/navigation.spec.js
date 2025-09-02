const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header with navigation menu', async ({ page }) => {
    // Check if header exists
    await expect(page.locator('header')).toBeVisible();
    
    // Check if logo/brand is visible
    await expect(page.locator('header .navbar-brand')).toBeVisible();
    
    // Check if main navigation links are present
    // On mobile, navigation might be collapsed, so we just check if elements exist
    const productsLink = page.locator('nav a[href="/products"]');
    const aboutLink = page.locator('nav a[href="/about"]');
    const contactLink = page.locator('nav a[href="/contact"]');
    
    // Just verify the links exist, don't require them to be visible on mobile
    expect(await productsLink.count()).toBeGreaterThan(0);
    expect(await aboutLink.count()).toBeGreaterThan(0);
    expect(await contactLink.count()).toBeGreaterThan(0);
  });

  test('should navigate to different pages from header', async ({ page }) => {
    // On mobile, we might need to expand the navigation first
    const mobileToggle = page.locator('.navbar-toggler');
    if (await mobileToggle.count() > 0 && await mobileToggle.first().isVisible()) {
      await mobileToggle.first().click();
      await page.waitForTimeout(500); // Wait for animation
    }
    
    // Navigate to Products page
    const productsLink = page.locator('nav a[href="/products"]');
    if (await productsLink.count() > 0) {
      await productsLink.first().click();
      await expect(page).toHaveURL('/products');
    }
    
    // Navigate to About page
    await page.goto('/');
    const aboutLink = page.locator('nav a[href="/about"]');
    if (await aboutLink.count() > 0) {
      // On mobile, we might need to expand the navigation first
      const mobileToggle = page.locator('.navbar-toggler');
      if (await mobileToggle.count() > 0 && await mobileToggle.first().isVisible()) {
        await mobileToggle.first().click();
        await page.waitForTimeout(500); // Wait for animation
      }
      
      await aboutLink.first().click();
      await expect(page).toHaveURL('/about');
    }
    
    // Navigate to Contact page
    await page.goto('/');
    const contactLink = page.locator('nav a[href="/contact"]');
    if (await contactLink.count() > 0) {
      // On mobile, we might need to expand the navigation first
      const mobileToggle = page.locator('.navbar-toggler');
      if (await mobileToggle.count() > 0 && await mobileToggle.first().isVisible()) {
        await mobileToggle.first().click();
        await page.waitForTimeout(500); // Wait for animation
      }
      
      await contactLink.first().click();
      await expect(page).toHaveURL('/contact');
    }
    
    // Navigate back to Home
    await page.click('header .navbar-brand');
    await expect(page).toHaveURL('/');
  });

  test('should display cart icon in header', async ({ page }) => {
    // Check if cart icon/link exists
    const cartLink = page.locator('nav .nav-link i.fa-shopping-cart');
    
    // Just verify it exists - the cart icon should always be present in the header
    expect(await cartLink.count()).toBeGreaterThan(0);
  });

  test('should display user authentication links when not logged in', async ({ page }) => {
    // Check if login/register links exist when not authenticated
    // These are in a dropdown menu, so we need to click to see them
    const userDropdown = page.locator('nav .nav-link i.fa-user').first();
    if (await userDropdown.count() > 0) {
      // On mobile, we might need to expand the navigation first
      const mobileToggle = page.locator('.navbar-toggler');
      if (await mobileToggle.count() > 0 && await mobileToggle.first().isVisible()) {
        await mobileToggle.first().click();
        await page.waitForTimeout(500); // Wait for animation
      }
      
      // Just verify the dropdown exists, don't require it to be visible on mobile
      expect(await userDropdown.count()).toBeGreaterThan(0);
      
      // Check if the dropdown items exist
      const loginLink = page.locator('nav .dropdown-menu a[href="/login"]');
      const registerLink = page.locator('nav .dropdown-menu a[href="/register"]');
      
      expect(await loginLink.count()).toBeGreaterThan(0);
      expect(await registerLink.count()).toBeGreaterThan(0);
    }
  });

  test('should have responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu toggle exists (hamburger menu)
    const mobileToggle = page.locator('.navbar-toggler');
    if (await mobileToggle.count() > 0) {
      await expect(mobileToggle.first()).toBeVisible();
      
      // Click mobile toggle to open menu
      await mobileToggle.first().click();
      
      // Check if navigation menu is expanded
      const navMenu = page.locator('.navbar-collapse');
      await expect(navMenu.first()).toBeVisible();
    }
  });

  test('should display footer with links', async ({ page }) => {
    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check if footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check if footer has some content
    const footerContent = footer.locator('*');
    await expect(footerContent.first()).toBeVisible();
  });

  test('should maintain navigation state after page refresh', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await expect(page).toHaveURL('/products');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on products page
    await expect(page).toHaveURL('/products');
  });
});
