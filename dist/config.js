// Configuración comercial: sustituye checkoutUrl por el enlace real de pago.
export const CONFIG = Object.freeze({
  checkoutUrl: '',
  price: 9.90,
  currency: 'USD',
  // No se muestra un precio tachado igual al precio de venta.
  compareAtPrice: null,
  guaranteeDays: 7,
  programDays: 28,
  // Una única ventana por navegador para esta oferta. No reinicia al recargar.
  offerId: 'dancefit-usd990-v1',
  offerDurationMinutes: 10,
});
