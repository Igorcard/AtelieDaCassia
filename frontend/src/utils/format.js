/**
 * Format helpers for display (currency, date, etc.).
 */

/**
 * Format number as BRL currency.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}
