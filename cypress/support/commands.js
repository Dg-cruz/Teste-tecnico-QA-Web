/**
 * Abre a busca do header (desktop) a partir da página de Colunas.
 * O tema Astra usa âncora href="#", o que altera o hash e pode impedir o painel de abrir no Cypress;
 * removemos o href só para o clique de teste.
 */
Cypress.Commands.add('openHeaderSearchFromColunas', () => {
  cy.visit('/colunas/');
  cy.get('#ast-desktop-header a.slide-search.astra-search-icon')
    .invoke('removeAttr', 'href')
    .click();
  cy.get('#ast-desktop-header .ast-search-menu-icon.ast-dropdown-active', { timeout: 10000 }).should(
    'exist',
  );
  cy.get('#ast-desktop-header #search-field').should('be.visible');
});
