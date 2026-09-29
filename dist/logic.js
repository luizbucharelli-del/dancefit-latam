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
  const activity = { none: 0, monthly: 1, weekly: 2, often: 3, daily: 4 }[answers.activity] ?? 0;
  const experience = { beginner: 0, intermediate: 1, advanced: 2 }[answers.experience] ?? 0;
  const limitations = ['back', 'knees', 'arms', 'shoulder'].filter(key => Array.isArray(answers.limitations) && answers.limitations.includes(key));
  const needsReview = limitations.length > 0;
  const restart = ['three-plus', 'never'].includes(answers.history);
  const minutes = ['10', '15', '30'].includes(answers.duration) ? Number(answers.duration) : activity < 2 || needsReview ? 10 : experience === 2 && activity >= 3 ? 30 : 15;
  const startMinutes = Math.min(minutes, needsReview || activity === 0 ? 5 : activity < 2 || experience === 0 || restart ? 10 : minutes);
  const days = needsReview ? 2 : Math.min(experience === 0 ? 3 : 4, [2, 2, 3, 4, 4][activity]);
  const body = { standard: 'Estándar', soft: 'Flácida', extra: 'Con más volumen' }[answers.body] || 'Estándar';
  const story = { easy: 'Subes de peso con facilidad', varies: 'Tu peso varía bastante', hard: 'Te cuesta adelgazar', unsure: 'Todavía no estás segura' }[answers.weightStory] || 'Según tus respuestas';
  const goals = ['weight', 'fitness', 'dance'].filter(key => Array.isArray(answers.goals) && answers.goals.includes(key));
  const goalLabels = { weight: 'Perder peso a tu ritmo', fitness: 'Mantenerte en forma', dance: 'Aprender a bailar' };
  const goal = goals.map(key => goalLabels[key]).join(' + ') || 'Crear una rutina de baile';
  const result = goals.map(key => ({ weight: 'Acompañar tu objetivo de peso', fitness: 'Mejorar tu constancia', dance: 'Ganar confianza con nuevos pasos' })[key]).join(' + ') || 'Crear un hábito que disfrutes';
  const rhythmKey = ['energetic', 'light'].includes(answers.rhythm) ? answers.rhythm : activity < 2 || experience === 0 || needsReview ? 'light' : 'energetic';
  const rhythm = rhythmKey === 'light' ? 'Ritmos latinos: cumbia / merengue / bachata' : 'Baile fitness: cumbia / merengue / bachata';
  const focusLabels = { arms: 'Brazos', belly: 'Zona abdominal', glutes: 'Glúteos', legs: 'Piernas', all: 'Todo el cuerpo' };
  const focusKeys = Object.keys(focusLabels).filter(key => Array.isArray(answers.focus) && answers.focus.includes(key));
  const focus = focusKeys.length ? focusKeys.map(key => focusLabels[key]).join(' · ') : 'Todo el cuerpo';
  const dream = { fit: 'Tonificado', defined: 'Definido', curves: 'Con curvas', slimmer: 'Un poco más delgada' }[answers.dream] || 'Sentirte bien contigo';
  const history = { recent: 'Recuperar una rutina reciente', 'one-two': 'Retomar después de 1–2 años', 'three-plus': 'Volver a empezar con calma', happy: 'Cuidar el bienestar que ya tienes', never: 'Construir tu primer hábito' }[answers.history] || 'Crear constancia';
  const event = { holiday: 'Tus próximas vacaciones', wedding: 'Una boda', sport: 'Un evento deportivo', beach: 'Tu viaje a la playa', reunion: 'Una reunión', family: 'Una ocasión familiar', other: 'Tu próximo evento', none: 'Sentirte bien en tu día a día' }[answers.event] || 'Sentirte bien en tu día a día';
  const limitationLabels = { back: 'espalda', knees: 'rodillas', arms: 'brazos', shoulder: 'hombro' };
  const care = needsReview ? `Mencionaste molestias en ${limitations.map(key => limitationLabels[key]).join(' y ')}. Revisa con un profesional qué movimientos y duración son adecuados para ti antes de iniciar.` : 'Empieza a un ritmo cómodo y avanza solo si te sientes bien.';
  const path = needsReview ? 'Inicio con revisión de movimientos' : experience === 0 ? 'Primeros pasos' : activity < 2 || restart ? 'Vuelta al ritmo' : goals.includes('dance') ? 'Ritmo y coordinación' : 'Constancia en movimiento';
  const rhythmReason = answers.rhythm === 'auto' ? `Elegimos ${rhythmKey === 'light' ? 'ritmos ligeros' : 'bailes animados'} por tu experiencia y frecuencia actual.` : 'Mantenemos el estilo de baile que elegiste.';
  const reasons = [
    `${level}: ${experience === 0 ? 'pasos básicos y repeticiones' : experience === 1 ? 'combinaciones cortas con práctica guiada' : 'secuencias con más variedad y coordinación'}.`,
    `Dispones de hasta ${minutes} min; tu punto de partida sugerido es ${startMinutes} min, ${days} días por semana.`,
    rhythmReason,
    `${history}. ${restart ? 'La progresión empieza con sesiones cortas.' : 'La continuidad importa más que la velocidad.'}`,
  ];
  const weekThemes = goals.includes('dance') ? ['Conocer los pasos', 'Unir movimientos', 'Practicar secuencias', 'Repetir tu combinación favorita'] : ['Encontrar tu ritmo', 'Crear constancia', 'Ampliar tu rutina', 'Consolidar el hábito'];
  const weeks = weekThemes.map((theme, index) => {
    const weekMinutes = needsReview ? startMinutes : Math.min(minutes, startMinutes + index * 5);
    const sessions = needsReview ? days : Math.min(4, days + (index >= 2 && activity >= 2 ? 1 : 0));
    return { week: index + 1, theme, minutes: weekMinutes, sessions, rhythm, focus: focusKeys.length ? focusLabels[focusKeys[index % focusKeys.length]] : 'Todo el cuerpo', days: sessions === 2 ? 'Martes · Viernes' : sessions === 3 ? 'Lunes · Miércoles · Sábado' : 'Lunes · Miércoles · Viernes · Domingo', note: needsReview ? 'Organización orientativa pendiente de revisar tus molestias.' : index === 0 ? 'Prioriza familiarizarte con la clase.' : 'Avanza solo si la semana anterior te resultó cómoda.' };
  });
  const current = Number.isFinite(answers.weight) ? answers.weight : null;
  const target = Number.isFinite(answers.target) ? answers.target : null;
  const delta = current !== null && target !== null ? Math.round((target - current) * 10) / 10 : null;
  const direction = delta === null ? 'unknown' : delta < 0 ? 'lose' : delta > 0 ? 'gain' : 'maintain';
  const weightNote = direction === 'gain' && goals.includes('weight') ? 'Marcaste perder peso, pero tu peso objetivo es mayor que el actual. Puedes volver y revisar esas respuestas.' : direction === 'maintain' ? 'Tu objetivo coincide con tu peso actual: el plan se centra en constancia y baile.' : 'Tu meta de peso es un objetivo declarado, no un resultado garantizado en 28 días.';
  return { level, minutes, startMinutes, days, body, story, goal, result, goals, rhythm, rhythmKey, rhythmReason, focus, dream, history, event, ageGroup: answers.age === '50+' ? '50+ años' : '40–49 años', needsReview, care, path, reasons, weeks, current, target, delta, direction, weightNote,
    beforeImage: { standard: 'pergunta3', soft: 'pergunta3(2)', extra: 'pergunta3(3)' }[answers.body] || 'before',
    afterImage: { fit: 'pergunta3', defined: 'pergunta4(definido)', curves: 'pergunta3(2)', slimmer: 'pergunta3' }[answers.dream] || 'after' };
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
