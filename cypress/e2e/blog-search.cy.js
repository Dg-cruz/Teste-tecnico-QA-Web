
describe('Blog do Agi — busca no header', () => {

  beforeEach(() => {
    cy.viewport(1920, 1080) // desktop padrão
    cy.visitHomeClean()
    cy.openHeaderSearch()
  })

  it('Cenário 1: pesquisar "Demografia" e validar URL, listagem e card coerente', () => {
    const termo = 'Demografia'

    // Nota: homeSearchDemografia() hoje não recebe argumentos; o termo no spec documenta a intenção do cenário.
    cy.homeSearchDemografia(termo)
    
  })

  it('Cenário 2: busca parcial tipo "Portal", lista de resultados e abertura do primeiro card', () => {
    const termo = 'Portal'

    // Idem: comando interno usa "Portal" fixo; asserção extra abaixo reforça o título do post aberto.
    cy.homeSearchPortalAbrePrimeiroResultado(termo)
    
    cy.get('h1.entry-title')
      .invoke('text')
      .should('match', /portal/i)
  })
})