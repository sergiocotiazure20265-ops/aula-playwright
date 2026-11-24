# aula-playwright

Testes end-to-end com Playwright para os fluxos de login e cadastro do BlueStock.

## Executar

```bash
npm ci
npx playwright install
npm test
```

Os testes cobrem login bem-sucedido e negado, cadastro bem-sucedido e rejeição de e-mail duplicado. As capturas de tela são salvas em `evidencias/`, identificadas pelo navegador usado. A pipeline publica as evidências junto com o relatório HTML.
