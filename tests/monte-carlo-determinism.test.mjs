import { DEFAULT_STATE } from '../js/state/defaults.js';
import { computeAll } from '../js/calculations/index.js';
import { runMonteCarloSimulation } from '../js/calculations/wealth-simulation.js';
import { makeSeededRng, assertTrue } from './test-utils.mjs';

// A healthy, well-funded household (unlike DEFAULT_STATE, which is deliberately a
// deficit scenario per compute-all.test.mjs) — needed here so outcomes actually vary
// with market luck instead of failing 100% of trials regardless of the RNG.
const state = {
  ...DEFAULT_STATE,
  grossIncome: 120000,
  monthlyExpenses: 3200,
  retirement: 400000,
  brokerage: 150000,
  cash: 20000,
  consumerDebt: 0,
  deferral401k: 15,
  initialAge: 45,
  targetHorizonAge: 65,
};

const result = computeAll(state);
const snapshot = result.simulation.drawdownTimelineData?.[0];
const preTaxRatioAtRetirement = snapshot
  ? snapshot.preTax / (snapshot.preTax + snapshot.roth + snapshot.brokerage + 0.01)
  : 0.5;

function runMc(rng) {
  return runMonteCarloSimulation(
    result.state,
    result.simulation.terminalNW,
    preTaxRatioAtRetirement,
    result.simulation.mcAccumulationSchedule,
    rng
  );
}

const mcSeed42Run1 = runMc(makeSeededRng(42));
const mcSeed42Run2 = runMc(makeSeededRng(42));
const mcSeed999 = runMc(makeSeededRng(999));

// Same seed must produce bit-for-bit identical output — this is what actually makes the
// Monte Carlo engine testable at all. Before rng injection, every call used raw
// Math.random() and no assertion here could ever be written reliably.
assertTrue(
  mcSeed42Run1.p50Baseline === mcSeed42Run2.p50Baseline,
  `MC determinism test: same seed produced different p50 baselines (${mcSeed42Run1.p50Baseline} vs ${mcSeed42Run2.p50Baseline})`
);
assertTrue(
  mcSeed42Run1.probabilityOfSuccess === mcSeed42Run2.probabilityOfSuccess,
  'MC determinism test: same seed produced different success probabilities'
);
assertTrue(
  JSON.stringify(mcSeed42Run1.p50Path) === JSON.stringify(mcSeed42Run2.p50Path),
  'MC determinism test: same seed produced a different full median path'
);

// A different seed must actually change the outcome — proves the injected rng is really
// being consumed throughout the engine (accumulation replay, drawdown draws, and the LTC
// discrete-event rolls), not silently ignored in favor of Math.random() somewhere.
assertTrue(
  mcSeed42Run1.p50Baseline !== mcSeed999.p50Baseline,
  'MC determinism test: different seeds produced identical output — rng may not be wired through everywhere'
);

// Basic sanity bounds on the output shape, independent of the specific seed.
assertTrue(
  mcSeed42Run1.probabilityOfSuccess >= 0 && mcSeed42Run1.probabilityOfSuccess <= 100,
  'MC determinism test: probabilityOfSuccess out of [0, 100] range'
);

console.log('Monte Carlo determinism test passed.');
