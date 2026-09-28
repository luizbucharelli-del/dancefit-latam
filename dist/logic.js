export function toggleSelection(current, value, exclusive = 'none') {
  const selected = new Set(Array.isArray(current) ? current : []);
  if (selected.has(value)) selected.delete(value);
  else if (value === exclusive) { selected.clear(); selected.add(value); }
  else { selected.delete(exclusive); selected.add(value); }
  return [...selected];
}

export function toDisplay(value, kind, unit) {
  if (unit === 'metric') return Math.round(value * 10) / 10;
  return Math.round((kind === 'height' ? value / 2.54 : value * 2.2046226218) * 10) / 10;
}

export function toMetric(value, kind, unit) {
  return unit === 'metric' ? value : kind === 'height' ? value * 2.54 : value / 2.2046226218;
}

export function bmi(height, weight) {
  return Number.isFinite(height) && Number.isFinite(weight) && height > 0 && weight > 0 ? weight / ((height / 100) ** 2) : null;
}

export function profile(answers) {
  const level = { beginner: 'Principiante', intermediate: 'Intermedia', advanced: 'Experimentada' }[answers.experience] || 'Principiante';
  const minutes = answers.duration === 'auto' ? (answers.activity === 'none' ? 10 : 15) : Number(answers.duration) || 15;
  const body = { standard: 'Estándar', soft: 'Flácida', extra: 'EXTRA' }[answers.body] || 'Estándar';
  const story = { easy: 'Subes de peso con facilidad', varies: 'Tu peso varía bastante', hard: 'Te cuesta adelgazar', unsure: 'Todavía no estás segura' }[answers.weightStory] || 'Según tus respuestas';
  const goals = Array.isArray(answers.goals) ? answers.goals : [];
  const goal = goals.includes('weight') ? 'Perder peso a tu ritmo' : goals.includes('fitness') ? 'Mantenerte en forma' : 'Aprender a bailar';
  const result = goals.includes('weight') ? 'Más energía + adelgazamiento progresivo' : goals.includes('fitness') ? 'Más energía + una rutina constante' : 'Más confianza + nuevos pasos de baile';
  return { level, minutes, body, story, goal, result };
}

export function priceLabel(value, currency = 'USD') {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value).replace('USD', 'US$');
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function safeCheckoutUrl(value, search = '') {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const params = new URLSearchParams(search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (params.has(key)) url.searchParams.set(key, params.get(key).slice(0, 200));
    }
    return url.href;
  } catch { return null; }
}
