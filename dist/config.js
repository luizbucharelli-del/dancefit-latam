// Configuración comercial: sustituye checkoutUrl por el enlace real de pago.
export const CONFIG = Object.freeze({
  checkoutUrl: '',
  price: 9.90,
  currency: 'USD',
  // No se muestra un precio tachado igual al precio de venta.
  compareAtPrice: null,
  guaranteeDays: 7,
  programDays: 28,
  // Sin fecha real de vencimiento no se muestra un contador de urgencia.
  offerEndsAt: null,
});
