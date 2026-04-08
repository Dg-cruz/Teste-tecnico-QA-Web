# Automação E2E — Busca no Blog do Agi

Testes de interface com [Cypress](https://www.cypress.io/) cobrindo a **busca do blog** (ícone de lupa no header), a partir da página de [Colunas](https://blog.agibank.com.br/colunas/), conforme o desafio técnico.

O endereço [https://blogdoagi.com.br/](https://blogdoagi.com.br/) aponta para o mesmo blog (domínio canônico em produção: `blog.agibank.com.br`).

## Pré-requisitos

- [Node.js](https://nodejs.org/) **18 ou superior** (LTS recomendado)
- npm (incluso no Node)

Compatível com desenvolvimento em **Windows, macOS e Linux**.

## Instalação

```bash
git clone <url-do-repositório>
cd <pasta-do-projeto>
npm ci
```

> Em ambiente novo, use `npm install` se ainda não existir `package-lock.json`.

## Executar os testes

**Modo headless (CI / terminal):**

```bash
npm test
```

**Modo interativo (depuração):**

```bash
npm run cypress:open
```

Escolha **E2E Testing** e o spec `blog-search.cy.js`.

### URL base

O `baseUrl` padrão está em `cypress.config.js` (`https://blog.agibank.com.br`). Para sobrescrever:

```bash
npx cypress run --config baseUrl=https://blog.agibank.com.br
```

## Cenários automatizados

| # | Descrição |
|---|-----------|
| **1** | Pesquisar **Demografia**, validar parâmetro `s` na URL, título da página de resultados, presença de **cards** (`article.ast-article-post`) e coerência do **primeiro card** (título e slug com o termo). |
| **2** | Pesquisa parcial **Portal** (digitação com pequeno atraso entre teclas), submissão com **Enter**, validação da URL e de **múltiplos resultados** (comportamento análogo a correspondência parcial), **clique no primeiro resultado** e validação do **artigo** (URL, `h1` alinhado ao card e menção a “Portal”). |

### Observação sobre sugestões em tempo real

Na versão atual do site, a busca é a **pesquisa padrão do WordPress** (formulário `?s=`), **sem lista AJAX** abaixo do campo enquanto se digita. O cenário **2** cobre o fluxo real: termo parcial → página de resultados com várias matérias → escolha do primeiro card. Se o blog passar a usar autocomplete, vale estender o spec com seletores específicos do plugin.

### Detalhe de implementação (Cypress)

O botão da lupa usa `href="#"`, o que altera o hash e pode impedir a abertura do painel no runner. O comando customizado remove temporariamente o `href` **apenas no clique do teste**, sem impacto ao site.

## Integração contínua

O workflow [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) executa `npx cypress run` em **push/PR** para `main` ou `master` no GitHub Actions (Ubuntu, Node 20).

## Estrutura do projeto

```
├── cypress/
│   ├── e2e/
│   │   └── blog-search.cy.js   # especificações
│   └── support/
│       ├── commands.js         # cy.openHeaderSearchFromColunas()
│       └── e2e.js
├── cypress.config.js
├── package.json
└── README.md
```

## Licença

Uso educacional / desafio técnico — sem afiliação ao Agibank.
