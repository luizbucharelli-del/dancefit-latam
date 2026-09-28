const option = (value, label, extra = {}) => ({ value, label, ...extra });

export const STEPS = [
  { id: 'age', type: 'age', question: 1, title: 'Tu plan de <em>adelgazamiento bailando</em> comienza aquí', subtitle: 'Responde rápidamente y recibe tu plan ideal', options: [option('40-49', '40 a 49 años', { image: 'pergunta1' }), option('50+', '50+ años', { image: 'pergunta1(2)' })] },
  { id: 'goals', type: 'choice', question: 2, multiple: true, title: '¿Cuál es tu objetivo principal?', subtitle: '¡Vamos a empezar tu viaje con tus objetivos!', options: [option('weight', 'Perder peso', { image: 'pergunta2' }), option('fitness', 'Mantenerme en forma', { image: 'pergunta2(2)' }), option('dance', 'Aprender a bailar', { image: 'pergunta2(3)' })] },
  { id: 'body', type: 'choice', question: 3, title: '¿Cómo describirías tu físico actual?', options: [option('standard', 'Estándar', { image: 'pergunta3' }), option('soft', 'Flácida', { image: 'pergunta3(2)' }), option('extra', 'EXTRA', { image: 'pergunta3(3)' })] },
  { id: 'dream', type: 'choice', question: 4, title: '¿Cómo sería el cuerpo de tus sueños?', options: [option('fit', 'Tonificado', { image: 'pergunta3' }), option('defined', 'Definido', { image: 'pergunta4(definido)' }), option('curves', 'Con curvas', { image: 'pergunta3(2)' }), option('slimmer', 'Un poco más delgada que antes', { image: 'pergunta3(3)' })] },
  { id: 'welcome', type: 'welcome', title: '¡Estás en el lugar correcto!' },
  { id: 'focus', type: 'choice', question: 5, multiple: true, title: '¿Qué partes de tu cuerpo te gustaría mejorar?', options: [option('arms', 'Brazos tonificados'), option('belly', 'Vientre plano'), option('glutes', 'Glúteos redondos'), option('legs', 'Piernas'), option('all', 'Adelgazamiento total')] },
  { id: 'history', type: 'choice', question: 6, title: '¿Hace cuánto tiempo estuviste en la mejor forma de tu vida?', options: [option('recent', 'Hace menos de un año', { icon: '✦' }), option('one-two', 'Hace entre 1 y 2 años', { icon: '☺' }), option('three-plus', 'Hace más de 3 años', { icon: '♡' }), option('happy', 'Estoy feliz con mi imagen corporal', { icon: '☀' }), option('never', 'Nunca', { icon: '×' })] },
  { id: 'experience', type: 'choice', question: 7, title: '¿Cuál es tu experiencia bailando?', options: [option('beginner', 'Soy principiante', { detail: 'Estoy empezando', icon: '♪' }), option('intermediate', 'Intermedia', { detail: 'Tengo algo de experiencia', icon: '♫' }), option('advanced', 'Experimentada', { detail: 'Me siento segura bailando', icon: '✦' })] },
  { id: 'weightStory', type: 'choice', question: 8, title: '¿Qué frase te describe mejor?', options: [option('easy', 'SUBO DE PESO CON FACILIDAD', { curve: 'up' }), option('varies', 'MI PESO VARÍA BASTANTE', { curve: 'wave' }), option('hard', 'ME CUESTA ADELGAZAR', { curve: 'flat' }), option('unsure', 'NO ESTOY SEGURA', { curve: 'zigzag' })] },
  { id: 'proof', type: 'proof', title: 'No tienes que <em>sufrir</em> para adelgazar' },
  { id: 'activity', type: 'choice', question: 9, title: '¿Con qué frecuencia haces ejercicio?', subtitle: 'El programa de entrenamiento se personalizará de acuerdo con tu condición física.', options: [option('none', 'No hago ejercicio', { level: 1 }), option('monthly', '1–2 veces al mes', { level: 2 }), option('weekly', '1–2 veces a la semana', { level: 3 }), option('often', '3–4 veces a la semana', { level: 4 }), option('daily', 'Casi todos los días', { level: 5 })] },
  { id: 'duration', type: 'choice', question: 10, title: '¿Cuánto tiempo quieres que duren tus clases?', subtitle: 'Elegiremos clases ligeras que se adapten a tu día.', options: [option('10', '0–10 minutos', { detail: 'Solo tengo unos minutos', icon: '◷' }), option('15', '11–15 minutos', { detail: 'Puedo hacerlo rápido', icon: '◷' }), option('30', '16–30 minutos', { detail: 'Puedo dedicar un poco más', icon: '◷' }), option('auto', 'Deja que DANCEFIT decida', { icon: '♫' })] },
  { id: 'rhythm', type: 'choice', question: 11, title: '¿Qué ritmo te animaría más?', subtitle: 'Tu plan se adaptará a los ritmos que más te gusten. ♡', options: [option('energetic', 'BAILES ANIMADOS', { detail: 'FITDANCE / ZUMBA', image: 'ritmo1' }), option('light', 'RITMOS LIGEROS Y DIVERTIDOS', { detail: 'SERTANEJO / FORRÓ', image: 'ritmo2' }), option('auto', 'QUIERO QUE DANCEFIT ELIJA POR MÍ', { detail: '✦ Recomendado para ti', icon: '♫' })] },
  { id: 'loading1', type: 'loading', title: 'Creando tu <em>plan de baile…</em>', subtitle: 'Estamos personalizando todo según tus preferencias y objetivos. ♡' },
  { id: 'event', type: 'choice', question: 12, confirm: true, title: '¿Tienes algún evento importante próximamente?', subtitle: 'Tener algo emocionante esperándote te hará sentir más motivada.', options: [option('holiday', 'Vacaciones', { icon: '✈' }), option('wedding', 'Boda', { icon: '♡' }), option('sport', 'Evento deportivo', { icon: '★' }), option('beach', 'Viaje a la playa', { icon: '☀' }), option('reunion', 'Reunión', { icon: '✦' }), option('family', 'Ocasión familiar', { icon: '♧' }), option('other', 'Otro', { icon: '…' }), option('none', 'No', { icon: '—' })] },
  { id: 'limitations', type: 'choice', question: 13, multiple: true, title: '¿Tienes molestias en alguna de estas zonas?', subtitle: 'Podemos filtrar entrenamientos ligeros para ti.', options: [option('back', 'Tengo la espalda sensible'), option('knees', 'Tengo las rodillas sensibles'), option('arms', 'Tengo los brazos sensibles'), option('shoulder', 'Tengo un hombro sensible'), option('none', 'Ninguna de las anteriores')] },
  { id: 'height', type: 'measure', question: 14, title: '¿Cuál es tu altura?', metric: 'cm', imperial: 'pulg', min: 120, max: 220, initial: 165 },
  { id: 'weight', type: 'measure', question: 15, title: '¿Cuál es tu peso?', metric: 'kg', imperial: 'lb', min: 35, max: 250, initial: 70 },
  { id: 'target', type: 'measure', question: 16, title: '¿Cuál es tu objetivo de peso?', metric: 'kg', imperial: 'lb', min: 35, max: 250, initial: 60 },
  { id: 'summary', type: 'summary', title: '¡Gracias por tus respuestas!', subtitle: 'Aquí está el resumen de tu nivel de condición física.' },
  { id: 'name', type: 'name', question: 17, title: '¿Cuál es tu nombre?', subtitle: '¡Queremos crear un plan 100% personalizado para ti! Para que tengas el mejor resultado posible.' },
  { id: 'loading2', type: 'testimonials', title: 'Creando tu plan personalizado…' },
  { id: 'projection', type: 'projection', title: 'Creemos que este es el plan que necesitas, diferente a cualquier otro.' },
  { id: 'plan', type: 'plan' },
  { id: 'offer', type: 'offer' },
];

export const LOADING_ITEMS = [
  ['Analizando tu perfil', 'Entendiendo tus objetivos y tu rutina'],
  ['Eligiendo tus ritmos favoritos', 'Seleccionando estilos que se adapten a ti'],
  ['Ajustando la intensidad ideal', 'De acuerdo con tu nivel y tiempo libre'],
  ['Creando tu plan personalizado', 'Organizando las clases para ti'],
  ['Finalizando tu plan DanceFit', '¡Casi listo!'],
];

export const TESTIMONIALS = [
  { name: 'Camila Ferreira', handle: '@camila.ferreira', text: 'No era solo por el peso, era por el desánimo… Hoy tengo mucha más energía y ánimo.' },
  { name: 'Márcia B.', handle: '@marcia.b', text: '¡Empecé pensando que no iba a poder y en pocas semanas ya sentía la diferencia en mi cuerpo y en mi estado de ánimo!' },
];

export const FAQ = [
  ['¿Qué es DanceFit?', 'DanceFit es una aplicación que ofrece rutinas cortas de baile adaptadas a todos los niveles de condición física — de 5 a 30 minutos al día — para que te muevas al ritmo de tu cuerpo.'],
  ['¿Qué es un programa personalizado?', 'Es un desafío de 28 días hecho a medida de tus objetivos y preferencias. Tú eliges el tiempo por día y la aplicación organiza las clases para tu nivel.'],
  ['¿Cuándo veré los resultados?', 'Depende de varios factores, pero la mayoría de las alumnas informa más ánimo y energía en los primeros 28 días.'],
];
