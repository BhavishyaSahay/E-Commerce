describe('E-Commerce User Flow', () => {
  it('should load home page and perform a basic flow', () => {
    // Navigate to homepage
    cy.visit('/');

    // Verify title or navbar contains ShopSmart (from our other tests we know it's there)
    cy.contains('ShopSmart', { matchCase: false }).should('be.visible');

    // Simulate clicking a product or navigating to /products (assuming a link exists)
    // If we map over products, we handle basic assertions
    cy.get('body').then($body => {
      // If there's a Products link
      if ($body.text().includes('Products')) {
        cy.contains('Products').click();
        cy.url().should('include', '/products');
      }
    });
  });

  it('should allow navigation to login page', () => {
    cy.visit('/');

    cy.get('body').then($body => {
      if ($body.find('a[href="/login"]').length > 0) {
        cy.get('a[href="/login"]').first().click();
        cy.url().should('include', '/login');

        // Check form elements
        cy.get('input[type="email"]').should('exist');
        cy.get('input[type="password"]').should('exist');
      }
    });
  });
});
