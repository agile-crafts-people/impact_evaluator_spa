describe('TestRun Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display testruns list page', () => {
    cy.visit('/testruns')
    cy.get('h1').contains('TestRuns').should('be.visible')
    cy.get('[data-automation-id="testrun-list-new-button"]').should('be.visible')
  })

  it('should navigate to new testrun page', () => {
    cy.visit('/testruns')
    cy.get('[data-automation-id="testrun-list-new-button"]').click()
    cy.url().should('include', '/testruns/new')
    cy.get('h1').contains('New TestRun').should('be.visible')
  })

  it('should create a new testrun', () => {
    cy.visit('/testruns/new')
    
    const timestamp = Date.now()
    const itemName = `test-testrun-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="testrun-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testrun-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="testrun-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/testruns/')
    cy.url().should('not.include', '/testruns/new')
    
    // Verify the testrun name is displayed on edit page
    cy.get('[data-automation-id="testrun-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a testrun', () => {
    // First create a testrun
    cy.visit('/testruns/new')
    const timestamp = Date.now()
    const itemName = `test-testrun-update-${timestamp}`
    const updatedName = `updated-testrun-${timestamp}`
    
    cy.get('[data-automation-id="testrun-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testrun-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="testrun-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/testruns/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="testrun-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="testrun-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="testrun-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="testrun-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="testrun-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="testrun-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the testrun appears with updated name
    cy.get('[data-automation-id="testrun-edit-back-button"]').click()
    cy.url().should('include', '/testruns')
    
    // Search for the updated testrun
    cy.get('[data-automation-id="testrun-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the testrun appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all testruns are shown again
    cy.get('[data-automation-id="testrun-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for testruns', () => {
    // First create a testrun with a unique name
    cy.visit('/testruns/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="testrun-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testrun-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="testrun-new-submit-button"]').click()
    cy.url().should('include', '/testruns/')
    
    // Navigate to list page
    cy.visit('/testruns')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the testrun
    cy.get('[data-automation-id="testrun-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the testrun
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all testruns are shown again
    cy.get('[data-automation-id="testrun-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
