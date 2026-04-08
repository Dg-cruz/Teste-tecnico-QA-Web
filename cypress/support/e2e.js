// Ponto único de entrada do support E2E: comandos globais + suíte homeSearch.
import './commands';
import './homeSearch/blog-search';

/**
 * Suprime qualquer exceção não tratada da aplicação.
 * Útil quando o site dispara erros de terceiros no runner; por outro lado, pode mascarar bugs reais.
 */
Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar falha do teste
    console.warn('⚠️ Ignored uncaught exception:', err.message)
    return false
  })