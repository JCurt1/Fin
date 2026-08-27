import { DEFAULT_STATE } from '../js/state/defaults.js';
import { computeAll } from '../js/calculations/index.js';
import { assertTrue } from './test-utils.mjs';

// A near-zero starting portfolio retiring almost immediately (age 64 -> 65) with normal
// expenses guarantees the portfolio depletes right at retirement. Once combinedAssets
// hits zero, unmet spending must become real, compounding debt (see the comment in
// wealth-simulation.js explaining this was previously a bug: net worth would freeze at
// a flat $0 forever regardless of how many more years of unmet spending followed).
const state = {
  ...DEFAULT_STATE,
  initialAge: 64,
  targetHorizonAge: 65,
  retirement: 1000,
  brokerage: 0,
  cash: 0,
  homeValue: 0,
  mortgage: 0,
  consumerDebt: 0,
};

const result = computeAll(state);
const timeline = result.simulation.drawdownTimelineData;

assertTrue(timeline.length > 5, 'Debt spiral test: expected a multi-year drawdown timeline');

// Every single value from retirement onward should be at or below zero — the portfolio
// never recovers once depleted at this spending level.
const allNonPositive = timeline.every(r => r.totalWealth <= 0);
assertTrue(allNonPositive, 'Debt spiral test: expected total wealth to stay at or below zero once depleted');

// The core regression check: net worth must NOT flatline at a fixed number. Each
// subsequent year should be strictly more negative than the last, proving the shortfall
// is compounding as real debt rather than being silently discarded.
for (let i = 1; i < timeline.length; i++) {
  const prior = timeline[i - 1].totalWealth;
  const current = timeline[i].totalWealth;
  assertTrue(
    current < prior,
    `Debt spiral test: expected age ${timeline[i].age}'s total wealth (${Math.round(current)}) to be more ` +
    `negative than age ${timeline[i - 1].age}'s (${Math.round(prior)}) — net worth may be flatlining instead of compounding as debt`
  );
}

// Sanity check the shape of the spiral: the debt in the final year should be
// substantially larger in magnitude than in the first depleted year — a real,
// meaningfully worsening trajectory, not a rounding-level difference.
const firstDepletedWealth = timeline[0].totalWealth;
const finalWealth = timeline[timeline.length - 1].totalWealth;
assertTrue(
  Math.abs(finalWealth) > Math.abs(firstDepletedWealth) * 3,
  `Debt spiral test: expected the debt to grow substantially over the horizon (first: ${Math.round(firstDepletedWealth)}, ` +
  `final: ${Math.round(finalWealth)})`
);

console.log('Debt spiral test passed.');
