describe('E-Commerce User Flow', () => {

  // Set a desktop viewport so navbar links are visible
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  // ──────────────────────────────────────────────
  // Test 1: Home page loads and can navigate to products
  // ──────────────────────────────────────────────
  it('should load home page and navigate to products', () => {
    // Stub API calls so the page renders without a real DB
    cy.intercept('GET', '/api/products/featured', []).as('featured');
    cy.intercept('GET', '/api/categories', []).as('categories');

    cy.visit('/');
    cy.contains('ShopSmart', { matchCase: false }).should('be.visible');

    // Stub product list for the products page
    cy.intercept('GET', '/api/products*', {
      products: [],
      page: 1,
      pages: 1,
      total: 0
    }).as('products');

    // Click the "Shop" link in the navbar
    cy.get('.navbar-nav a[href="/products"]').click();
    cy.url().should('include', '/products');
  });

  // ──────────────────────────────────────────────
  // Test 2: Login → Browse Products → Add to Cart → View Cart
  // ──────────────────────────────────────────────
  it('should login, browse products, add to cart, and view cart', () => {

    // ─── Mock login API to return a successful response ───
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        token: 'fake-jwt-token-for-testing'
      }
    }).as('loginRequest');

    // ─── Step 1: Go to Login page ───
    cy.visit('/login');
    cy.contains('Welcome Back').should('be.visible');

    // ─── Step 2: Fill in credentials and submit ───
    cy.get('#email').type('john@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the login API call
    cy.wait('@loginRequest');

    // ─── Step 3: Verify redirected to home after login ───
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    // Navbar should show Logout (user is authenticated)
    cy.contains('Logout').should('be.visible');

    // ─── Step 4: Mock products API and navigate to Shop ───
    const mockProducts = [
      {
        _id: 'prod1',
        name: 'Test Product',
        price: 999,
        originalPrice: 1499,
        image: 'https://via.placeholder.com/300',
        rating: 4.5,
        numReviews: 10,
        category: { _id: 'cat1', name: 'Electronics' }
      }
    ];

    cy.intercept('GET', '/api/products*', {
      products: mockProducts,
      page: 1,
      pages: 1,
      total: 1
    }).as('productList');

    cy.intercept('GET', '/api/categories', [
      { _id: 'cat1', name: 'Electronics', image: 'https://via.placeholder.com/100' }
    ]).as('categories');

    cy.get('.navbar-nav a[href="/products"]').click();
    cy.url().should('include', '/products');
    cy.wait('@productList');

    // ─── Step 5: Verify products are displayed ───
    cy.get('.product-card').should('have.length', 1);
    cy.contains('Test Product').should('be.visible');

    // ─── Step 6: Add the product to cart ───
    cy.intercept('POST', '/api/cart', {
      statusCode: 200,
      body: {
        items: [{
          _id: 'cartItem1',
          product: mockProducts[0],
          quantity: 1,
          price: 999
        }],
        totalAmount: 999
      }
    }).as('addToCart');

    cy.get('.product-card').first().within(() => {
      cy.get('button[title="Add to Cart"]').click({ force: true });
    });

    // ─── Step 7: Go to cart and verify item is there ───
    cy.intercept('GET', '/api/cart', {
      items: [{
        _id: 'cartItem1',
        product: mockProducts[0],
        quantity: 1,
        price: 999
      }],
      totalAmount: 999
    }).as('getCart');

    cy.get('a[href="/cart"]').first().click();
    cy.url().should('include', '/cart');
    cy.contains('Shopping Cart').should('be.visible');
    cy.get('.cart-item').should('have.length', 1);
    cy.contains('Test Product').should('be.visible');

    // ─── Step 8: Verify order summary and checkout button ───
    cy.contains('Order Summary').should('be.visible');
    cy.contains('Proceed to Checkout').should('be.visible');
  });

  // ──────────────────────────────────────────────
  // Test 3: Invalid login shows error message
  // ──────────────────────────────────────────────
  it('should show error on invalid login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid email or password' }
    }).as('failedLogin');

    cy.visit('/login');

    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLogin');

    // Should stay on login page and show error
    cy.url().should('include', '/login');
    cy.get('.alert-error').should('be.visible');
    cy.contains('Invalid email or password').should('be.visible');
  });

  // ──────────────────────────────────────────────
  // Test 4: Unauthenticated user is redirected from protected route
  // ──────────────────────────────────────────────
  it('should redirect to login when accessing orders without auth', () => {
    cy.visit('/orders');
    cy.url().should('include', '/login');
  });
});
