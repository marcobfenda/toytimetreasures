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
    await expect(page.locator('nav a[href="/products"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contact"]')).toBeVisible();
  });

  test('should navigate to different pages from header', async ({ page }) => {
    // Navigate to Products page
    await page.click('nav a[href="/products"]');
    await expect(page).toHaveURL('/products');
    
    // Navigate to About page
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    
    // Navigate to Contact page
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    
    // Navigate back to Home
    await page.click('header .navbar-brand');
    await expect(page).toHaveURL('/');
  });

  test('should display cart icon in header', async ({ page }) => {
    // Check if cart icon/link is visible
    const cartLink = page.locator('nav .nav-link i.fa-shopping-cart');
    await expect(cartLink.first()).toBeVisible();
  });

  test('should display user authentication links when not logged in', async ({ page }) => {
    // Check if login/register links are visible when not authenticated
    // These are in a dropdown menu, so we need to click to see them
    const userDropdown = page.locator('nav .nav-link i.fa-user').first();
    await expect(userDropdown).toBeVisible();
    
    // Click the dropdown to open it
    await userDropdown.click();
    
    // Now check if the dropdown items are visible
    await expect(page.locator('nav .dropdown-menu a[href="/login"]')).toBeVisible();
    await expect(page.locator('nav .dropdown-menu a[href="/register"]')).toBeVisible();
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
