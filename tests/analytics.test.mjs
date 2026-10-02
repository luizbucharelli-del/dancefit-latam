import test from 'node:test';
import assert from 'node:assert/strict';
import { band, deltaBand, answerProps } from '../dist/analytics.js';

test('Medidas viram faixas de 10 unidades, nunca o valor exato', () => {
  assert.equal(band(174, 10, 'cm'), '170–179 cm');
  assert.equal(band(81.4, 10, 'kg'), '80–89 kg');
  assert.equal(band(NaN, 10, 'kg'), null);
  const { props } = answerProps('weight', 81.4);
  assert.equal(props.answer, '80–89 kg');
  assert.ok(!JSON.stringify(props).includes('81.4'));
});

test('Diferença entre meta e peso vira faixa', () => {
  assert.equal(deltaBand(81, 60), 'perder 20–29 kg');
  assert.equal(deltaBand(70, 67), 'perder 1–4 kg');
  assert.equal(deltaBand(70, 63), 'perder 5–9 kg');
  assert.equal(deltaBand(70, 70), 'mantener');
  assert.equal(deltaBand(60, 72), 'ganar 10–19 kg');
  assert.equal(answerProps('target', 60, { weight: 81 }).props.target_change, 'perder 20–29 kg');
});

test('Nome nunca é enviado', () => {
  const { props, register } = answerProps('name', 'Ana Maria');
  assert.equal(props.answer, 'respondido');
  assert.ok(!JSON.stringify({ props, register }).includes('Ana'));
});

test('Escolhas levam o texto da opção e alimentam ans_*', () => {
  const single = answerProps('age', '50+');
  assert.equal(single.props.answer_label, '50+ años');
  assert.equal(single.register.ans_age, '50+ años');
  const multi = answerProps('goals', ['dance', 'weight']);
  assert.deepEqual(multi.props.answers, ['dance', 'weight']);
  assert.equal(multi.register.ans_goals, 'Aprender a bailar + Perder peso');
  assert.equal(answerProps('nao-existe', 'x'), null);
});
