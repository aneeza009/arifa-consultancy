// Checks the gratuity maths against the worked example in Content Pack C5 / Tool 1.
import test from 'node:test';
import assert from 'node:assert/strict';
import { gratuity, yearsBetween } from '../js/lib/gratuity.js';

const near = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} !≈ ${b}`);

test('worked example: AED 8,000 basic, 6 years → ≈ AED 36,000, cap AED 192,000', () => {
  const r = gratuity({ basic: 8000, years: 6 });
  assert.equal(r.eligible, true);
  near(r.daily, 266.6667, 0.001);
  near(r.total, 36000);
  assert.equal(r.cap, 192000);
  assert.equal(r.capped, false);
});

test('five years exactly uses 21 days only: 21 × 266.67 × 5 = 28,000', () => {
  near(gratuity({ basic: 8000, years: 5 }).total, 28000);
});

test('under one year → not eligible', () => {
  assert.equal(gratuity({ basic: 8000, years: 0.9 }).eligible, false);
});

test('cap at two years’ wage is applied', () => {
  const r = gratuity({ basic: 1000, years: 60 });
  assert.equal(r.capped, true);
  assert.equal(r.total, 24000);
});

test('invalid input', () => {
  assert.equal(gratuity({ basic: 0, years: 3 }).valid, false);
  assert.equal(gratuity({ basic: 5000, years: NaN }).valid, false);
});

test('yearsBetween uses 365.25-day years', () => {
  near(yearsBetween(new Date('2020-01-01'), new Date('2026-01-01')), 5.9959, 0.01);
});
