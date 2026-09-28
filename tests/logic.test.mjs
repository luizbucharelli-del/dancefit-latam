import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleSelection, toDisplay, toMetric, bmi, profile, priceLabel, escapeHtml, safeCheckoutUrl } from '../dist/logic.js';

test('Nenhuma das anteriores exclui as limitações e vice-versa', () => {
  assert.deepEqual(toggleSelection(['back', 'knees'], 'none'), ['none']);
  assert.deepEqual(toggleSelection(['none'], 'back'), ['back']);
  assert.deepEqual(toggleSelection(['back', 'knees'], 'back'), ['knees']);
});

test('Trocas de unidade preservam a medida física', () => {
  assert.ok(Math.abs(toMetric(toDisplay(174, 'height', 'imperial'), 'height', 'imperial') - 174) < .13);
  assert.ok(Math.abs(toMetric(toDisplay(81, 'weight', 'imperial'), 'weight', 'imperial') - 81) < .03);
  assert.equal(toMetric(70, 'weight', 'metric'), 70);
});

test('O IMC usa altura e peso informados, não valor fixo', () => {
  assert.ok(Math.abs(bmi(174, 81) - 26.75386) < .0001);
  assert.equal(bmi(0, 81), null);
  assert.equal(bmi(174, NaN), null);
});

test('O resumo reflete experiência, tempo, objetivo e percepção', () => {
  const p = profile({ experience: 'advanced', duration: '30', weightStory: 'varies', goals: ['dance'], body: 'soft' });
  assert.equal(p.level, 'Experimentada');
  assert.equal(p.minutes, 30);
  assert.equal(p.goal, 'Aprender a bailar');
  assert.equal(p.story, 'Tu peso varía bastante');
  assert.equal(profile({ duration: 'auto', activity: 'none' }).minutes, 10);
});

test('Checkout aceita HTTPS e atribuição UTM, sem dados pessoais', () => {
  assert.equal(safeCheckoutUrl(''), null);
  assert.equal(safeCheckoutUrl('javascript:alert(1)'), null);
  assert.equal(safeCheckoutUrl('http://example.com'), null);
  const result = new URL(safeCheckoutUrl('https://example.com/checkout', '?utm_source=instagram&name=Ana&weight=81'));
  assert.equal(result.searchParams.get('utm_source'), 'instagram');
  assert.equal(result.searchParams.has('name'), false);
  assert.equal(result.searchParams.has('weight'), false);
});

test('Nome é escapado e preço especifica dólar com duas casas decimais', () => {
  assert.equal(escapeHtml('<img src=x onerror="bad">'), '&lt;img src=x onerror=&quot;bad&quot;&gt;');
  assert.match(priceLabel(9.90), /US\$\s*9,90/);
});
