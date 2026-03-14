describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('TESTRUN DOMAIN').should('be.exist')
    cy.contains('TESTDATA DOMAIN').should('be.exist')
    cy.contains('GRADE DOMAIN').should('be.exist')
    cy.contains('PROFILE DOMAIN').should('be.exist')
  })
  it('should have all testrun domain links in drawer', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-testruns-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-testruns-new-link"]').should('be.visible')
  })
  it('should have all testdata domain links in drawer', () => {
    cy.visit('/testdatas')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-testdatas-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-testdatas-new-link"]').should('be.visible')
  })
  it('should have all grade domain links in drawer', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-grades-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-grades-new-link"]').should('be.visible')
  })
  it('should have profile domain link in drawer', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-profiles-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-grades-list-link"]').click()
    cy.url().should('include', '/grades')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-grades-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('TESTRUN DOMAIN').should('not.be.visible')
  })
})