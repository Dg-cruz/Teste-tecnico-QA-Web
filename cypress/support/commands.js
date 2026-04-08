Cypress.Commands.add('visitHomeClean', () => {
  cy.clearAllCookies()
  cy.clearAllLocalStorage()

  function visitWithCheck(retry = 0) {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Service worker pode servir cache antigo; desregistrar reduz diferença runner vs browser manual.
        if (win.navigator.serviceWorker) {
          win.navigator.serviceWorker.getRegistrations()
            .then(regs => regs.forEach(r => r.unregister()))
        }
      }
    })

    // garante que o DOM terminou
    cy.document().its('readyState').should('eq', 'complete')

    // valida que o header NÃO está quebrado (CSS aplicado)
    cy.get('#ast-desktop-header', { timeout: 3000 })
      .should('be.visible')
      .then(($el) => {
        const height = $el.height()

        // 🔴 se o CSS não carregou, altura costuma ser 0 ou muito pequena
        if ((!height || height < 50) && retry < 2) {
          cy.log('🔁 Layout possivelmente quebrado, recarregando...')
          visitWithCheck(retry + 1)
        }
      })
  }

  visitWithCheck()
})


Cypress.Commands.add('openHeaderSearch', () => {

  cy.window().then((win) => {
    expect(win.document.readyState).to.equal('complete')
  })

  cy.get('#ast-desktop-header .ast-search-icon', { timeout: 20000 })
    .should('be.visible')
    .and('not.be.disabled')

  cy.get('#ast-desktop-header a.slide-search.astra-search-icon')
    .scrollIntoView()
    .then(($el) => {
      if ($el.attr('href') === '#') {
        $el.removeAttr('href')
      }
    })
    .click({ force: true })

  cy.get('#ast-desktop-header .ast-search-icon')
    .scrollIntoView()
    .click({ force: true })

  cy.get('#ast-desktop-header .ast-search-icon', { timeout: 20000 })
    .should('be.visible')
    .and('not.be.disabled')
})


Cypress.Commands.add('openHeaderSearchFromColunas', () => {
  cy.visit('/colunas/')
  cy.document({ timeout: 60000 }).its('readyState').should('eq', 'complete')
  cy.openHeaderSearch()
})