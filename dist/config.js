// Configuración comercial. Cada plan tiene su propio enlace de pago en Centerpag.
// `days`: duración del acceso, usada para mostrar el valor por día (null = vitalicio, sin valor por día).
// `featured`: plan destacado y preseleccionado.
export const CONFIG = Object.freeze({
  plans: Object.freeze([
    Object.freeze({ id: 'monthly', name: 'Plan Mensual', access: '1 mes de acceso', price: 9.90, compareAtPrice: 19.90, days: 30, checkoutUrl: 'https://go.centerpag.com/PPU38CQGJHK' }),
    Object.freeze({ id: 'semiannual', name: 'Plan Semestral', access: '6 meses de acceso', price: 14.90, compareAtPrice: 39.90, days: 180, checkoutUrl: 'https://go.centerpag.com/PPU38CQH1MU', badge: 'MÁS POPULAR', featured: true }),
    Object.freeze({ id: 'lifetime', name: 'Plan Vitalicio', access: 'Acceso para siempre', price: 19.90, compareAtPrice: 59.90, days: null, checkoutUrl: 'https://go.centerpag.com/PPU38CQH1N3' }),
  ]),
  currency: 'USD',
  guaranteeDays: 7,
  programDays: 28,
  // Temporizador orientativo: no limita la compra.
  reviewDurationSeconds: 8 * 60 + 19,
});
