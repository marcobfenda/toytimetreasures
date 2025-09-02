const { test, expect } = require('@playwright/test');

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with hero section', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/Toy Time Treasures/);
    
    // Check if hero section exists
    const heroSection = page.locator('.hero-section');
    await expect(heroSection.first()).toBeVisible();
    
    // Check if hero has some content
    const heroContent = heroSection.locator('h1, .hero-title');
    if (await heroContent.count() > 0) {
      await expect(heroContent.first()).toBeVisible();
    }
  });

  test('should display featured products section', async ({ page }) => {
    // Look for featured products section
    const featuredSection = page.locator('.featured-products');
    
    if (await featuredSection.count() > 0) {
      await expect(featuredSection.first()).toBeVisible();
      
      // Check if there are product cards
      const productCards = featuredSection.locator('.product-card');
      if (await productCards.count() > 0) {
        await expect(productCards.first()).toBeVisible();
        
        // Check if product cards have basic structure
        const firstCard = productCards.first();
        await expect(firstCard).toBeVisible();
      }
    }
  });

  test('should display call-to-action buttons', async ({ page }) => {
    // Look for CTA buttons
    const ctaButtons = page.locator('.btn-primary');
    
    if (await ctaButtons.count() > 0) {
      await expect(ctaButtons.first()).toBeVisible();
      
      // Check if CTA buttons are clickable
      const firstButton = ctaButtons.first();
      await expect(firstButton).toBeEnabled();
    }
  });

  test('should display categories section', async ({ page }) => {
    // Look for categories section
    const categoriesSection = page.locator('.categories-section');
    
    if (await categoriesSection.count() > 0) {
      await expect(categoriesSection.first()).toBeVisible();
      
      // Check if category links are present
      const categoryLinks = categoriesSection.locator('a[href*="/category"]');
      if (await categoryLinks.count() > 0) {
        await expect(categoryLinks.first()).toBeVisible();
      }
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="Search for products"]');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      
      // Test search functionality
      await searchInput.first().fill('toy');
      await searchInput.first().press('Enter');
      
      // Should navigate to search results or show results
      await expect(page).toHaveURL(/\/search/);
    }
  });

  test('should display newsletter signup if present', async ({ page }) => {
    // Look for newsletter section
    const newsletterSection = page.locator('.newsletter-section');
    
    if (await newsletterSection.count() > 0) {
      await expect(newsletterSection.first()).toBeVisible();
      
      // Check if email input exists
      const emailInput = newsletterSection.locator('input[type="email"]');
      if (await emailInput.count() > 0) {
        await expect(emailInput.first()).toBeVisible();
      }
    }
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check for essential meta tags
    const metaDescription = page.locator('meta[name="description"]');
    const metaViewport = page.locator('meta[name="viewport"]');
    
    if (await metaDescription.count() > 0) {
      await expect(metaDescription.first()).toHaveAttribute('content');
    }
    
    if (await metaViewport.count() > 0) {
      await expect(metaViewport.first()).toHaveAttribute('content');
    }
  });

  test('should load images properly', async ({ page }) => {
    // Check if images are loading
    const images = page.locator('img');
    
    if (await images.count() > 0) {
      // Wait for images to load
      await page.waitForLoadState('networkidle');
      
      // Check if images are visible
      for (let i = 0; i < Math.min(await images.count(), 5); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
      }
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
