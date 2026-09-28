import { CONFIG } from './config.js';
import { STEPS, LOADING_ITEMS, TESTIMONIALS, FAQ } from './content.js';
import { toggleSelection, toDisplay, toMetric, bmi, profile, priceLabel, escapeHtml as esc, safeCheckoutUrl } from './logic.js';

const app = document.querySelector('#app');
const back = document.querySelector('#back');
const progress = document.querySelector('#progress');
const fill = document.querySelector('#progress-fill');
const stepLabel = document.querySelector('#step-label');
const assets = window.DANCEFIT_ASSETS || {};
const STORE = 'dancefit-latam-session-v1';
const TTL = 24 * 60 * 60 * 1000;
const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const lockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/></svg>';
const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
let state = { index: 0, maxVisited: 0, answers: {}, units: {}, startedAt: Date.now() };
let timers = [];
let transitioning = false;

try {
  const saved = JSON.parse(sessionStorage.getItem(STORE));
  if (saved && Date.now() - saved.startedAt < TTL && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < STEPS.length && saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers)) {
    state = { ...state, ...saved, maxVisited: Math.max(saved.index, Math.min(Number(saved.maxVisited) || 0, STEPS.length - 1)), units: saved.units || {} };
  }
} catch { /* Storage is optional; the quiz also works without it. */ }

function persist() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch {} }
function later(callback, delay) { const id = setTimeout(callback, delay); timers.push(id); return id; }
function stopTimers() { timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = []; transitioning = false; }
function asset(key, alt = '', className = '', extra = '') {
  const src = assets[key];
  return src ? `<img src="${esc(src)}" alt="${esc(alt)}" class="${className}" decoding="async" ${extra}>` : '';
}
function title(step) { return `<div class="heading"><h1>${step.title}</h1>${step.subtitle ? `<p>${step.subtitle}</p>` : ''}</div>`; }
function nextButton(label = 'Continuar', disabled = false) { return `<button class="primary continue" data-action="next" ${disabled ? 'disabled' : ''}>${label}${arrowIcon}</button>`; }
function savedSelection(step, value) { return step.multiple ? (state.answers[step.id] || []).includes(value) : state.answers[step.id] === value; }
function canContinue(step) {
  const value = state.answers[step.id];
  if (step.type === 'name') return typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 60;
  if (step.type === 'measure') return Number.isFinite(value) && value >= step.min && value <= step.max;
  if (step.multiple) return Array.isArray(value) && value.length > 0;
  if (step.type === 'choice' || step.type === 'age') return step.options.some(option => option.value === value);
  return true;
}

function go(index, replace = false) {
  if (index < 0 || index >= STEPS.length) return;
  state.index = index;
  state.maxVisited = Math.max(state.maxVisited, index);
  persist();
  const hash = `#${STEPS[index].id}`;
  if (replace) history.replaceState({ dancefit: index }, '', hash);
  else if (location.hash !== hash) history.pushState({ dancefit: index }, '', hash);
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.focus({ preventScroll: true });
  document.dispatchEvent(new CustomEvent('dancefit:step', { detail: { step: STEPS[index].id, index: index + 1 } }));
}
function next() {
  if (!canContinue(STEPS[state.index])) return;
  go(state.index + 1);
}

function ageScreen(step) {
  return `${title(step)}
    <div class="social-proof"><div class="avatars">${asset('iconespergunta1', '', '')}${asset('iconespergunta1(2)', '', '')}${asset('iconespergunta1(3)', '', '')}<span class="avatar-heart" aria-hidden="true">♥</span></div><p><strong>+52.347 mujeres</strong> ya han comenzado<br>y están transformando sus vidas.</p></div>
    <h2 class="question-label">¿Cuál es tu grupo de edad?</h2>
    <div class="age-grid">${step.options.map(o => `<button class="age-card" data-choice="${o.value}" aria-pressed="${savedSelection(step, o.value)}">${asset(o.image, '', '', 'fetchpriority="high"')}<span class="age-label">${o.label}<span class="arrow-small" aria-hidden="true">→</span></span></button>`).join('')}</div>
    <div class="trust-note"><span class="trust-icon">${lockIcon}</span><p><strong>100% seguro y confidencial</strong>Tus respuestas solo se usarán para personalizar tu plan.</p></div>`;
}
function curve(type) {
  const paths = { up: 'M5 31C10 8 16 6 27 6H43', wave: 'M5 31C14-2 32-2 43 31', flat: 'M4 28H17C24 28 24 13 32 13H43', zigzag: 'M4 25C5 12 13 12 14 25S22 35 25 24S32 12 35 24S42 33 44 32' };
  const stops = type === 'wave' || type === 'zigzag'
    ? '<stop offset="0" stop-color="#58c657"/><stop offset=".5" stop-color="#ff6668"/><stop offset="1" stop-color="#58c657"/>'
    : type === 'flat' ? '<stop offset="0" stop-color="#58c657"/><stop offset=".47" stop-color="#58c657"/><stop offset=".58" stop-color="#f17965"/><stop offset=".85" stop-color="#58c657"/>'
    : '<stop offset="0" stop-color="#58c657"/><stop offset=".6" stop-color="#dc9a63"/><stop offset="1" stop-color="#ff6266"/>';
  return `<svg class="mini-curve" viewBox="0 0 49 38" aria-hidden="true"><defs><linearGradient id="curve-${type}">${stops}</linearGradient></defs><path d="${paths[type]}" fill="none" stroke="url(#curve-${type})" stroke-width="3.2" stroke-linecap="round"/></svg>`;
}
function choicesScreen(step) {
  return `${title(step)}<div class="choices" aria-label="Opciones">${step.options.map((o, index) => {
    const imageKey = o.image || `pergunta${step.question}${index ? `(${index + 1})` : ''}`;
    const hasImage = Boolean(assets[imageKey]);
    return `<button class="choice" data-choice="${o.value}" aria-pressed="${savedSelection(step, o.value)}">
    ${step.multiple ? '<span class="checkbox" aria-hidden="true"></span>' : ''}<span class="choice-copy"><strong>${o.label}</strong>${o.detail ? `<small>${o.detail}</small>` : ''}</span>
    ${hasImage ? asset(imageKey, '', 'choice-image') : ''}${!hasImage && o.icon ? `<span class="choice-icon" aria-hidden="true">${o.icon}</span>` : ''}${!hasImage && o.curve ? curve(o.curve) : ''}${!hasImage && o.level ? `<span class="activity-level" aria-hidden="true">${[1, 2, 3, 4, 5].map(level => `<i class="${level <= o.level ? 'on' : ''}" style="height:${5 + level * 4}px"></i>`).join('')}</span>` : ''}
    </button>`;
  }).join('')}</div>${step.multiple || step.confirm ? nextButton('Continuar', !canContinue(step)) : ''}${step.multiple ? '<p class="multi-hint">Puedes elegir más de una opción.</p>' : ''}`;
}
function welcomeScreen(step) { return `${title(step)}${asset('welcome', 'Mujeres compartiendo un momento juntas', 'welcome-image')}<p class="welcome-copy">Vamos a crear tu plan personalizado.</p>${nextButton()}`; }
function proofScreen(step) {
  return `${title(step)}<article class="news-clipping">${asset('proof', 'Madre e hija adelgazan 83 kg con una clase de baile que quema 800 calorías. Jaime y Jean practican una modalidad que combina baile con ejercicios de fuerza. Imagen: Reproducción de Instagram. De VivaBem.', 'news-clipping-image')}</article><p class="pleasure-note"><span aria-hidden="true">✨</span> El ejercicio ligero funciona mejor cuando lo disfrutas. <span aria-hidden="true">✨</span></p>${nextButton()}`;
}
function loaderScreen(step) {
  return `${title(step)}<div class="loader-top"><div class="loader-meter"><span>Tu plan, paso a paso</span><strong id="loading-percent" aria-live="off">0%</strong></div><div class="loader-bar" role="progressbar" aria-label="Creando tu plan" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><div id="loading-fill"></div></div></div><div class="loading-list" aria-live="polite">${LOADING_ITEMS.map(([heading, detail], i) => `<div class="loading-item ${i === 0 ? 'active' : ''}"><span class="loading-check" aria-hidden="true"></span><div><strong>${heading}</strong><small>${detail}</small></div></div>`).join('')}</div>`;
}
function measureScreen(step) {
  if (!Number.isFinite(state.answers[step.id])) state.answers[step.id] = step.initial;
  const unit = state.units[step.id] || 'metric';
  const value = toDisplay(state.answers[step.id], step.id, unit);
  const min = toDisplay(step.min, step.id, unit);
  const max = toDisplay(step.max, step.id, unit);
  return `${title(step)}<div class="measure-panel"><div class="unit-switch" aria-label="Unidad de medida"><button data-unit="metric" aria-pressed="${unit === 'metric'}">${step.metric}</button><button data-unit="imperial" aria-pressed="${unit === 'imperial'}">${step.imperial}</button></div>
    <div class="measure-number"><input id="measure-value" type="number" inputmode="decimal" step="0.1" min="${min}" max="${max}" value="${value}" aria-label="${step.title}" aria-describedby="measure-error"><span>${unit === 'metric' ? step.metric : step.imperial}</span></div>
    <div class="ruler"><div class="ruler-ticks" aria-hidden="true"></div><input id="measure-range" type="range" min="${step.min}" max="${step.max}" step="1" value="${state.answers[step.id]}" aria-label="Ajustar ${step.id === 'height' ? 'altura' : 'peso'}" aria-valuetext="${value} ${unit === 'metric' ? step.metric : step.imperial}"><div class="range-labels" aria-hidden="true"><span>${min}</span><span>${Math.round((min + max) / 2)}</span><span>${max}</span></div><p class="drag-hint">Arrastra para ajustar o escribe tu medida.</p></div><p class="field-error" id="measure-error" role="status"></p>
    ${step.id === 'height' ? '<div class="bmi-note"><strong>Calculando tu índice de masa corporal (IMC)</strong>El IMC es una herramienta común para evaluar el riesgo de varios problemas de salud.</div>' : ''}</div>${nextButton('Continuar', !canContinue(step))}`;
}
function summaryScreen(step) {
  const info = profile(state.answers);
  const value = bmi(state.answers.height, state.answers.weight);
  const label = value === null ? 'Sin datos' : value < 18.5 ? 'BAJO PESO' : value < 25 ? 'RANGO NORMAL' : value < 30 ? 'SOBREPESO' : 'IMC ELEVADO';
  const score = value === null ? '—' : value.toLocaleString('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  return `${title(step)}<div class="summary-grid">${asset(state.answers.age === '50+' ? 'pergunta1(2)' : 'pergunta1', '', 'summary-portrait')}<dl class="summary-facts"><div class="fact"><dt>Nivel de baile</dt><dd>${info.level}</dd></div><div class="fact"><dt>Tipo de cuerpo</dt><dd>${info.body}</dd></div><div class="fact"><dt>Lo que nos contaste</dt><dd>${info.story}</dd></div></dl></div>
    <div class="bmi-box"><div class="bmi-title"><span>ÍNDICE DE MASA CORPORAL (IMC)</span><span class="bmi-score">${score}</span></div><div class="bmi-scale"><span class="bmi-pin" style="left:${value === null ? 0 : Math.min(98, Math.max(2, (value - 15) / 25 * 100))}%"></span></div><div class="bmi-legend"><span>Tu IMC</span><strong>${label}</strong></div></div>
    <p class="medical-note">El IMC es una referencia general y no reemplaza una evaluación médica. Tus respuestas describen tus preferencias; no permiten diagnosticar tu metabolismo.</p>${nextButton()}`;
}
function nameScreen(step) {
  return `${title(step)}<form class="name-form"><input id="name-field" class="name-field" name="given-name" type="text" autocomplete="given-name" placeholder="Escribe tu nombre…" value="${esc(state.answers.name || '')}" minlength="2" maxlength="60" aria-label="Tu nombre" required>${nextButton('Continuar', !canContinue(step))}</form>`;
}
function testimonialsScreen(step) {
  return `${title(step)}<div class="loader-top"><div class="loader-meter"><span>Tu plan está casi listo</span><strong id="loading-percent">0%</strong></div><div class="loader-bar" role="progressbar" aria-label="Creando tu plan" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><div id="loading-fill"></div></div></div><h2 class="testimonial-title">Durante los últimos 30 días, las usuarias del plan perdieron 10 kg. 😍</h2><div class="testimonials">${TESTIMONIALS.map(t => `<article class="testimonial"><div class="stars" aria-label="5 de 5 estrellas">★★★★★</div><strong>${t.name}</strong><small>${t.handle}</small><p>${t.text}</p></article>`).join('')}</div>`;
}
function projectionScreen(step) {
  const current = Number(state.answers.weight) || 70;
  const target = Number(state.answers.target) || 60;
  const format = n => n.toLocaleString('es-AR', { maximumFractionDigits: 1 });
  const high = Math.max(current, target) + 10;
  const low = Math.max(0, Math.min(current, target) - 25);
  const y = n => 222 - (n - low) / (high - low) * 164;
  const y1 = y(current), y2 = y(target), ym = (y1 + y2) / 2;
  return `${title(step)}<p class="projection-copy">Según tus respuestas, este es el objetivo que quieres alcanzar:</p><h2 class="target-title">${format(target)} kg</h2><p class="projection-copy">Prepárate para empezar tu programa de ${CONFIG.programDays} días.</p>
    <div class="projection-chart"><svg viewBox="0 0 610 280" role="img" aria-label="Tu peso actual es ${format(current)} kilos y tu objetivo es ${format(target)} kilos. Ilustración de tu meta, no una predicción."><defs><linearGradient id="chart-gradient"><stop offset="0" stop-color="#f39691"/><stop offset=".5" stop-color="#f0d48e"/><stop offset="1" stop-color="#91cca3"/></linearGradient></defs>
      ${[60, 115, 170, 225].map(v => `<line x1="37" y1="${v}" x2="577" y2="${v}" stroke="#e8d9dc" stroke-dasharray="4 5"/>`).join('')}
      <path d="M37 ${y1} Q177 ${ym} 307 ${ym} T577 ${y2} L577 225 L37 225Z" fill="url(#chart-gradient)" opacity=".72"/>
      <path d="M37 ${y1} Q177 ${ym} 307 ${ym} T577 ${y2}" stroke="#cb897b" stroke-width="3" fill="none"/>
      <circle cx="37" cy="${y1}" r="7" fill="#e8777d" stroke="white" stroke-width="4"/><circle cx="307" cy="${ym}" r="7" fill="#d1ad7a" stroke="white" stroke-width="4"/><circle cx="577" cy="${y2}" r="7" fill="#64a782" stroke="white" stroke-width="4"/>
      <text x="37" y="${y1 - 21}" text-anchor="start" class="chart-text" style="font-weight:bold;fill:#bd5b79">${format(current)} kg</text><text x="577" y="${y2 - 21}" text-anchor="end" class="chart-text" style="font-weight:bold;fill:#428566">${format(target)} kg</text><text x="37" y="262" text-anchor="start" class="chart-text">Hoy</text><text x="307" y="262" text-anchor="middle" class="chart-text">Tu progreso</text><text x="577" y="262" text-anchor="end" class="chart-text">Tu objetivo</text></svg></div>
      <p class="chart-note">Representación de tu objetivo, no una predicción. Los resultados y el tiempo necesario varían de una persona a otra.</p>${nextButton()}`;
}
function planScreen() {
  const name = esc(state.answers.name?.trim() || 'ti');
  const info = profile(state.answers);
  return `<div class="plan-head">${asset(state.answers.age === '50+' ? 'pergunta1(2)' : 'pergunta1', '', 'plan-avatar')}<div><p>plan</p><h1>DanceFit</h1><strong>de ${name}</strong></div></div><p class="plan-intro">Creamos un <strong>plan 100% personalizado</strong> basado en tus respuestas.</p><dl class="plan-facts"><div><dt>Lo que nos contó ${name}</dt><dd>${info.story}</dd></div><div><dt>Rutina ideal</dt><dd>${info.minutes} min por día</dd></div><div><dt>Nivel</dt><dd>${info.level}</dd></div><div><dt>Objetivo</dt><dd>${info.goal}</dd></div><div><dt>Resultado esperado</dt><dd>${info.result}</dd></div></dl>${nextButton('Ver mi plan completo')}`;
}
function buyButton() { return `<button class="primary purchase" data-action="checkout">Quiero empezar ahora ${arrowIcon}</button>`; }
function offerScreen() {
  const name = esc(state.answers.name?.trim() || '');
  const compare = CONFIG.compareAtPrice && CONFIG.compareAtPrice > CONFIG.price ? `<del>Antes ${priceLabel(CONFIG.compareAtPrice, CONFIG.currency)}</del>` : '';
  const timer = CONFIG.offerEndsAt && new Date(CONFIG.offerEndsAt).getTime() > Date.now() ? '<p class="offer-timer-label">Esta oferta termina en</p><div class="offer-timer" aria-label="Tiempo restante de la oferta"><div><strong id="timer-minutes">—</strong><small>MIN</small></div><span>:</span><div><strong id="timer-seconds">—</strong><small>SEG</small></div></div>' : '';
  return `<div class="heading"><h1>¡Accede ya a tu plan de adelgazamiento con baile${name ? `, ${name}` : ''}!</h1></div>
    <div class="before-after"><figure class="body-figure">${asset('before', 'Representación del punto de partida')}<figcaption>Ahora</figcaption></figure><span class="transform-arrow" aria-hidden="true">›</span><figure class="body-figure">${asset('after', 'Representación del objetivo')}<figcaption>Tu objetivo</figcaption></figure></div>
    <ul class="benefits"><li>Plan personal de pérdida de peso de ${CONFIG.programDays} días adaptado a tu edad, tipo de cuerpo e IMC.</li><li>Entrenamientos cortos pero efectivos. Solo 10 minutos al día para quemar grasa rápidamente.</li><li>Más de 300 entrenamientos de baile y programas especiales.</li><li>Practica en cualquier lugar y sin equipo.</li><li>Los estilos de baile más populares: prueba uno nuevo todos los días.</li></ul>
    ${timer}<div class="price-card"><div class="price-top"><span class="payment-label">PAGO ÚNICO</span><div class="price">${compare}<strong>${priceLabel(CONFIG.price, CONFIG.currency)}</strong><small>DÓLARES ESTADOUNIDENSES</small></div></div>${buyButton()}<p class="secure-payment">${lockIcon} Pago 100% seguro</p></div>
    <section class="access-card"><h2>¿Cómo recibiré mi acceso a todo esto?</h2><p>Después de confirmar tu compra, recibirás un correo electrónico con tu acceso a nuestra Área de Alumnas. Dentro encontrarás todas las clases organizadas, una para cada día de la semana: solo tienes que darle play y empezar.</p></section>
    <section class="guarantee">${asset('guarantee', 'Garantía de devolución de 7 días')}<h2>Garantía de devolución del 100% de tu dinero</h2><p>Confiamos en la calidad de nuestro plan. Si en ${CONFIG.guaranteeDays} días no sientes la diferencia, solo tienes que avisarnos y te devolvemos cada centavo.</p></section>
    <section><h2 class="faq-heading">Lo que la gente suele preguntar</h2><div class="faq">${FAQ.map(([question, answer], i) => `<details ${i === 0 ? 'open' : ''}><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></section>${buyButton()}`;
}

function render() {
  stopTimers();
  const step = STEPS[state.index];
  back.hidden = state.index === 0;
  const percent = Math.round((state.index + 1) / STEPS.length * 100);
  fill.style.width = `${percent}%`;
  progress.setAttribute('aria-valuenow', String(percent));
  stepLabel.textContent = step.question ? `${step.question} / 17` : '';
  const renderers = { age: ageScreen, choice: choicesScreen, welcome: welcomeScreen, proof: proofScreen, loading: loaderScreen, measure: measureScreen, summary: summaryScreen, name: nameScreen, testimonials: testimonialsScreen, projection: projectionScreen, plan: planScreen, offer: offerScreen };
  app.innerHTML = `<section class="screen" data-step="${step.id}">${renderers[step.type](step)}</section>`;
  document.title = step.type === 'offer' ? 'Tu plan DanceFit — US$ 9,90' : 'DanceFit — Tu plan de baile';
  if (step.type === 'loading' || step.type === 'testimonials') startLoading(step.type === 'loading' ? 4800 : 6000);
  if (step.type === 'offer' && CONFIG.offerEndsAt) startOfferTimer();
  persist();
}
function startLoading(duration) {
  const started = performance.now();
  const update = () => {
    const percent = Math.min(100, Math.round((performance.now() - started) / duration * 100));
    const bar = document.querySelector('#loading-fill');
    if (!bar) return;
    bar.style.width = `${percent}%`;
    bar.parentElement.setAttribute('aria-valuenow', String(percent));
    document.querySelector('#loading-percent').textContent = `${percent}%`;
    document.querySelectorAll('.loading-item').forEach((item, index) => {
      const done = percent >= (index + 1) * 20;
      item.classList.toggle('done', done);
      item.classList.toggle('active', !done && percent >= index * 20);
      item.querySelector('.loading-check').textContent = done ? '✓' : '';
    });
    if (percent === 100) later(next, 450);
    else later(update, 80);
  };
  update();
}
function startOfferTimer() {
  const update = () => {
    const total = Math.max(0, Math.floor((new Date(CONFIG.offerEndsAt).getTime() - Date.now()) / 1000));
    const min = document.querySelector('#timer-minutes');
    if (!min) return;
    min.textContent = String(Math.floor(total / 60)).padStart(2, '0');
    document.querySelector('#timer-seconds').textContent = String(total % 60).padStart(2, '0');
    if (total === 0) { document.querySelector('.offer-timer')?.remove(); document.querySelector('.offer-timer-label')?.remove(); }
    else later(update, 1000);
  };
  update();
}

app.addEventListener('click', event => {
  const choice = event.target.closest('[data-choice]');
  const step = STEPS[state.index];
  if (choice && !transitioning) {
    const value = choice.dataset.choice;
    if (!step.options?.some(option => option.value === value)) return;
    state.answers[step.id] = step.multiple ? toggleSelection(state.answers[step.id], value) : value;
    app.querySelectorAll('[data-choice]').forEach(button => button.setAttribute('aria-pressed', String(savedSelection(step, button.dataset.choice))));
    const continueButton = app.querySelector('[data-action=next]');
    if (continueButton) continueButton.disabled = !canContinue(step);
    persist();
    if (!step.multiple && !step.confirm) { transitioning = true; later(() => { transitioning = false; next(); }, 220); }
  }
  const unit = event.target.closest('[data-unit]');
  if (unit && step.type === 'measure') {
    const selection = unit.dataset.unit;
    if (!['metric', 'imperial'].includes(selection)) return;
    state.units[step.id] = selection;
    render();
    app.querySelector(`[data-unit="${selection}"]`)?.focus({ preventScroll: true });
  }
  if (event.target.closest('[data-action=next]')) { event.preventDefault(); next(); }
  if (event.target.closest('[data-action=checkout]')) {
    const url = safeCheckoutUrl(CONFIG.checkoutUrl, location.search);
    document.dispatchEvent(new CustomEvent('dancefit:checkout', { detail: { configured: Boolean(url), price: CONFIG.price, currency: CONFIG.currency } }));
    if (url) location.assign(url);
    else document.querySelector('#checkout-notice').showModal();
  }
});

app.addEventListener('input', event => {
  const step = STEPS[state.index];
  if (event.target.id === 'name-field') {
    state.answers.name = event.target.value;
    app.querySelector('[data-action=next]').disabled = !canContinue(step);
    persist();
  }
  if (step.type === 'measure' && ['measure-value', 'measure-range'].includes(event.target.id)) {
    const unit = state.units[step.id] || 'metric';
    const typed = event.target.id === 'measure-value';
    const number = event.target.value === '' ? NaN : Number(event.target.value);
    const value = typed ? toMetric(number, step.id, unit) : number;
    const valid = Number.isFinite(value) && value >= step.min - 0.025 && value <= step.max + 0.025;
    state.answers[step.id] = valid ? Math.min(step.max, Math.max(step.min, value)) : null;
    const error = document.querySelector('#measure-error');
    error.textContent = valid ? '' : `Introduce un valor entre ${toDisplay(step.min, step.id, unit)} y ${toDisplay(step.max, step.id, unit)} ${unit === 'metric' ? step.metric : step.imperial}.`;
    document.querySelector('#measure-value').setAttribute('aria-invalid', String(!valid));
    if (valid) {
      if (typed) document.querySelector('#measure-range').value = String(value);
      else document.querySelector('#measure-value').value = toDisplay(value, step.id, unit);
      document.querySelector('#measure-range').setAttribute('aria-valuetext', `${toDisplay(value, step.id, unit)} ${unit === 'metric' ? step.metric : step.imperial}`);
    }
    app.querySelector('[data-action=next]').disabled = !valid;
    persist();
  }
});
app.addEventListener('submit', event => { event.preventDefault(); next(); });
back.addEventListener('click', () => go(state.index - 1));
document.querySelector('.wordmark').addEventListener('click', event => { event.preventDefault(); go(0); });
document.querySelectorAll('.dialog-close, .dialog-close-action').forEach(button => button.addEventListener('click', () => document.querySelector('#checkout-notice').close()));
document.querySelector('#checkout-notice').addEventListener('click', event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close(); } });
window.addEventListener('popstate', () => {
  const index = STEPS.findIndex(step => `#${step.id}` === location.hash);
  go(index >= 0 && index <= state.maxVisited ? index : 0, true);
});
document.querySelector('#year').textContent = new Date().getFullYear();
if (assets.logo) document.querySelector('.wordmark').innerHTML = asset('logo', 'DanceFit', 'brand-image');
const initialHash = STEPS.findIndex(step => `#${step.id}` === location.hash);
if (initialHash >= 0 && initialHash <= state.maxVisited) state.index = initialHash;
go(state.index, true);
