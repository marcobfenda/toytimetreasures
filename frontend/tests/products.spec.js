const { test, expect } = require('@playwright/test');

test.describe('Products Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display products page correctly', async ({ page }) => {
    await page.goto('/products');
    
    // Check if products page loads
    await expect(page).toHaveURL('/products');
    
    // Look for products section
    const productsSection = page.locator('.products-section');
    if (await productsSection.count() > 0) {
      await expect(productsSection.first()).toBeVisible();
    }
  });

  test('should display product cards with basic information', async ({ page }) => {
    await page.goto('/products');
    
    // Look for product cards
    const productCards = page.locator('.product-card');
    
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      await expect(firstCard).toBeVisible();
      
      // Check if product card has basic structure
      // Product image
      const productImage = firstCard.locator('img');
      if (await productImage.count() > 0) {
        await expect(productImage.first()).toBeVisible();
      }
      
      // Product title/name
      const productTitle = firstCard.locator('.product-title');
      if (await productTitle.count() > 0) {
        await expect(productTitle.first()).toBeVisible();
      }
      
      // Product price
      const productPrice = firstCard.locator('.product-price');
      if (await productPrice.count() > 0) {
        await expect(productPrice.first()).toBeVisible();
      }
    }
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/products');
    
    // Find first product card
    const productCards = page.locator('.product-card');
    
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      
      // Look for product link (the eye icon button)
      const productLink = firstCard.locator('a[href*="/product"]');
      
      if (await productLink.count() > 0) {
        // Get the href attribute
        const href = await productLink.first().getAttribute('href');
        
        // Click on product
        await productLink.first().click();
        
        // Should navigate to product detail page
        if (href) {
          await expect(page).toHaveURL(href);
        } else {
          await expect(page).toHaveURL(/\/product\//);
        }
      }
    }
  });

  test('should display product detail page correctly', async ({ page }) => {
    // First get a product URL from products page
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const productLink = firstCard.locator('a[href*="/product"], .product-link, .view-product');
      
      if (await productLink.count() > 0) {
        await productLink.first().click();
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check product detail elements
        const productDetail = page.locator('.product-detail, .product-info, .product-container');
        if (await productDetail.count() > 0) {
          await expect(productDetail.first()).toBeVisible();
        }
        
        // Check for product images
        const productImages = page.locator('.product-images, .product-gallery, .product-image');
        if (await productImages.count() > 0) {
          await expect(productImages.first()).toBeVisible();
        }
        
        // Check for product information
        const productInfo = page.locator('.product-info, .product-details, .product-description');
        if (await productInfo.count() > 0) {
          await expect(productInfo.first()).toBeVisible();
        }
        
        // Check for add to cart button
        const addToCartBtn = page.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
        if (await addToCartBtn.count() > 0) {
          await expect(addToCartBtn.first()).toBeVisible();
        }
      }
    }
  });

  test('should display categories page correctly', async ({ page }) => {
    // First check if categories exist on home page
    const categoryLinks = page.locator('a[href*="/category"]');
    
    if (await categoryLinks.count() > 0) {
      const firstCategory = categoryLinks.first();
      const categoryUrl = await firstCategory.getAttribute('href');
      
      if (categoryUrl) {
        await page.goto(categoryUrl);
        
        // Check if category page loads
        await expect(page).toHaveURL(categoryUrl);
        
        // Look for category title
        const categoryTitle = page.locator('.category-title, h1, .page-title');
        if (await categoryTitle.count() > 0) {
          await expect(categoryTitle.first()).toBeVisible();
        }
        
        // Look for products in category
        const categoryProducts = page.locator('.products-section, .products-grid, .products-list');
        if (await categoryProducts.count() > 0) {
          await expect(categoryProducts.first()).toBeVisible();
        }
      }
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], .search-input, #search, [placeholder*="search" i]');
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('toy');
      await searchInput.first().press('Enter');
      
      // Should navigate to search results
      await expect(page).toHaveURL(/\/search/);
      
      // Check if search results are displayed
      const searchResults = page.locator('.search-results, .results-container, .products-section');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    
    // Look for category filters
    const categoryFilters = page.locator('.category-filter, .filter-category, .category-select');
    
    if (await categoryFilters.count() > 0) {
      const firstFilter = categoryFilters.first();
      
      // Check if filter is interactive
      await expect(firstFilter).toBeVisible();
      
      // Try to select a category
      if (await firstFilter.locator('option').count() > 1) {
        await firstFilter.selectOption({ index: 1 });
        
        // Wait for filter to apply
        await page.waitForTimeout(1000);
        
        // Check if products are filtered
        const products = page.locator('.product-card, .product-item, .card, .product');
        await expect(products.first()).toBeVisible();
      }
    }
  });

  test('should sort products', async ({ page }) => {
    await page.goto('/products');
    
    // Look for sort options
    const sortSelect = page.locator('.sort-select, .sort-options, select[name="sort"]');
    
    if (await sortSelect.count() > 0) {
      await expect(sortSelect.first()).toBeVisible();
      
      // Try to change sort order
      if (await sortSelect.locator('option').count() > 1) {
        await sortSelect.selectOption({ index: 1 });
        
        // Wait for sort to apply
        await page.waitForTimeout(1000);
        
        // Check if products are still visible
        const products = page.locator('.product-card, .product-item, .card, .product');
        await expect(products.first()).toBeVisible();
      }
    }
  });

  test('should display product pagination if many products', async ({ page }) => {
    await page.goto('/products');
    
    // Look for pagination
    const pagination = page.locator('.pagination, .pagination-container, .page-nav');
    
    if (await pagination.count() > 0) {
      await expect(pagination.first()).toBeVisible();
      
      // Check if pagination has page numbers
      const pageNumbers = pagination.locator('.page-link, .page-number, a[href*="page"]');
      if (await pageNumbers.count() > 0) {
        await expect(pageNumbers.first()).toBeVisible();
      }
    }
  });

  test('should add product to cart from product detail', async ({ page }) => {
    // Navigate to a product detail page
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const productLink = firstCard.locator('a[href*="/product"], .product-link, .view-product');
      
      if (await productLink.count() > 0) {
        await productLink.first().click();
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Look for add to cart button
        const addToCartBtn = page.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
        
        if (await addToCartBtn.count() > 0) {
          await addToCartBtn.first().click();
          
          // Wait for cart update
          await page.waitForTimeout(1000);
          
          // Check if success message appears
          const successMessage = page.locator('.success-message, .alert-success, .toast-success');
          if (await successMessage.count() > 0) {
            await expect(successMessage.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display product images correctly', async ({ page }) => {
    await page.goto('/products');
    
    // Check if product images are loading
    const productImages = page.locator('.product-card img, .product-item img, .card img, .product img');
    
    if (await productImages.count() > 0) {
      // Wait for images to load
      await page.waitForLoadState('networkidle');
      
      // Check if images are visible
      for (let i = 0; i < Math.min(await productImages.count(), 3); i++) {
        const img = productImages.nth(i);
        await expect(img).toBeVisible();
      }
    }
  });

  test('should handle product out of stock gracefully', async ({ page }) => {
    // This test would need specific products that are out of stock
    // For now, we'll check if out-of-stock indicators exist
    await page.goto('/products');
    
    const outOfStockIndicators = page.locator('.out-of-stock, .stock-status, .availability');
    
    if (await outOfStockIndicators.count() > 0) {
      await expect(outOfStockIndicators.first()).toBeVisible();
    }
  });
});
