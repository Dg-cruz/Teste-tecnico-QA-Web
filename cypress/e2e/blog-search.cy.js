/**
 * Cenários de automação — busca no Blog do Agi
 * Ponto de entrada usado no desafio: /colunas/ (lupa no header).
 * O domínio https://blogdoagi.com.br/ redireciona para blog.agibank.com.br (canonical do blog).
 */
describe('Blog do Agi — busca no header', () => {
  beforeEach(() => {
    cy.openHeaderSearchFromColunas();
  });

  it('Cenário 1: pesquisar "Demografia" e validar URL, listagem e card coerente', () => {
    const termo = 'Demografia';
    cy.get('#ast-desktop-header #search-field').clear().type(`${termo}{enter}`);

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
        cy.get('.entry-title a')
          .should('have.attr', 'href')
          .and('match', /demografia/i);
        cy.get('.entry-title a').invoke('text').should('match', /demografia/i);
      });
  });

  it('Cenário 2: busca parcial tipo "Portal", lista de resultados e abertura do primeiro card', () => {
    const termo = 'Portal';
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
        const trecho = titulo.slice(0, Math.min(28, titulo.length));
        const pathname = new URL(href, Cypress.config('baseUrl')).pathname;

        cy.wrap($a).click();
        cy.url().should('include', pathname);
        cy.get('h1.entry-title').should('be.visible').and('contain', trecho);
        cy.get('h1.entry-title').invoke('text').should('match', /portal/i);
      });
  });
});
