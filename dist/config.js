// Configuración comercial: sustituye checkoutUrl por el enlace real de pago.
export const CONFIG = Object.freeze({
  checkoutUrl: '',
  price: 9.90,
  currency: 'USD',
  // No se muestra un precio tachado igual al precio de venta.
  compareAtPrice: null,
  guaranteeDays: 7,
  programDays: 28,
  // Temporizador orientativo: no limita la compra.
  reviewDurationSeconds: 8 * 60 + 19,
});
