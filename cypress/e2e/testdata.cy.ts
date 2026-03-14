describe('TestData Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display testdatas list page', () => {
    cy.visit('/testdatas')
    cy.get('h1').contains('TestDatas').should('be.visible')
    cy.get('[data-automation-id="testdata-list-new-button"]').should('be.visible')
  })

  it('should navigate to new testdata page', () => {
    cy.visit('/testdatas')
    cy.get('[data-automation-id="testdata-list-new-button"]').click()
    cy.url().should('include', '/testdatas/new')
    cy.get('h1').contains('New TestData').should('be.visible')
  })

  it('should create a new testdata', () => {
    cy.visit('/testdatas/new')
    
    const timestamp = Date.now()
    const itemName = `test-testdata-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="testdata-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testdata-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="testdata-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/testdatas/')
    cy.url().should('not.include', '/testdatas/new')
    
    // Verify the testdata name is displayed on edit page
    cy.get('[data-automation-id="testdata-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a testdata', () => {
    // First create a testdata
    cy.visit('/testdatas/new')
    const timestamp = Date.now()
    const itemName = `test-testdata-update-${timestamp}`
    const updatedName = `updated-testdata-${timestamp}`
    
    cy.get('[data-automation-id="testdata-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testdata-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="testdata-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/testdatas/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="testdata-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="testdata-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="testdata-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="testdata-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="testdata-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="testdata-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the testdata appears with updated name
    cy.get('[data-automation-id="testdata-edit-back-button"]').click()
    cy.url().should('include', '/testdatas')
    
    // Search for the updated testdata
    cy.get('[data-automation-id="testdata-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the testdata appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all testdatas are shown again
    cy.get('[data-automation-id="testdata-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for testdatas', () => {
    // First create a testdata with a unique name
    cy.visit('/testdatas/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="testdata-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="testdata-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="testdata-new-submit-button"]').click()
    cy.url().should('include', '/testdatas/')
    
    // Navigate to list page
    cy.visit('/testdatas')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the testdata
    cy.get('[data-automation-id="testdata-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the testdata
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all testdatas are shown again
    cy.get('[data-automation-id="testdata-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
