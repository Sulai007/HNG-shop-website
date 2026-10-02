/**
 * Centralized currency formatting utility for Nova Stores / NovaTrend.
 * Consistently uses Math.round() for integer precision and formats with the 
 * Nigerian Naira (₦) symbol and standard locale comma separation.
 */
export function formatNaira(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₦0';
  }
  const rounded = Math.round(amount);
  return `₦${rounded.toLocaleString('en-NG')}`;
}

/**
 * Standard alias for formatNaira across storefront components.
 */
export const formatPrice = formatNaira;
