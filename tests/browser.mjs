import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

if (!process.argv[2]) throw new Error('Passe o caminho de playwright/index.mjs como argumento.');
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const snapshots = ['age', 'body', 'welcome', 'proof', 'height', 'summary', 'projection', 'plan', 'offer'];
const visited = [];

async function assertScreen(id) {
  await page.locator(`.screen[data-step="${id}"]`).waitFor();
  await page.locator('.screen').evaluate(async el => {
    await Promise.all([...el.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
  });
  const report = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    broken: [...document.querySelectorAll('img')].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
  }));
  assert.equal(report.overflow, false, `${id}: overflow mobile`);
  assert.deepEqual(report.broken, [], `${id}: imagens quebradas`);
  if (snapshots.includes(id)) await page.screenshot({ path: `test-results/${id}-mobile.png`, fullPage: true, animations: 'disabled' });
  visited.push(id);
}
async function choose(value) { await page.locator(`[data-choice="${value}"]`).click(); }
async function next() { await page.locator('[data-action=next]').click(); }

try {
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await assertScreen('age');
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.screenshot({ path: 'test-results/age-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await choose('40-49');
  await assertScreen('goals');
  assert.equal(await page.locator('[data-action=next]').isDisabled(), true);
  await choose('weight'); await choose('dance');
  await page.locator('#back').click();
  await page.locator('[data-choice="40-49"]').waitFor();
  assert.equal(await page.locator('[data-choice="40-49"]').getAttribute('aria-pressed'), 'true');
  await choose('40-49');
  await page.locator('.screen[data-step=goals]').waitFor();
  assert.equal(await page.locator('[data-choice=weight]').getAttribute('aria-pressed'), 'true');
  await next();
  await assertScreen('body'); await choose('extra');
  await assertScreen('dream'); await choose('defined');
  await assertScreen('welcome'); await next();
  await assertScreen('focus'); await choose('belly'); await choose('legs'); await next();
  await assertScreen('history'); await choose('three-plus');
  await assertScreen('experience'); await choose('intermediate');
  await assertScreen('weightStory'); await choose('varies');
  await assertScreen('proof'); await next();
  await assertScreen('activity'); await choose('weekly');
  await assertScreen('duration'); await choose('30');
  await assertScreen('rhythm'); await choose('energetic');
  await assertScreen('loading1');
  await assertScreen('event'); await choose('beach'); await next();
  await assertScreen('limitations'); await choose('back'); await choose('knees'); await choose('none');
  assert.equal(await page.locator('[data-choice=back]').getAttribute('aria-pressed'), 'false');
  assert.equal(await page.locator('[data-choice=none]').getAttribute('aria-pressed'), 'true');
  await choose('knees');
  assert.equal(await page.locator('[data-choice=none]').getAttribute('aria-pressed'), 'false');
  await next();
  await assertScreen('height');
  await page.locator('#measure-value').fill('174');
  await page.locator('[data-unit=imperial]').click();
  assert.equal(await page.locator('#measure-value').inputValue(), '68.5');
  await page.locator('[data-unit=metric]').click();
  assert.equal(await page.locator('#measure-value').inputValue(), '174');
  await next();
  await assertScreen('weight');
  await page.locator('#measure-value').fill('999');
  assert.equal(await page.locator('[data-action=next]').isDisabled(), true);
  await page.locator('#measure-value').fill('81');
  await page.locator('[data-unit=imperial]').click();
  assert.equal(await page.locator('#measure-value').inputValue(), '178.6');
  await page.locator('[data-unit=metric]').click();
  assert.equal(await page.locator('#measure-value').inputValue(), '81');
  await next();
  await assertScreen('target'); await page.locator('#measure-value').fill('60'); await next();
  await assertScreen('summary');
  assert.match(await page.locator('.bmi-score').innerText(), /26,8/);
  assert.match(await page.locator('.summary-facts').innerText(), /Intermedia/);
  await next();
  await assertScreen('name');
  await page.locator('#name-field').fill(' ');
  assert.equal(await page.locator('[data-action=next]').isDisabled(), true);
  await page.locator('#name-field').fill('Ana');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#name-field').inputValue(), 'Ana');
  await next();
  await assertScreen('loading2');
  await assertScreen('projection');
  assert.match(await page.locator('.target-title').innerText(), /60 kg/);
  await next();
  await assertScreen('plan');
  assert.match(await page.locator('.plan-facts').innerText(), /min por sesión/);
  assert.match(await page.locator('.plan-facts').innerText(), /Intermedia/);
  await next();
  await assertScreen('offer');
  assert.match(await page.locator('.price strong').innerText(), /US\$\s*9,90/);
  await page.locator('.faq details').nth(1).locator('summary').click();
  assert.equal(await page.locator('.faq details').nth(1).getAttribute('open'), '');
  await page.locator('[data-action=checkout]').first().click();
  assert.equal(await page.locator('#checkout-notice').isVisible(), true);
  await page.locator('.dialog-close-action').click();
  await page.locator('[data-action=checkout]').last().click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#checkout-notice').isVisible(), false);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.screenshot({ path: 'test-results/offer-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'Oferta 320px sem overflow');
  await page.screenshot({ path: 'test-results/offer-320.png', fullPage: true });
  assert.deepEqual(errors, []);
  const result = { success: true, screens: visited.length, visited, errors, viewport: ['390x844', '1440x1050', '320x740'], assertions: ['25 telas', '17 perguntas', 'voltar preserva respostas', 'nenhuma exclusiva', 'unidades', 'validação', 'IMC', 'resumo dinâmico', 'sessão após reload', 'preço USD', 'FAQ', 'dois CTAs', 'Escape fecha modal', 'imagens', 'sem overflow'] };
  await writeFile('test-results/report.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
