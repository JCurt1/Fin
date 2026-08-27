import { DEFAULT_STATE } from '../js/state/defaults.js';
import { computeAll } from '../js/calculations/index.js';
import { assertTrue } from './test-utils.mjs';

// A large, all-traditional pre-tax balance with a TINY spending need. If RMDs are
// working, crossing the RMD age threshold should force a distribution well beyond what
// this household would ever withdraw for its own $6k/yr spending need — visible as a
// sharp drop in the pre-tax bucket's year-over-year growth rate right at that age,
// even though growth in every year just before it was a steady ~5%/yr (DRAWDOWN_GROWTH_RATE
// with negligible expense drag). Without RMD enforcement, this bucket would just keep
// compounding at ~5%/yr indefinitely, since nothing else touches it at this spending level.
const state = {
  ...DEFAULT_STATE,
  initialAge: 40,
  targetHorizonAge: 65,
  retirement: 5_000_000,
  currentTradSplitPercent: 100,
  futureTradSplitPercent: 100,
  brokerage: 0,
  cash: 0,
  homeValue: 0,
  mortgage: 0,
  consumerDebt: 0,
  hsaBalance: 0,
  hsaCostMonthly: 0,
  monthlyExpenses: 500,
  deferral401k: 0,
  employerMatchRate: 0,
  annualSalaryGrowth: 0,
  annualExpenseGrowth: 0,
};

const result = computeAll(state);
const timeline = result.simulation.drawdownTimelineData;
const rowByAge = (age) => timeline.find(r => r.age === age);

// birthYear = currentYear - 40, well after 1959 -> RMD age is 75 (see rmdStartAge).
const rmdAge = 75;
const [prev2, prev1, atRmd] = [rowByAge(rmdAge - 2), rowByAge(rmdAge - 1), rowByAge(rmdAge)];
assertTrue(!!prev2 && !!prev1 && !!atRmd, 'RMD test: expected timeline rows around the RMD age to exist');

const growthRate = (fromRow, toRow) => (toRow.preTax - fromRow.preTax) / fromRow.preTax;
const preRmdGrowthRate = growthRate(prev2, prev1);
const rmdYearGrowthRate = growthRate(prev1, atRmd);

// Pre-RMD years should show steady, healthy growth (close to the 5% drawdown growth
// rate) since this household barely touches its pre-tax bucket for spending.
assertTrue(
  preRmdGrowthRate > 0.03,
  `RMD test: expected steady pre-RMD growth (~5%/yr), got ${(preRmdGrowthRate * 100).toFixed(2)}%`
);

// The RMD year should show a sharply lower (here, even negative) growth rate — proof
// that a forced distribution, not the household's own tiny spending need, pulled a
// large chunk out of the bucket that year.
assertTrue(
  rmdYearGrowthRate < preRmdGrowthRate - 0.03,
  `RMD test: expected a sharp growth-rate drop at the RMD age (pre-RMD ${(preRmdGrowthRate * 100).toFixed(2)}%, ` +
  `at-RMD ${(rmdYearGrowthRate * 100).toFixed(2)}%) — RMD enforcement may be broken`
);

console.log('RMD forcing test passed.');
