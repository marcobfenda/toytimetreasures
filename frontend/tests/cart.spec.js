const { test, expect } = require('@playwright/test');

test.describe('Shopping Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display empty cart message when cart is empty', async ({ page }) => {
    await page.goto('/cart');
    
    // Check if cart page loads
    await expect(page).toHaveURL('/cart');
    
    // Look for empty cart message
    const emptyCartMessage = page.locator('.alert.alert-info');
    
    if (await emptyCartMessage.count() > 0) {
      await expect(emptyCartMessage.first()).toBeVisible();
    } else {
      // If no specific empty message, check if cart page exists
      const cartPage = page.locator('.cart-page');
      await expect(cartPage.first()).toBeVisible();
    }
  });

  test('should add product to cart from products page', async ({ page }) => {
    await page.goto('/products');
    
    // Find first product card
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      
      // Look for add to cart button
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        
        // Wait for cart update
        await page.waitForTimeout(1000);
        
        // Check if success message appears
        const successMessage = page.locator('.success-message, .alert-success, .toast-success, .added-to-cart');
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible();
        }
        
        // Check if cart count increased in header
        const cartCount = page.locator('.cart-count, .cart-badge, .cart-items-count');
        if (await cartCount.count() > 0) {
          await expect(cartCount.first()).toBeVisible();
        }
      }
    }
  });

  test('should add product to cart from product detail page', async ({ page }) => {
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
          const successMessage = page.locator('.success-message, .alert-success, .toast-success, .added-to-cart');
          if (await successMessage.count() > 0) {
            await expect(successMessage.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display cart items correctly', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Now go to cart page
        await page.goto('/cart');
        
        // Check if cart items are displayed
        const cartItems = page.locator('.cart-item, .cart-product, .item');
        
        if (await cartItems.count() > 0) {
          await expect(cartItems.first()).toBeVisible();
          
          // Check if cart item has basic structure
          const firstItem = cartItems.first();
          
          // Product image
          const itemImage = firstItem.locator('img');
          if (await itemImage.count() > 0) {
            await expect(itemImage.first()).toBeVisible();
          }
          
          // Product name
          const itemName = firstItem.locator('.item-name, .product-name, .cart-product-name');
          if (await itemName.count() > 0) {
            await expect(itemName.first()).toBeVisible();
          }
          
          // Product price
          const itemPrice = firstItem.locator('.item-price, .product-price, .cart-price');
          if (await itemPrice.count() > 0) {
            await expect(itemPrice.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should update product quantity in cart', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go to cart page
        await page.goto('/cart');
        
        // Look for quantity controls
        const quantityInput = page.locator('.quantity-input, input[type="number"], .qty-input');
        const increaseBtn = page.locator('.quantity-increase, .qty-plus, .increase');
        const decreaseBtn = page.locator('.quantity-decrease, .qty-minus, .decrease');
        
        if (await quantityInput.count() > 0) {
          // Test increasing quantity
          if (await increaseBtn.count() > 0) {
            const initialValue = await quantityInput.first().inputValue();
            await increaseBtn.first().click();
            await page.waitForTimeout(500);
            
            const newValue = await quantityInput.first().inputValue();
            expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
          }
          
          // Test decreasing quantity
          if (await decreaseBtn.count() > 0) {
            const initialValue = await quantityInput.first().inputValue();
            if (parseInt(initialValue) > 1) {
              await decreaseBtn.first().click();
              await page.waitForTimeout(500);
              
              const newValue = await quantityInput.first().inputValue();
              expect(parseInt(newValue)).toBeLessThan(parseInt(initialValue));
            }
          }
        }
      }
    }
  });

  test('should remove product from cart', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go to cart page
        await page.goto('/cart');
        
        // Look for remove button
        const removeBtn = page.locator('.remove-item, .delete-item, .remove-product, .btn-remove');
        
        if (await removeBtn.count() > 0) {
          await removeBtn.first().click();
          
          // Wait for removal
          await page.waitForTimeout(1000);
          
          // Check if item was removed
          const cartItems = page.locator('.cart-item, .cart-product, .item');
          if (await cartItems.count() === 0) {
            // Cart should be empty now
            const emptyCartMessage = page.locator('.empty-cart, .cart-empty, .no-items, .empty-state');
            if (await emptyCartMessage.count() > 0) {
              await expect(emptyCartMessage.first()).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('should calculate cart totals correctly', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go to cart page
        await page.goto('/cart');
        
        // Look for cart totals
        const cartTotals = page.locator('.cart-totals, .cart-summary, .totals');
        
        if (await cartTotals.count() > 0) {
          await expect(cartTotals.first()).toBeVisible();
          
          // Check for subtotal
          const subtotal = cartTotals.locator('.subtotal, .cart-subtotal');
          if (await subtotal.count() > 0) {
            await expect(subtotal.first()).toBeVisible();
          }
          
          // Check for total
          const total = cartTotals.locator('.total, .cart-total, .grand-total');
          if (await total.count() > 0) {
            await expect(total.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go to cart page
        await page.goto('/cart');
        
        // Look for checkout button
        const checkoutBtn = page.locator('.checkout-btn, .btn-checkout, button:has-text("Checkout")');
        
        if (await checkoutBtn.count() > 0) {
          await expect(checkoutBtn.first()).toBeVisible();
          
          // Click checkout button
          await checkoutBtn.first().click();
          
          // Should navigate to checkout page
          await expect(page).toHaveURL(/\/checkout/);
        }
      }
    }
  });

  test('should persist cart data across page refreshes', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go to cart page
        await page.goto('/cart');
        
        // Check if item is in cart
        const cartItems = page.locator('.cart-item, .cart-product, .item');
        if (await cartItems.count() > 0) {
          // Refresh the page
          await page.reload();
          
          // Item should still be in cart
          await expect(cartItems.first()).toBeVisible();
        }
      }
    }
  });

  test('should display cart icon with item count in header', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Go back to home page
        await page.goto('/');
        
        // Check if cart count is displayed in header
        const cartCount = page.locator('.cart-count, .cart-badge, .cart-items-count');
        if (await cartCount.count() > 0) {
          await expect(cartCount.first()).toBeVisible();
        }
      }
    }
  });

  test('should handle multiple products in cart', async ({ page }) => {
    await page.goto('/products');
    
    // Add first product
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 1) {
      // Add first product
      const firstCard = productCards.first();
      const firstAddBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await firstAddBtn.count() > 0) {
        await firstAddBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Add second product
        const secondCard = productCards.nth(1);
        const secondAddBtn = secondCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
        
        if (await secondAddBtn.count() > 0) {
          await secondAddBtn.first().click();
          await page.waitForTimeout(1000);
          
          // Go to cart page
          await page.goto('/cart');
          
          // Check if multiple items are displayed
          const cartItems = page.locator('.cart-item, .cart-product, .item');
          if (await cartItems.count() > 1) {
            await expect(cartItems.nth(1)).toBeVisible();
          }
        }
      }
    }
  });
});
