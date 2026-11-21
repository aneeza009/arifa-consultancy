// Gratuity estimator — Content Pack E, Tool 1 (⚠️ formula to be confirmed by Arifa).
// Based on BASIC wage only. 21 days' basic per year for the first five years, 30 days after.
// daily = basic / 30. Cap = basic × 24 (two years' wage). Under one year: not usually eligible.

export const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

export function yearsBetween(start, end) {
  return (end.getTime() - start.getTime()) / MS_PER_YEAR;
}

export function gratuity({ basic, years }) {
  if (!(basic > 0) || !(years >= 0)) return { valid: false };
  if (years < 1) return { valid: true, eligible: false };
  const daily = basic / 30;
  const raw = years <= 5 ? 21 * daily * years : 21 * daily * 5 + 30 * daily * (years - 5);
  const cap = basic * 24;
  return { valid: true, eligible: true, daily, raw, cap, total: Math.min(raw, cap), capped: raw > cap };
}

export const aed = (n) => `AED ${Math.round(n).toLocaleString('en-GB')}`;
