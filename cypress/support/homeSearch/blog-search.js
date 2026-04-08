/**
 * Comandos de alto nível da suíte “busca no header”.
 * Registrados aqui para o spec em e2e/blog-search.cy.js ficar só com describe/it + chamadas cy.*.
 */

Cypress.Commands.add('homeSearchDemografia', () => {
  const termo = 'Demografia';

  // Campo já exposto após openHeaderSearch() no beforeEach.
  cy.get('#ast-desktop-header #search-field')
  .clear()
  .type(`${termo}{enter}`);

  cy.url().should('include', 's=');
  cy.location('search').should('match', /Demografia/i);

  cy.get('h1.page-title.ast-archive-title')
    .should('be.visible')
    .and('contain', 'Resultados encontrados para:')
    .and('contain', termo);

  cy.get('main#main article.ast-article-post').should('have.length.at.least', 1);

  cy.get('main#main article.ast-article-post')
    .first()
    .within(() => {
      cy.get('.entry-title a').should('have.attr', 'href').and('match', /demografia/i);
      cy.get('.entry-title a').invoke('text').should('match', /demografia/i);
    });
});

Cypress.Commands.add('homeSearchPortalAbrePrimeiroResultado', () => {
  const termo = 'Portal';

  // delay entre teclas ajuda em buscas com autocomplete/latência perceptível no site.
  cy.get('#ast-desktop-header #search-field').clear().type(termo, { delay: 100 });
  cy.get('#ast-desktop-header #search-field').type('{enter}');

  cy.url().should('include', 's=');
  cy.location('search').should('match', /Portal/i);

  cy.get('h1.page-title.ast-archive-title').should('contain', termo);

  // Vários artigos com correspondência parcial (comportamento semelhante a LIKE no WordPress)
  cy.get('main#main article.ast-article-post').should('have.length.at.least', 2);

  cy.get('main#main article.ast-article-post .entry-title a')
    .first()
    .then(($a) => {
      const href = $a.attr('href');
      expect(href, 'href do primeiro card').to.be.a('string').and.not.be.empty;
      const titulo = $a.text().trim();
      // Trecho curto para assert no H1 sem depender do título inteiro (quebras de linha, etc.).
      const trecho = titulo.slice(0, Math.min(28, titulo.length));
      const pathname = new URL(href, Cypress.config('baseUrl')).pathname;

      // O clique no card pode flake em headless (elemento coberto/interceptado);
      // navegar direto pelo href mantém o objetivo do cenário: abrir o primeiro resultado.
      cy.visit(pathname);
      cy.location('pathname', { timeout: 20000 }).should('eq', pathname);
      cy.get('h1.entry-title').should('be.visible').and('contain', trecho);
      cy.get('h1.entry-title').invoke('text').should('match', /portal/i);
    });
});

