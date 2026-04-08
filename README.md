# Automação E2E — Busca no Blog do Agi

Testes de interface com [Cypress](https://www.cypress.io/) sobre o **Blog do Agi** em produção, com foco na **busca pelo ícone de lupa no header** (tema **Astra**, seletor principal `#ast-desktop-header`).

O blog público responde em [https://blog.agibank.com.br](https://blog.agibank.com.br). O domínio [https://blogdoagi.com.br](https://blogdoagi.com.br/) costuma redirecionar para o mesmo site (canônico em produção).

---

## O que o projeto cobre

- Abrir a **home** com sessão limpa e checagem de que o **header desktop** renderizou (evita “layout quebrado” no runner quando CSS não aplica direito).
- Expor o **campo de busca** no header (lupa).
- Dois cenários: busca por **Demografia** e busca parcial por **Portal**, com validações de URL, página de resultados e conteúdo do primeiro resultado.

O spec atual **não** passa obrigatoriamente por **Colunas** no `beforeEach`; isso fica documentado abaixo como **fluxo alternativo** já suportado por comandos customizados.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) **18 ou superior** (LTS recomendado)
- npm (incluso no Node)

Compatível com **Windows**, **macOS** e **Linux**.

---

## Instalação

```bash
git clone <url-do-repositório>
cd <pasta-do-projeto>
npm ci
```

Se ainda não existir `package-lock.json` no repositório, use `npm install`.

---

## Executar os testes

| Objetivo | Comando |
|----------|---------|
| **CI / terminal (headless)** | `npm test` ou `npm run cypress:run` |
| **Interface gráfica (depuração)** | `npm run cypress:open` |

No modo interativo, escolha **E2E Testing** e o arquivo `cypress/e2e/blog-search.cy.js`.

Para rodar só esse spec no terminal:

```bash
npx cypress run --spec "cypress/e2e/blog-search.cy.js"
```

### URL base e viewport

- **`baseUrl`**: definido em `cypress.config.js` como `https://blog.agibank.com.br`.
- **Viewport padrão** do Cypress: `1280 × 720` (config).
- O spec `blog-search.cy.js` usa **`cy.viewport(1920, 1080)`** no `beforeEach` para favorecer o layout **desktop** do menu e da lupa.

Sobrescrever a URL (ex.: ambiente de homologação):

```bash
npx cypress run --config baseUrl=https://blog.agibank.com.br
```

---

## Cenários automatizados

| # | Nome | O que valida |
|---|------|----------------|
| **1** | Demografia | Digita o termo no header, envia com **Enter**; URL com `s=`; título da página de resultados; pelo menos um `article.ast-article-post`; primeiro card com **href** e texto alinhados a “demografia”. |
| **2** | Portal | Digitação com **delay** entre teclas, **Enter**; URL e título de resultados; **pelo menos dois** artigos (busca parcial); obtém o **primeiro link** da listagem, navega com `cy.visit(pathname)` (mais estável que clique em headless) e valida `h1.entry-title` com trecho do título e menção a “portal”. O spec ainda reforça o `h1` com regex após o comando. |

### Busca em tempo real

Hoje a busca segue o fluxo **WordPress** (`?s=`), **sem** lista AJAX obrigatória enquanto se digita. Se o blog passar a usar autocomplete, o spec pode ser estendido com seletores do plugin.

### Detalhes que afetam o Cypress

- A âncora da lupa pode usar **`href="#"`**, o que altera o hash e atrapalha o toggle. O comando **`openHeaderSearch`** remove o `href` **só no DOM da sessão de teste** antes do clique.
- **Cliques com `{ force: true }`** e **`scrollIntoView`** são usados quando o runner marca o ícone como coberto ou com área clicável inconsistente.
- No cenário **2**, **`cy.visit(pathname)`** no primeiro resultado evita flakiness de clique em headless; o objetivo continua sendo “abrir o primeiro resultado da busca”.

---

## Arquitetura dos testes

### Arquivo de spec (`cypress/e2e/blog-search.cy.js`)

- Um **`describe`** com **`beforeEach`**: viewport grande → **`visitHomeClean()`** → **`openHeaderSearch()`**.
- Cada **`it`** chama um comando de alto nível definido em `homeSearch/blog-search.js` (`cy.homeSearchDemografia`, `cy.homeSearchPortalAbrePrimeiroResultado`).

### Comandos globais (`cypress/support/commands.js`)

| Comando | Função |
|---------|--------|
| `visitHomeClean` | Limpa cookies/storage, visita `/`, desregistra **service worker** (quando existe), espera `document.readyState === complete`, revalida altura do header e pode **recarregar** se o layout parecer quebrado. |
| `openHeaderSearch` | Abre o painel de busca no header desktop (lupa + wrapper). |
| `openHeaderSearchFromColunas` | **`cy.visit('/colunas/')`** → espera carga → **`openHeaderSearch()`** (fluxo alinhado ao README/desafio “a partir de Colunas”). |

### Suíte “homeSearch” (`cypress/support/homeSearch/blog-search.js`)

Registra os comandos **`homeSearchDemografia`** e **`homeSearchPortalAbrePrimeiroResultado`**, para manter o spec enxuto.

### Support E2E (`cypress/support/e2e.js`)

Importa `commands.js` e `homeSearch/blog-search.js`. Há um handler global de **`uncaught:exception`** que retorna `false` para não derrubar o run por erros não tratados do site (atenção: isso pode **ocultar** problemas reais da aplicação).

---

## Fluxo alternativo (menu → Colunas → lupa)

No spec, as linhas abaixo estão **comentadas**; descomentar troca o pré-requisito para: abrir submenu **O Agibank** → **Colunas** → lupa:

```js

```

Ou usar diretamente **`cy.openHeaderSearchFromColunas()`** no `beforeEach` se quiser sempre partir da URL `/colunas/`.

---

## Integração contínua

O workflow [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) executa `npx cypress run` em **push/PR** para as branches `main` ou `master` (Ubuntu, Node 20).

---

## Estrutura do repositório

```
├── .github/
│   └── workflows/
│       └── cypress.yml          # CI (GitHub Actions)
├── cypress/
│   ├── e2e/
│   │   └── blog-search.cy.js    # Especificações E2E
│   └── support/
│       ├── commands.js          # Comandos: visitHomeClean, menu, Colunas, lupa
│       ├── e2e.js               # Imports + uncaught:exception
│       └── homeSearch/
│           └── blog-search.js   # Comandos dos cenários 1 e 2
├── cypress.config.js            # baseUrl, timeouts, viewport padrão
├── package.json
└── README.md
```

---

## Licença

Uso educacional / desafio técnico — sem afiliação ao Agibank.
