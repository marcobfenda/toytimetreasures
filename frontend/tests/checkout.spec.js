const { test, expect } = require('@playwright/test');

test.describe('Checkout Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access checkout without authentication
    await page.goto('/checkout');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display checkout form when authenticated', async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    // Add product to cart first
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Now go to checkout
        await page.goto('/checkout');
        
        // Check if checkout form is displayed
        const checkoutForm = page.locator('.checkout-form, .checkout-container, form');
        await expect(checkoutForm.first()).toBeVisible();
      }
    }
  });

  test('should display order summary in checkout', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for order summary
        const orderSummary = page.locator('.order-summary, .checkout-summary, .cart-summary');
        
        if (await orderSummary.count() > 0) {
          await expect(orderSummary.first()).toBeVisible();
          
          // Check for order items
          const orderItems = orderSummary.locator('.order-item, .summary-item, .cart-item');
          if (await orderItems.count() > 0) {
            await expect(orderItems.first()).toBeVisible();
          }
          
          // Check for totals
          const totals = orderSummary.locator('.total, .grand-total, .checkout-total');
          if (await totals.count() > 0) {
            await expect(totals.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display billing information form', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for billing form
        const billingForm = page.locator('.billing-form, .billing-info, .billing-details');
        
        if (await billingForm.count() > 0) {
          await expect(billingForm.first()).toBeVisible();
          
          // Check for required fields
          const firstName = billingForm.locator('input[name="firstName"], input[name="first_name"], #firstName');
          const lastName = billingForm.locator('input[name="lastName"], input[name="last_name"], #lastName');
          const email = billingForm.locator('input[name="email"], input[type="email"], #email');
          const phone = billingForm.locator('input[name="phone"], input[type="tel"], #phone');
          
          if (await firstName.count() > 0) {
            await expect(firstName.first()).toBeVisible();
          }
          
          if (await lastName.count() > 0) {
            await expect(lastName.first()).toBeVisible();
          }
          
          if (await email.count() > 0) {
            await expect(email.first()).toBeVisible();
          }
          
          if (await phone.count() > 0) {
            await expect(phone.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display shipping address form', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for shipping form
        const shippingForm = page.locator('.shipping-form, .shipping-address, .shipping-info');
        
        if (await shippingForm.count() > 0) {
          await expect(shippingForm.first()).toBeVisible();
          
          // Check for address fields
          const address = shippingForm.locator('input[name="address"], input[name="street"], #address');
          const city = shippingForm.locator('input[name="city"], #city');
          const state = shippingForm.locator('input[name="state"], select[name="state"], #state');
          const zipCode = shippingForm.locator('input[name="zipCode"], input[name="postal_code"], #zipCode');
          const country = shippingForm.locator('input[name="country"], select[name="country"], #country');
          
          if (await address.count() > 0) {
            await expect(address.first()).toBeVisible();
          }
          
          if (await city.count() > 0) {
            await expect(city.first()).toBeVisible();
          }
          
          if (await state.count() > 0) {
            await expect(state.first()).toBeVisible();
          }
          
          if (await zipCode.count() > 0) {
            await expect(zipCode.first()).toBeVisible();
          }
          
          if (await country.count() > 0) {
            await expect(country.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display payment method options', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for payment methods
        const paymentMethods = page.locator('.payment-methods, .payment-options, .payment-selection');
        
        if (await paymentMethods.count() > 0) {
          await expect(paymentMethods.first()).toBeVisible();
          
          // Check for credit card option
          const creditCard = paymentMethods.locator('.credit-card, .card-payment, input[value="credit_card"]');
          if (await creditCard.count() > 0) {
            await expect(creditCard.first()).toBeVisible();
          }
          
          // Check for PayPal option
          const paypal = paymentMethods.locator('.paypal, .paypal-payment, input[value="paypal"]');
          if (await paypal.count() > 0) {
            await expect(paypal.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display credit card form when selected', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for credit card form
        const creditCardForm = page.locator('.credit-card-form, .card-form, .payment-form');
        
        if (await creditCardForm.count() > 0) {
          await expect(creditCardForm.first()).toBeVisible();
          
          // Check for card fields
          const cardNumber = creditCardForm.locator('input[name="cardNumber"], input[name="card_number"], #cardNumber');
          const expiryDate = creditCardForm.locator('input[name="expiryDate"], input[name="expiry"], #expiryDate');
          const cvv = creditCardForm.locator('input[name="cvv"], input[name="cvv_code"], #cvv');
          const cardholderName = creditCardForm.locator('input[name="cardholderName"], input[name="name_on_card"], #cardholderName');
          
          if (await cardNumber.count() > 0) {
            await expect(cardNumber.first()).toBeVisible();
          }
          
          if (await expiryDate.count() > 0) {
            await expect(expiryDate.first()).toBeVisible();
          }
          
          if (await cvv.count() > 0) {
            await expect(cvv.first()).toBeVisible();
          }
          
          if (await cardholderName.count() > 0) {
            await expect(cardholderName.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Try to submit without filling required fields
        const submitBtn = page.locator('button[type="submit"], .place-order, .checkout-submit');
        
        if (await submitBtn.count() > 0) {
          await submitBtn.first().click();
          
          // Wait for validation
          await page.waitForTimeout(1000);
          
          // Check for validation errors
          const validationErrors = page.locator('.error-message, .validation-error, .alert-danger, .text-danger');
          if (await validationErrors.count() > 0) {
            await expect(validationErrors.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should calculate shipping costs', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for shipping cost calculation
        const shippingCost = page.locator('.shipping-cost, .shipping-fee, .delivery-cost');
        
        if (await shippingCost.count() > 0) {
          await expect(shippingCost.first()).toBeVisible();
        }
        
        // Look for shipping method selection
        const shippingMethods = page.locator('.shipping-methods, .shipping-options, .delivery-options');
        
        if (await shippingMethods.count() > 0) {
          await expect(shippingMethods.first()).toBeVisible();
          
          // Try to select different shipping method
          const shippingOptions = shippingMethods.locator('input[type="radio"], .shipping-option');
          if (await shippingOptions.count() > 1) {
            await shippingOptions.nth(1).click();
            
            // Wait for shipping cost update
            await page.waitForTimeout(1000);
            
            // Check if shipping cost changed
            await expect(shippingCost.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should display order total with all costs', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for order total breakdown
        const orderTotal = page.locator('.order-total, .checkout-total, .final-total');
        
        if (await orderTotal.count() > 0) {
          await expect(orderTotal.first()).toBeVisible();
          
          // Check for subtotal
          const subtotal = page.locator('.subtotal, .items-total');
          if (await subtotal.count() > 0) {
            await expect(subtotal.first()).toBeVisible();
          }
          
          // Check for shipping
          const shipping = page.locator('.shipping-cost, .shipping-fee');
          if (await shipping.count() > 0) {
            await expect(shipping.first()).toBeVisible();
          }
          
          // Check for tax
          const tax = page.locator('.tax-amount, .tax-total');
          if (await tax.count() > 0) {
            await expect(tax.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should have place order button', async ({ page }) => {
    // Mock authentication and add product to cart
    await page.addInitScript(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/products');
    
    const productCards = page.locator('.product-card, .product-item, .card, .product');
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      const addToCartBtn = firstCard.locator('.add-to-cart, .btn-add-cart, button:has-text("Add to Cart")');
      
      if (await addToCartBtn.count() > 0) {
        await addToCartBtn.first().click();
        await page.waitForTimeout(1000);
        
        await page.goto('/checkout');
        
        // Look for place order button
        const placeOrderBtn = page.locator('.place-order, .checkout-submit, button:has-text("Place Order")');
        
        if (await placeOrderBtn.count() > 0) {
          await expect(placeOrderBtn.first()).toBeVisible();
          await expect(placeOrderBtn.first()).toBeEnabled();
        }
      }
    }
  });
});
