// Métricas do quiz no PostHog. Escuta os eventos emitidos por app.js:
//   dancefit:step     → quiz_step_viewed
//   dancefit:answer   → quiz_answered (+ registra ans_* para quebrar a compra por resposta)
//   dancefit:checkout → checkout_clicked
// O nome digitado nunca é enviado. Medidas vão em faixas, nunca o valor exato.
import { STEPS } from './content.js';

const TOTAL = STEPS.length;

/** Faixa de `size` unidades: band(74, 10, 'kg') → '70–79 kg'. */
export function band(value, size, unit) {
  if (!Number.isFinite(value)) return null;
  const start = Math.floor(value / size) * size;
  return `${start}–${start + size - 1} ${unit}`;
}

/** Faixa da diferença meta − peso: −21 → 'perder 20–29 kg', 0 → 'mantener'. */
export function deltaBand(weight, target) {
  if (!Number.isFinite(weight) || !Number.isFinite(target)) return null;
  const delta = Math.round(target - weight);
  if (delta === 0) return 'mantener';
  const abs = Math.abs(delta);
  const range = abs < 5 ? '1–4' : abs < 10 ? '5–9' : band(abs, 10, '').trim();
  return `${delta < 0 ? 'perder' : 'ganar'} ${range} kg`;
}

function label(step, value) {
  const option = step.options?.find(item => item.value === value);
  return option ? option.label : String(value);
}

/**
 * Propriedades do evento quiz_answered para uma resposta.
 * Retorna { props, register } ou null se a etapa não existir.
 */
export function answerProps(stepId, value, answers = {}) {
  const step = STEPS.find(item => item.id === stepId);
  if (!step) return null;
  const props = { step_id: step.id, step_number: STEPS.indexOf(step) + 1, question_number: step.question ?? null, step_type: step.type };
  const register = {};
  if (step.type === 'name') {
    props.answer = 'respondido';
    return { props, register };
  }
  if (step.type === 'measure') {
    props.answer = band(value, 10, step.metric);
    register[`ans_${step.id}`] = props.answer;
    if (step.id === 'target') {
      props.target_change = deltaBand(answers.weight, value);
      register.ans_target_change = props.target_change;
    }
    return { props, register };
  }
  if (Array.isArray(value)) {
    props.answers = value;
    props.answer_labels = value.map(item => label(step, item));
    props.answer = value.slice().sort().join(' + ');
    props.answer_label = props.answer_labels.join(' + ');
    register[`ans_${step.id}`] = props.answer_label;
    return { props, register };
  }
  props.answer = value ?? null;
  props.answer_label = value == null ? null : label(step, value);
  register[`ans_${step.id}`] = props.answer_label;
  return { props, register };
}

// ---------------------------------------------------------------- navegador
if (typeof document !== 'undefined') {
  const ph = () => (window.posthog && typeof window.posthog.capture === 'function' ? window.posthog : null);
  const answers = {};
  let stepShownAt = Date.now();

  document.addEventListener('dancefit:step', event => {
    const { step: id, index } = event.detail || {};
    const step = STEPS.find(item => item.id === id);
    stepShownAt = Date.now();
    ph()?.capture('quiz_step_viewed', { step_id: id, step_number: index, step_type: step?.type ?? null, question_number: step?.question ?? null, total_steps: TOTAL });
  });

  document.addEventListener('dancefit:answer', event => {
    const { step: id, value } = event.detail || {};
    if (id !== 'name') answers[id] = value;
    const result = answerProps(id, value, answers);
    if (!result) return;
    result.props.seconds_on_step = Math.round((Date.now() - stepShownAt) / 100) / 10;
    const client = ph();
    if (!client) return;
    if (Object.keys(result.register).length) client.register(result.register);
    client.capture('quiz_answered', result.props);
  });

  document.addEventListener('dancefit:checkout', event => {
    const { price, currency, configured } = event.detail || {};
    ph()?.capture('checkout_clicked', { price, currency, checkout_configured: Boolean(configured) });
  });
}
