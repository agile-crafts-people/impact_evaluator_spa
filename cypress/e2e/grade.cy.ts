describe('Grade Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display grades list page', () => {
    cy.visit('/grades')
    cy.get('h1').contains('Grades').should('be.visible')
    cy.get('[data-automation-id="grade-list-new-button"]').should('be.visible')
  })

  it('should navigate to new grade page', () => {
    cy.visit('/grades')
    cy.get('[data-automation-id="grade-list-new-button"]').click()
    cy.url().should('include', '/grades/new')
    cy.get('h1').contains('New Grade').should('be.visible')
  })

  it('should create a new grade document', () => {
    cy.visit('/grades/new')
    
    const timestamp = Date.now()
    const itemName = `test-grade-${timestamp}`
    
    cy.get('[data-automation-id="grade-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="grade-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="grade-new-status-input"]').type('active')
    cy.get('[data-automation-id="grade-new-submit-button"]').click()
    
    // Should redirect to view page after creation
    cy.url().should('include', '/grades/')
    cy.url().should('not.include', '/grades/new')
    
    // Verify the grade name is displayed on view page (in a text field, not h1)
    cy.get('input[readonly]').first().should('have.value', itemName)
  })

  it('should search for grades', () => {
    // First create a grade with a unique name
    cy.visit('/grades/new')
    const timestamp = Date.now()
    const itemName = `search-test-grade-${timestamp}`
    
    cy.get('[data-automation-id="grade-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="grade-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="grade-new-status-input"]').type('active')
    cy.get('[data-automation-id="grade-new-submit-button"]').click()
    cy.url().should('include', '/grades/')
    
    // Navigate to list page
    cy.visit('/grades')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the grade
    cy.get('[data-automation-id="grade-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the grade
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all grades are shown again
    cy.get('[data-automation-id="grade-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
