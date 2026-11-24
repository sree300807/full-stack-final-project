// Currency formatting and supported currency definitions

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)', locale: 'en-AU' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', locale: 'ar-AE' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar (SGD)', locale: 'en-SG' },
];

export function getCurrencyConfig(currencyCode = 'INR') {
  return CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
}

/**
 * Format an amount with currency symbol, commas, and fixed decimals
 * @param {number} amount
 * @param {string} currencyCode
 * @param {boolean} showSign - whether to explicitly prefix with +/-
 */
export function formatCurrency(amount, currencyCode = 'INR', showSign = false) {
  const numericAmount = Number(amount) || 0;
  const config = getCurrencyConfig(currencyCode);
  const isNegative = numericAmount < 0;
  const absAmount = Math.abs(numericAmount);

  // Use Intl.NumberFormat for precision & locale commas
  const formattedNumber = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.code === 'JPY' ? 0 : 2,
    maximumFractionDigits: config.code === 'JPY' ? 0 : 2,
  }).format(absAmount);

  let result = `${config.symbol}${formattedNumber}`;

  if (showSign) {
    if (numericAmount > 0) return `+${result}`;
    if (numericAmount < 0) return `-${result}`;
    return result;
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Compact currency formatting (e.g., ₹1.2L or $15.5k for small chart labels)
 */
export function formatCompactCurrency(amount, currencyCode = 'INR') {
  const num = Number(amount) || 0;
  const config = getCurrencyConfig(currencyCode);

  if (currencyCode === 'INR') {
    if (Math.abs(num) >= 10000000) return `${config.symbol}${(num / 10000000).toFixed(1)}Cr`;
    if (Math.abs(num) >= 100000) return `${config.symbol}${(num / 100000).toFixed(1)}L`;
    if (Math.abs(num) >= 1000) return `${config.symbol}${(num / 1000).toFixed(1)}k`;
  } else {
    if (Math.abs(num) >= 1000000) return `${config.symbol}${(num / 1000000).toFixed(1)}M`;
    if (Math.abs(num) >= 1000) return `${config.symbol}${(num / 1000).toFixed(1)}k`;
  }

  return `${config.symbol}${num.toLocaleString()}`;
}
