const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Site canônico do blog (blogdoagi.com.br costuma redirecionar para cá).
    baseUrl: 'https://blog.agibank.com.br',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    // Padrão global; specs podem sobrescrever com cy.viewport (ex.: blog-search.cy.js).
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents() {},
  },
});
