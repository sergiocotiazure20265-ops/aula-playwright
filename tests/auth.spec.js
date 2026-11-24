// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const loginUrl = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/index.html';
const cadastroUrl = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/cadastro.html';
const evidenceDirectory = path.join(process.cwd(), 'evidencias');

async function saveEvidence(page, testInfo, name) {
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  await page.screenshot({
    path: path.join(evidenceDirectory, `${name}-${testInfo.project.name}.png`),
    fullPage: true,
  });
}

test('deve autenticar o usuário administrador com sucesso', async ({ page }, testInfo) => {
  await page.goto(loginUrl);
  await page.locator('#emailLogin').fill('admin@bluestock.com');
  await page.locator('#senhaLogin').fill('Admin@123');
  await page.locator('#btnEntrar').click();

  await expect(page).toHaveURL(/\/produtos\.html$/);
  await expect(page.getByRole('heading', { name: 'Consulta de produtos' })).toBeVisible();
  await saveEvidence(page, testInfo, 'login-sucesso');
});

test('deve negar acesso para usuário inválido', async ({ page }, testInfo) => {
  await page.goto(loginUrl);
  await page.locator('#emailLogin').fill('invalido@example.com');
  await page.locator('#senhaLogin').fill('SenhaInvalida@123');
  await page.locator('#btnEntrar').click();

  await expect(page.locator('#alertaLogin')).toHaveText('E-mail ou senha inválidos.');
  await expect(page).toHaveURL(loginUrl);
  await saveEvidence(page, testInfo, 'login-acesso-negado');
});

test('deve criar um usuário com sucesso', async ({ page }, testInfo) => {
  await page.goto(cadastroUrl);
  await page.locator('#nomeUsuario').fill('Usuário Playwright');
  await page.locator('#emailUsuario').fill(`pw-${randomUUID()}@example.com`);
  await page.locator('#senhaUsuario').fill('Teste@123');
  await page.locator('#btnCadastrarUsuario').click();

  await expect(page.locator('#alertaCadastroUsuario')).toHaveText(
    'Usuário cadastrado com sucesso. Você já pode fazer login.',
  );
  await saveEvidence(page, testInfo, 'cadastro-sucesso');
});

test('não deve permitir cadastrar usuários com o mesmo e-mail', async ({ page }, testInfo) => {
  await page.goto(cadastroUrl);
  const email = `pw-${randomUUID()}@example.com`;

  await page.locator('#nomeUsuario').fill('Usuário Playwright');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('Teste@123');
  await page.locator('#btnCadastrarUsuario').click();
  await expect(page.locator('#alertaCadastroUsuario')).toHaveText(
    'Usuário cadastrado com sucesso. Você já pode fazer login.',
  );

  await page.locator('#nomeUsuario').fill('Usuário duplicado');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('OutraSenha@123');
  await page.locator('#btnCadastrarUsuario').click();

  await expect(page.locator('#alertaCadastroUsuario')).toHaveText(
    'Já existe um usuário cadastrado com este e-mail.',
  );
  await saveEvidence(page, testInfo, 'cadastro-email-duplicado');
});
