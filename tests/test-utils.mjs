// Minimal deterministic PRNG (mulberry32) used only in tests to make the Monte Carlo
// engine's output reproducible. Not used anywhere in production code — the app always
// defaults to real Math.random() unless a caller explicitly injects an rng, which only
// these tests do.
export function makeSeededRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function assertClose(actual, expected, label, tolerance = 1) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ~${expected}, got ${actual}`);
  }
}

export function assertTrue(condition, label) {
  if (!condition) {
    throw new Error(`${label}: expected condition to be true`);
  }
}
